/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateStringLibrary, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData } from '@app/models';

import { AccountChartStateSelector,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHandler } from '@app/shared/utils';

import { combineLatest } from 'rxjs';

export enum VouchersUploaderEventType {
  CLOSE_MODAL_CLICKED  = 'VouchersUploaderComponent.Event.CloseModalClicked',
  IMPORT_VOUCHERS = 'VouchersUploaderComponent.Event.ImportVouchers',
}

enum VouchersUploaderFormControls {
  recordingDate = 'recordingDate',
  accountsChartUID = 'accountsChartUID',
  transactionTypeUID = 'transactionTypeUID',
  distributeVouchers = 'distributeVouchers',
  generateSubledgerAccount = 'generateSubledgerAccount',
  canEditVoucherEntries = 'canEditVoucherEntries',
}

@Component({
  selector: 'emp-fa-vouchers-uploader',
  templateUrl: './vouchers-uploader.component.html',
})
export class VouchersUploaderComponent implements OnInit, OnDestroy {

  @Output() vouchersUploaderEvent = new EventEmitter<EventInfo>();

  file = null;

  formHandler: FormHandler;

  controls = VouchersUploaderFormControls;

  isFormInvalidated = false;

  isLoading = false;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  transactionTypesList: Identifiable[] = [];

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit(): void {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get showFileError(): boolean {
    return this.isFormInvalidated && !this.file;
  }


  onClose() {
    this.sendEvent(VouchersUploaderEventType.CLOSE_MODAL_CLICKED);
  }


  onSubmitForm() {
    this.isFormInvalidated = !this.formHandler.validateReadyForSubmit() || !this.file;

    if (this.isFormInvalidated) {
      this.formHandler.invalidateForm();
      return;
    }

    this.sendEvent(VouchersUploaderEventType.IMPORT_VOUCHERS, this.getFormData());
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<AccountsChartMasterData[]>
        (AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.TRANSACTION_TYPES_LIST),
    ])
    .subscribe(([x, y]) => {
      this.accountsChartMasterDataList = x;
      this.transactionTypesList = y;
      this.isLoading = false;
    });
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        recordingDate: new FormControl(DateStringLibrary.today(), Validators.required),
        accountsChartUID: new FormControl('', Validators.required),
        transactionTypeUID: new FormControl('', Validators.required),
        distributeVouchers: new FormControl(false),
        generateSubledgerAccount: new FormControl(false),
        canEditVoucherEntries: new FormControl(true),
      })
    );
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: any = {
      file: this.file.file,
      recordingDate: formModel.recordingDate,
      accountsChartUID: formModel.accountsChartUID,
      transactionTypeUID: formModel.transactionTypeUID,
      distributeVouchers: formModel.distributeVouchers,
      generateSubledgerAccount: formModel.generateSubledgerAccount,
      canEditVoucherEntries: formModel.canEditVoucherEntries,
    };

    return data;
  }


  private sendEvent(eventType: VouchersUploaderEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.vouchersUploaderEvent.emit(event);
  }

}
