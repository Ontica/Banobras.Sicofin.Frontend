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

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, EmptyVoucher, Voucher } from '@app/models';

import { AccountChartStateSelector,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHandler, sendEvent } from '@app/shared/utils';

export enum VoucherHeaderComponentEventType {
  CREATE_VOUCHER = 'VoucherHeaderFormControls.Event.CreateVoucher',
  UPDATE_VOUCHER = 'VoucherHeaderFormControls.Event.UpdateVoucher',
  ADD_VOUCHER_ENTRY_CLICKED = 'VoucherHeaderFormControls.Event.AddVoucherEntryClicked',
}

enum VoucherHeaderFormControls {
  voucherType = 'voucherType',
  concept = 'concept',
  accountsChart = 'accountsChart',
  ledger = 'ledger',
  functionalArea = 'functionalArea',
  accountingDate = 'accountingDate',
  valueDate = 'valueDate',
}

@Component({
  selector: 'emp-fa-voucher-header',
  templateUrl: './voucher-header.component.html',
})
export class VoucherHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() voucher: Voucher = EmptyVoucher;

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
    return this.voucher && this.voucher.id > 0;
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

    sendEvent(this.voucherHeaderEvent, eventType, {voucher: this.getFormData()});
  }


  onAddVoucherEntryClicked() {
    sendEvent(this.voucherHeaderEvent, VoucherHeaderComponentEventType.ADD_VOUCHER_ENTRY_CLICKED);
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

      this.setAccountChartSelected();

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
        accountsChart: new FormControl('', Validators.required),
        ledger: new FormControl('', Validators.required),
        functionalArea: new FormControl('', Validators.required),
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
      voucherType: this.voucher.voucherType.uid || '',
      concept: this.voucher.concept || '',
      accountsChart: this.voucher.accountsChart.uid || '',
      ledger: this.voucher.ledger.uid || '',
      functionalArea: this.voucher.functionalArea.uid || '',
      accountingDate: this.voucher.accountingDate || '',
      valueDate: '', // this.voucher.valueDate || '',
    });

    this.hasValueDate = false; // !!this.voucher.valueDate;
    this.setAccountChartSelected();
    this.setRequiredFormFields();
  }


  private disableForm(disable) {
    this.formHandler.disableForm(disable);
  }


  private setAccountChartSelected() {
    if (this.accountsChartMasterDataList.length === 0 || isEmpty(this.voucher.accountsChart)) {
      return;
    }

    const accountChart =
      this.accountsChartMasterDataList.filter(x => x.uid === this.voucher.accountsChart.uid);

    if (accountChart.length > 0) {
      this.accountChartSelected = accountChart[0];
    }
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
      accountsChart: formModel.accountsChart ?? '',
      ledger: formModel.ledger ?? '',
      functionalArea: formModel.functionalArea ?? '',
      accountingDate: formModel.accountingDate ?? '',
      valueDate: formModel.valueDate ?? '',
    };

    return data;
  }

}
