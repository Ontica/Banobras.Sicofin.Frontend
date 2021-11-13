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

import { EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, EmptyVoucher, Ledger, Voucher, VoucherFields,
         VoucherSpecialCaseType } from '@app/models';

import { AccountChartStateSelector,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { VouchersDataService } from '@app/data-services';

import { DateTimeFormatPipe } from '@app/shared/pipes/date-time-format.pipe';

export enum VoucherHeaderEventType {
  VOUCHER_TYPE_CHANGED = 'VoucherHeaderComponent.Event.VoucherTypeChanged',
  FIELDS_CHANGED = 'VoucherHeaderComponent.Event.FieldsChanged',
}

enum VoucherHeaderFormControls {
  voucherTypeUID = 'voucherTypeUID',
  accountsChart = 'accountsChart',
  ledgerUID = 'ledgerUID',
  concept = 'concept',
  functionalAreaId = 'functionalAreaId',
  transactionTypeUID = 'transactionTypeUID',
  accountingDate = 'accountingDate',
}

@Component({
  selector: 'emp-fa-voucher-header',
  templateUrl: './voucher-header.component.html',
  providers: [DateTimeFormatPipe]
})
export class VoucherHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() voucher: Voucher = EmptyVoucher;

  @Input() editionMode = true;

  @Input() isSpecialCase = false;

  @Output() voucherHeaderEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;
  controls = VoucherHeaderFormControls;
  isLoading = false;
  isLoadingAccountingDates = false;

  hasValueDate = false;
  accountChartSelected: AccountsChartMasterData = null;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];
  voucherTypesList: Identifiable[] = [];
  voucherSpecialCaseTypesList: VoucherSpecialCaseType[] = [];
  functionalAreasList: Identifiable[] = [];
  transactionTypesList: Identifiable[] = [];
  accountingDatesList: Identifiable[] = [];

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private vouchersData: VouchersDataService,
              private dateTimeFormat: DateTimeFormatPipe) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit(): void {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucher || changes.editionMode) {
      this.enableEditor(this.editionMode);
    }

    if (changes.isSpecialCase) {
      this.setFormData();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isSavedVoucher() {
    return this.voucher && this.voucher.id > 0;
  }


  get hasEntries() {
    return this.voucher.entries.length > 0;
  }


  enableEditor(enable) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.disableForm(!this.editionMode);
    this.validateDisabledFieldsByHasEntries();
  }


  invalidateForm() {
    this.formHandler.invalidateForm();
  }


  onVoucherTypeChanges(voucherType: VoucherSpecialCaseType) {
    const payload = { voucherType: isEmpty(voucherType) ? null : voucherType };
    sendEvent(this.voucherHeaderEvent, VoucherHeaderEventType.VOUCHER_TYPE_CHANGED, payload);
  }


  onAccountChartChanges(accountChart: AccountsChartMasterData) {
    this.accountChartSelected = accountChart;
    this.formHandler.getControl(this.controls.ledgerUID).reset();
  }


  onLedgerChanges(ledger: Ledger) {
    if (!!ledger.uid) {
      this.getOpenedAccountingDates(ledger.uid);
    }
  }


  onHasValueDateChange() {
    this.formHandler.getControl(this.controls.accountingDate).reset();
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(VoucherStateSelector.VOUCHER_TYPES_LIST),
      this.helper.select<VoucherSpecialCaseType[]>(VoucherStateSelector.VOUCHER_SPECIAL_CASE_TYPES_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.TRANSACTION_TYPES_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.FUNCTIONAL_AREAS_LIST),
      this.helper.select<AccountsChartMasterData[]>
        (AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
    ])
    .subscribe(([a, b, c, d, e]) => {
      this.voucherTypesList = a;
      this.voucherSpecialCaseTypesList = b;
      this.transactionTypesList = c;
      this.functionalAreasList = d;
      this.accountsChartMasterDataList = e;

      this.setAccountChartSelected();
      this.isLoading = false;
    });
  }


  private getOpenedAccountingDates(ledgerUID: string, initialLoad: boolean = false) {
    this.isLoadingAccountingDates = true;

    this.vouchersData.getOpenedAccountingDates(ledgerUID)
      .toPromise()
      .then(x => {
        this.accountingDatesList =
          x.map(item => Object.create({ uid: item, name: this.dateTimeFormat.transform(item) }));

        if (initialLoad) {
          this.hasValueDate = this.voucher.id > 0 ? !x.includes(this.voucher.accountingDate) : false;
        }
        }, error => this.accountingDatesList = [])
      .finally(() => this.isLoadingAccountingDates = false);
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        voucherTypeUID: new FormControl('', Validators.required),
        accountsChart: new FormControl('', Validators.required),
        ledgerUID: new FormControl('', Validators.required),
        concept: new FormControl('', Validators.required),
        functionalAreaId: new FormControl('', Validators.required),
        transactionTypeUID: new FormControl('', Validators.required),
        accountingDate: new FormControl('', Validators.required),
      })
    );

    this.formHandler.form.valueChanges.subscribe(v => this.emitChanges());
  }


  private emitChanges() {
    const payload = {
      isFormValid: this.formHandler.form.valid,
      voucher: this.getFormData(),
    };

    sendEvent(this.voucherHeaderEvent, VoucherHeaderEventType.FIELDS_CHANGED, payload);
  }


  private setFormData() {
    if (!this.isSavedVoucher) {
      this.formHandler.form.reset();
      return;
    }

    this.formHandler.form.reset({
      voucherTypeUID: this.voucher.voucherType.uid || '',
      accountsChart: this.voucher.accountsChart.uid || '',
      ledgerUID: this.voucher.ledger.uid || '',
      concept: this.voucher.concept || '',
      functionalAreaId: this.voucher.functionalArea.uid || '',
      transactionTypeUID: this.voucher.transactionType.uid || '',
      accountingDate: this.voucher.accountingDate || '',
    });

    this.setAccountChartSelected();
    this.getOpenedAccountingDates(this.voucher.ledger.uid, true);
  }


  private disableForm(disable) {
    this.formHandler.disableForm(disable);
  }


  private validateDisabledFieldsByHasEntries() {
    if (this.editionMode) {
      this.formHandler.disableControl(this.controls.accountsChart, this.hasEntries);
      this.formHandler.disableControl(this.controls.ledgerUID, this.hasEntries);
    }
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


  private getFormData(): VoucherFields {
    const formModel = this.formHandler.form.getRawValue();

    const data: VoucherFields = {
      voucherTypeUID: formModel.voucherTypeUID ?? '',
      ledgerUID: formModel.ledgerUID ?? '',
      concept: formModel.concept ?? '',
      functionalAreaId: formModel.functionalAreaId ?? '',
      transactionTypeUID: formModel.transactionTypeUID ?? '',
      accountingDate: formModel.accountingDate ?? '',
    };

    return data;
  }

}
