/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';


import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData } from '@app/models';

import { AccountChartStateSelector,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHandler } from '@app/shared/utils';

export enum VoucherHeaderComponentEventType {
  CREATE_VOUCHER = 'VoucherHeaderFormControls.Event.CreateVoucher',
  UPDATE_VOUCHER = 'VoucherHeaderFormControls.Event.UpdateVoucher',
}

enum VoucherHeaderFormControls {
  voucherType = 'voucherType',
  concept = 'concept',
  ledgerGroup = 'ledgerGroup',
  ledger = 'ledger',
  source = 'source',
  accountingDate = 'accountingDate',
  valueDate = 'valueDate',
}

@Component({
  selector: 'emp-fa-voucher-header',
  templateUrl: './voucher-header.component.html',
})
export class VoucherHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() voucher: any = null;

  @Input() readonly = false;

  @Output() voucherHeaderEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;
  controls = VoucherHeaderFormControls;
  editionMode = false;
  isLoading = false;

  hasValueDate = false;
  accountChartSelected: AccountsChartMasterData = null;
  accountsChartMasterDataList: AccountsChartMasterData[] = [];
  voucherTypesList: Identifiable[] = [];
  functionalAreasList: Identifiable[] = [];
  accountingDatesList: string[] = [];

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();

    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit(): void {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucher) {
      this.enableEditor(false);
    }
  }

  ngOnDestroy() {
    this.helper.destroy();
  }


  get showEnableEditor() {
    return this.voucher;
  }


  enableEditor(enable) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.disableForm(!this.editionMode);
  }


  onAccountChartChanges(accountChart: AccountsChartMasterData) {
    this.accountChartSelected = accountChart;
    this.formHandler.getControl(this.controls.ledger).reset();
  }


  onHasValueDateChange() {
    this.formHandler.getControl(this.controls.accountingDate).reset();
    this.formHandler.getControl(this.controls.valueDate).reset();
    this.setRequiredFormFields();
  }


  submitForm() {
    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    let eventType = VoucherHeaderComponentEventType.CREATE_VOUCHER;

    if (this.showEnableEditor) {
      eventType = VoucherHeaderComponentEventType.UPDATE_VOUCHER;
    }

    this.sendEvent(eventType, {voucher: this.getFormData()});
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<AccountsChartMasterData[]>
        (AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.FUNCTIONAL_AREAS_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.VOUCHER_TYPES_LIST),
    ])
    .subscribe(([x, y, z]) => {
      this.accountsChartMasterDataList = x;
      this.functionalAreasList = y;
      this.voucherTypesList = z;

      this.isLoading = false;
    });
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        voucherType: new FormControl('', Validators.required),
        concept: new FormControl('', Validators.required),
        ledgerGroup: new FormControl('', Validators.required),
        ledger: new FormControl('', Validators.required),
        source: new FormControl('', Validators.required),
        accountingDate: new FormControl(''),
        valueDate: new FormControl(''),
      })
    );

    this.setRequiredFormFields();
  }


  private setFormData() {
    if (!this.voucher) {
      this.formHandler.form.reset();
      return;
    }

    this.formHandler.form.reset({
      voucherType: this.voucher.voucherType || '',
      concept: this.voucher.concept || '',
      ledgerGroup: this.voucher.ledgerGroup || '',
      ledger: this.voucher.ledger || '',
      source: this.voucher.source || '',
      accountingDate: this.voucher.accountingDate || '',
      valueDate: this.voucher.valueDate || '',
    });

    this.hasValueDate = !!this.voucher.valueDate;
    this.setRequiredFormFields();
  }


  private disableForm(disable) {
    this.formHandler.disableForm(disable);
  }


  private setRequiredFormFields() {
    if (this.hasValueDate) {
      this.formHandler.clearControlValidators(this.controls.accountingDate);
      this.formHandler.setControlValidators(this.controls.valueDate, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.valueDate);
      this.formHandler.setControlValidators(this.controls.accountingDate, Validators.required);
    }
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: any = {
      voucherType: formModel.voucherType ?? '',
      concept: formModel.concept ?? '',
      ledgerGroup: formModel.ledgerGroup ?? '',
      ledger: formModel.ledger ?? '',
      source: formModel.source ?? '',
      accountingDate: formModel.accountingDate ?? '',
      valueDate: formModel.valueDate ?? '',
    };

    return data;
  }


  private sendEvent(eventType: VoucherHeaderComponentEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.voucherHeaderEvent.emit(event);
  }

}
