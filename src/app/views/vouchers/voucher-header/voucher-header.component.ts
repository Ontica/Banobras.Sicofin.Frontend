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

import { DateStringLibrary, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, EmptyVoucher, Voucher, VoucherFields,
         VoucherSpecialCaseType } from '@app/models';

import { AccountChartStateSelector,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { VouchersDataService } from '@app/data-services';

export enum VoucherHeaderEventType {
  VOUCHER_TYPE_CHANGED = 'VoucherHeaderComponent.Event.VoucherTypeChanged',
  FIELDS_CHANGED = 'VoucherHeaderComponent.Event.FieldsChanged',
}

enum VoucherHeaderFormControls {
  voucherTypeUID = 'voucherTypeUID',
  accountsChartUID = 'accountsChartUID',
  ledgerUID = 'ledgerUID',
  concept = 'concept',
  functionalAreaId = 'functionalAreaId',
  accountingDate = 'accountingDate',
}

@Component({
  selector: 'emp-fa-voucher-header',
  templateUrl: './voucher-header.component.html',
})
export class VoucherHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() voucher: Voucher = EmptyVoucher;

  @Input() editionMode = true;

  @Input() isSpecialCase = false;

  @Input() allowAllLedgersSelection = false;

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
  accountingDatesList: Identifiable[] = [];

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private vouchersData: VouchersDataService) {
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

    if (changes.allowAllLedgersSelection) {
      this.validateRequiredFormFields();
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


  get ledgerPlaceholder(): string {
    if (this.allowAllLedgersSelection) {
      return 'Todas';
    }

    return this.accountChartSelected ? 'Seleccionar' : 'Seleccionar el tipo de contabilidad';
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
    this.formHandler.getControl(this.controls.accountingDate).reset();
    this.formHandler.getControl(this.controls.ledgerUID).reset();
    this.accountChartSelected = accountChart;
    this.getOpenedAccountingDates(accountChart.uid);
  }


  onHasValueDateChange() {
    this.formHandler.getControl(this.controls.accountingDate).reset();
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(VoucherStateSelector.VOUCHER_TYPES_LIST),
      this.vouchersData.getVoucherSpecialCaseTypes(),
      this.helper.select<Identifiable[]>(VoucherStateSelector.FUNCTIONAL_AREAS_LIST),
      this.helper.select<AccountsChartMasterData[]>
        (AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
    ])
    .subscribe(([a, b, c, d]) => {
      this.voucherTypesList = a;
      this.voucherSpecialCaseTypesList = b;
      this.functionalAreasList = c;
      this.accountsChartMasterDataList = d;

      this.setAccountChartSelected();
      this.isLoading = false;
    });
  }


  private getOpenedAccountingDates(accountsChartUID: string, resetHasValueDate: boolean = false) {
    this.accountingDatesList = [];

    if (!accountsChartUID) {
      return;
    }

    this.isLoadingAccountingDates = true;

    this.vouchersData.getOpenedAccountingDates(accountsChartUID)
      .toPromise()
      .then(x => {
        this.accountingDatesList =
          x.map(item => Object.create({ uid: item, name: DateStringLibrary.format(item) }));

        if (resetHasValueDate) {
          this.resetHasValueDate();
        }
      })
      .finally(() => this.isLoadingAccountingDates = false);
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        voucherTypeUID: new FormControl('', Validators.required),
        accountsChartUID: new FormControl('', Validators.required),
        ledgerUID: new FormControl('', Validators.required),
        concept: new FormControl('', Validators.required),
        functionalAreaId: new FormControl('', Validators.required),
        accountingDate: new FormControl('', Validators.required),
      })
    );

    this.formHandler.form.valueChanges.subscribe(v => this.emitChanges());
  }


  private validateRequiredFormFields() {
    if (this.allowAllLedgersSelection) {
      this.formHandler.clearControlValidators(this.controls.ledgerUID);
    } else {
      this.formHandler.setControlValidators(this.controls.ledgerUID, Validators.required);
    }
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
      accountsChartUID: this.voucher.accountsChart.uid || '',
      ledgerUID: this.voucher.ledger.uid || '',
      concept: this.voucher.concept || '',
      functionalAreaId: this.voucher.functionalArea.uid || '',
      accountingDate: this.voucher.accountingDate || '',
    });

    this.setAccountChartSelected();
    this.getOpenedAccountingDates(this.voucher.accountsChart.uid, true);
  }


  private resetHasValueDate() {
    if (!this.isSavedVoucher) {
      this.hasValueDate = false;
      return;
    }
    this.hasValueDate = !this.accountingDatesList.find(x => x.uid === this.voucher.accountingDate);
  }


  private disableForm(disable) {
    this.formHandler.disableForm(disable);
  }


  private validateDisabledFieldsByHasEntries() {
    if (this.editionMode) {
      this.formHandler.disableControl(this.controls.accountsChartUID, this.hasEntries);
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
      accountsChartUID: formModel.accountsChartUID ?? '',
      ledgerUID: formModel.ledgerUID ?? '',
      concept: formModel.concept ?? '',
      functionalAreaId: formModel.functionalAreaId ?? '',
      accountingDate: formModel.accountingDate ?? null,
    };

    return data;
  }

}
