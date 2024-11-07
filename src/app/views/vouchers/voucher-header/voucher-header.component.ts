/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { DateString, DateStringLibrary, EventInfo, Identifiable, isEmpty, Validate } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, EmptyVoucher, Voucher, VoucherFields,
         VoucherSpecialCaseType } from '@app/models';

import { AccountChartStateSelector,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { VouchersDataService } from '@app/data-services';

export enum VoucherHeaderEventType {
  VOUCHER_TYPE_CHANGED = 'VoucherHeaderComponent.Event.VoucherTypeChanged',
  FIELDS_CHANGED = 'VoucherHeaderComponent.Event.FieldsChanged',
}

interface VoucherFormModel extends FormGroup<{
  voucherTypeUID: FormControl<string>;
  accountsChartUID: FormControl<string>;
  ledgerUID: FormControl<string>;
  concept: FormControl<string>;
  functionalAreaId: FormControl<string>;
  accountingDate: FormControl<DateString>;
}> { }

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

  form: VoucherFormModel;

  formHelper = FormHelper;

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


  ngOnInit() {
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


  get isSavedVoucher(): boolean {
    return this.voucher && this.voucher.id > 0;
  }


  get hasEntries(): boolean {
    return this.voucher.entries.length > 0;
  }


  get canEditVoucher(): boolean {
    return this.voucher.actions.editVoucher;
  }


  get canEditConcept(): boolean {
    return this.voucher.actions.changeConcept;
  }


  get hasValueDateEnabled(): boolean {
    return !this.isSavedVoucher || (this.isSavedVoucher && this.editionMode && this.canEditVoucher);
  }


  get ledgerPlaceholder(): string {
    if (this.allowAllLedgersSelection) {
      return 'Todas';
    }

    return this.accountChartSelected ? 'Seleccionar' : 'Seleccionar el tipo de contabilidad';
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.disableForm(!this.editionMode);
    this.validateDisabledFields();
  }


  invalidateForm() {
    this.formHelper.markFormControlsAsTouched(this.form);
  }


  onVoucherTypeChanges(voucherType: VoucherSpecialCaseType) {
    const payload = { voucherType: isEmpty(voucherType) ? null : voucherType };
    sendEvent(this.voucherHeaderEvent, VoucherHeaderEventType.VOUCHER_TYPE_CHANGED, payload);
  }


  onAccountChartChanges(accountChart: AccountsChartMasterData) {
    this.form.controls.accountingDate.reset();
    this.form.controls.ledgerUID.reset();
    this.accountChartSelected = accountChart;
    this.getOpenedAccountingDates(accountChart.uid);
  }


  onHasValueDateChange() {
    this.form.controls.accountingDate.reset();
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
      .firstValue()
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
    const fb = new FormBuilder();

    this.form = fb.group({
      voucherTypeUID: ['', Validators.required],
      accountsChartUID: ['', Validators.required],
      ledgerUID: ['', Validators.required],
      concept: ['', Validators.required],
      functionalAreaId: ['', Validators.required],
      accountingDate: ['' as DateString, Validators.required],
    });

    this.form.valueChanges.subscribe(v => this.emitChanges());
  }


  private validateRequiredFormFields() {
    if (this.allowAllLedgersSelection) {
      this.formHelper.clearControlValidators(this.form.controls.ledgerUID);
    } else {
      this.formHelper.setControlValidators(this.form.controls.ledgerUID, Validators.required);
    }
  }


  private emitChanges() {
    const payload = {
      isFormValid: this.form.valid,
      voucher: this.getFormData(),
    };

    sendEvent(this.voucherHeaderEvent, VoucherHeaderEventType.FIELDS_CHANGED, payload);
  }


  private setFormData() {
    if (!this.isSavedVoucher) {
      this.form.reset();
      return;
    }

    this.form.reset({
      voucherTypeUID: this.voucher.voucherType.uid || '',
      accountsChartUID: this.voucher.accountsChart.uid || '',
      ledgerUID: this.voucher.ledger.uid || '',
      concept: this.voucher.concept || '',
      functionalAreaId: this.voucher.functionalArea.uid || '',
      accountingDate: this.voucher.accountingDate || '',
    });

    this.setAccountChartSelected();
    this.getOpenedAccountingDates(this.voucher.accountsChart.uid, true);
    this.setVoucherConceptValidator();
  }


  private setVoucherConceptValidator() {
    const validators = this.canEditConcept ?
      [Validators.required, Validate.changeRequired(this.voucher.concept)] :
      [Validators.required];

    FormHelper.setControlValidators(this.form.controls.concept, validators);
  }


  private resetHasValueDate() {
    if (!this.isSavedVoucher) {
      this.hasValueDate = false;
      return;
    }
    this.hasValueDate = !this.accountingDatesList.find(x => x.uid === this.voucher.accountingDate);
  }


  private disableForm(disable: boolean) {
    this.formHelper.setDisableForm(this.form, disable);
  }


  private validateDisabledFields() {
    if (this.editionMode) {
      if (this.canEditVoucher) {
        this.formHelper.setDisableControl(this.form.controls.accountsChartUID, this.hasEntries);
        this.formHelper.setDisableControl(this.form.controls.ledgerUID, this.hasEntries);
      }

      if (this.canEditConcept) {
        this.formHelper.setDisableControl(this.form.controls.voucherTypeUID);
        this.formHelper.setDisableControl(this.form.controls.accountsChartUID);
        this.formHelper.setDisableControl(this.form.controls.ledgerUID);
        this.formHelper.setDisableControl(this.form.controls.functionalAreaId);
        this.formHelper.setDisableControl(this.form.controls.accountingDate);
      }
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
    const formModel = this.form.getRawValue();

    const data: VoucherFields = {
      voucherTypeUID: formModel.voucherTypeUID ?? '',
      accountsChartUID: formModel.accountsChartUID ?? '',
      ledgerUID: formModel.ledgerUID ?? '',
      concept: formModel.concept ?? '',
      functionalAreaId: +formModel.functionalAreaId ?? null,
      accountingDate: formModel.accountingDate ?? null,
    };

    return data;
  }

}
