/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest, concat, Observable, of, Subject } from 'rxjs';

import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { AccountRole, EmptyLedgerAccount, EmptyVoucherEntry, LedgerAccount, LedgerAccountSectorRule,
         SubsidiaryAccount, VoucherEntry, VoucherEntryFields, VoucherEntryTypeList } from '@app/models';

import { FormatLibrary, FormHandler, sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { VouchersDataService } from '@app/data-services';

import { VoucherStateSelector } from '@app/presentation/exported.presentation.types';


export enum VoucherEntryEditorEventType {
  CLOSE_MODAL_CLICKED  = 'VoucherEntryEditorComponent.Event.CloseModalClicked',
  CREATE_VOUCHER_ENTRY = 'VoucherEntryEditorComponent.Event.CreateVoucherEntry',
  UPDATE_VOUCHER_ENTRY = 'VoucherEntryEditorComponent.Event.UpdateVoucherEntry',
}

enum VoucherEntryEditorFormControls {
  voucherEntryType = 'voucherEntryType',
  ledgerAccount = 'ledgerAccount',
  sector = 'sector',
  subledgerAccount = 'subledgerAccount',
  currency = 'currency',
  amount = 'amount',
  exchangeRate = 'exchangeRate',
  baseCurrencyAmount = 'baseCurrencyAmount',
  responsibilityArea = 'responsibilityArea',
  budgetConcept = 'budgetConcept',
  eventType = 'eventType',
  verificationNumber = 'verificationNumber',
  concept = 'concept',
  date = 'date',
}

@Component({
  selector: 'emp-fa-voucher-entry-editor',
  templateUrl: './voucher-entry-editor.component.html',
})
export class VoucherEntryEditorComponent implements OnChanges, OnInit, OnDestroy {

  @Input() voucherId: number;

  @Input() voucherEntry: VoucherEntry = EmptyVoucherEntry;

  @Input() readonly = false;

  @Output() voucherEntryEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = VoucherEntryEditorFormControls;
  editionMode = false;
  isLoading = false;

  voucherEntryTypeList: Identifiable[] = VoucherEntryTypeList;
  functionalAreasList: Identifiable[] = [];
  eventTypesList: Identifiable[] = [];

  ledgerAccountList$: Observable<LedgerAccount[]>;
  ledgerAccountInput$ = new Subject<string>();
  ledgerAccountMinTermLength = 4;
  ledgerAccountLoading = false;

  subledgerAccountList$: Observable<SubsidiaryAccount[]>;
  subledgerAccountInput$ = new Subject<string>();
  subledgerAccountMinTermLength = 5;
  subledgerAccountLoading = false;

  sectorRequired = false;
  subledgerAccountRequired = false;

  constructor(private uiLayer: PresentationLayer,
              private vouchersData: VouchersDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.onLedgerAccountChanges();
  }


  ngOnInit(): void {
    this.loadDataLists();
    this.subscribeLedgerAccountList();
    this.subscribeSubledgerAccountList();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucherEntry) {
      this.editionMode = this.voucherEntry.id > 0;

      if (this.editionMode) {
        this.setFormData();
        this.validateSectorField();
        this.validateSubledgerField(this.voucherEntry.sector);
        this.validateDisableForm();
        this.subscribeLedgerAccountList();
        this.subscribeSubledgerAccountList();
      }
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get ledgerAccountSelected() {
    const ledgerAccount: LedgerAccount = this.formHandler.getControl(this.controls.ledgerAccount).value;
    return ledgerAccount?.id > 0 ? ledgerAccount : EmptyLedgerAccount;
  }


  get subledgerAccountSelected() {
    const subledgerAccount: any = this.formHandler.getControl(this.controls.subledgerAccount).value;
    return subledgerAccount?.id > 0 ? subledgerAccount : null;
  }


  get placeholderSector() {
    if (this.formHandler.getControl(this.controls.ledgerAccount).valid) {
      if (this.sectorRequired) {
        return 'Seleccionar';
      }
      return 'No aplica';
    }
    return this.readonly ? '' : 'Seleccione la cuenta';
  }


  get placeholderSubledgerAccount() {
    if (this.formHandler.getControl(this.controls.ledgerAccount).valid) {
      if (this.sectorRequired && this.formHandler.getControl(this.controls.sector).invalid) {
        return 'Seleccione el sector';
      }

      if (this.subledgerAccountRequired) {
        return 'Seleccionar';
      }
      return 'No aplica';
    }
    return this.readonly ? '' : 'Seleccione la cuenta';
  }


  get placeholderCurrency() {
    return this.formHandler.getControl(this.controls.ledgerAccount).valid ?
      'Seleccionar' : 'Seleccione la cuenta';
  }


  onClose() {
    sendEvent(this.voucherEntryEditorEvent, VoucherEntryEditorEventType.CLOSE_MODAL_CLICKED);
  }


  onLedgerAccountChanges() {
    this.formHandler.getControl(this.controls.currency).reset();
    this.formHandler.getControl(this.controls.sector).reset();
    this.validateSectorField();
    this.onSectorChanges(null);
  }


  onClearLedgerAccount() {
    this.onLedgerAccountChanges();
    this.subscribeLedgerAccountList();
    this.subscribeSubledgerAccountList();
  }


  onSectorChanges(sectorRule: LedgerAccountSectorRule) {
    this.formHandler.getControl(this.controls.subledgerAccount).reset();
    this.validateSubledgerField(sectorRule);
  }


  onClearSubledgerAccount() {
    this.subscribeSubledgerAccountList();
  }


  onCloneLastVoucherEntryClicked() {
    console.log('CLONE LAST VOUCHER ENTRY CLICKED');
  }


  onExchangeRateClicked() {
    console.log('EXCHANGE RATE CLICKED');
  }


  onCalculateBaseCurrencyAmountClicked() {
    this.setValueIfControlIsEmpty(this.controls.amount, '0.00');
    this.setValueIfControlIsEmpty(this.controls.exchangeRate, '1.000000');

    setTimeout(() => {
      const amount = FormatLibrary.stringToNumber(this.formHandler.getControl(this.controls.amount).value);
      const exchangeRate =
        FormatLibrary.stringToNumber(this.formHandler.getControl(this.controls.exchangeRate).value);
      const baseCurrencyAmount = amount * exchangeRate;

      this.formHandler.getControl(this.controls.baseCurrencyAmount)
        .reset(FormatLibrary.numberWithCommas(baseCurrencyAmount, '1.2-2'));
    });
  }


  onSubmitForm() {
    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    const eventType = this.editionMode ?
      VoucherEntryEditorEventType.UPDATE_VOUCHER_ENTRY :
      VoucherEntryEditorEventType.CREATE_VOUCHER_ENTRY;

    const payload = {
      voucherEntry: this.getFormData(),
      voucherEntryId: this.voucherEntry.id,
    };

    sendEvent(this.voucherEntryEditorEvent, eventType, payload);
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(VoucherStateSelector.EVENT_TYPES_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.FUNCTIONAL_AREAS_LIST)
    ])
    .subscribe(([x, y]) => {
      this.eventTypesList = x;
      this.functionalAreasList = y;
      this.isLoading = false;
    });
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        voucherEntryType: new FormControl('', Validators.required),
        ledgerAccount: new FormControl(null, Validators.required),
        sector: new FormControl('', Validators.required),
        subledgerAccount: new FormControl('', Validators.required),
        currency: new FormControl('', Validators.required),
        amount: new FormControl('', Validators.required),
        exchangeRate: new FormControl('', Validators.required),
        baseCurrencyAmount: new FormControl('', Validators.required),
        responsibilityArea: new FormControl(''),
        budgetConcept: new FormControl('', Validators.maxLength(6)),
        eventType: new FormControl(''),
        verificationNumber: new FormControl('', Validators.maxLength(6)),
        concept: new FormControl('', Validators.maxLength(255)),
        date: new FormControl(''),
      })
    );
  }


  private setFormData() {
    if (!this.editionMode) {
      this.formHandler.form.reset();
      return;
    }

    this.formHandler.form.reset({
      voucherEntryType: this.voucherEntry.voucherEntryType || '',
      ledgerAccount: this.voucherEntry.ledgerAccount || '',
      sector: this.voucherEntry.sector?.id || '',
      subledgerAccount: this.voucherEntry.subledgerAccount?.id ? this.voucherEntry.subledgerAccount : '',
      currency: isEmpty(this.voucherEntry.currency) ? '' : this.voucherEntry.currency.uid,
      amount: this.voucherEntry.amount || '',
      exchangeRate: this.voucherEntry.exchangeRate || '',
      baseCurrencyAmount: this.voucherEntry.baseCurrencyAmount || '',
      responsibilityArea: isEmpty(this.voucherEntry.responsibilityArea) ?
        '' : this.voucherEntry.responsibilityArea.uid,
      budgetConcept: this.voucherEntry.budgetConcept || '',
      eventType: isEmpty(this.voucherEntry.eventType) ? '' : this.voucherEntry.eventType.uid,
      verificationNumber: this.voucherEntry.verificationNumber || '',
      concept: this.voucherEntry.concept || '',
      date: this.voucherEntry.date || '',
    });

    this.formHandler.disableForm(false);
  }


  private getFormData(): VoucherEntryFields {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: VoucherEntryFields = {
      voucherId: this.voucherId,
      referenceEntryId: 0,
      voucherEntryType: formModel.voucherEntryType ?? '',
      ledgerAccountId: formModel.ledgerAccount?.id ? +formModel.ledgerAccount?.id : 0,
      sectorId: formModel.sector ? +formModel.sector : 0,
      subledgerAccountId: formModel.subledgerAccount?.id ? +formModel.subledgerAccount?.id : 0,
      currencyId: formModel.currency ? +formModel.currency : 0,
      amount: FormatLibrary.stringToNumber(formModel.amount),
      exchangeRate: FormatLibrary.stringToNumber(formModel.exchangeRate),
      baseCurrencyAmount: FormatLibrary.stringToNumber(formModel.baseCurrencyAmount),
      responsibilityAreaId: formModel.responsibilityArea ? +formModel.responsibilityArea : 0,
      budgetConcept: formModel.budgetConcept ?? '',
      eventTypeId: formModel.eventType ? +formModel.eventType : 0,
      verificationNumber: formModel.verificationNumber ?? '',
      concept: formModel.concept ?? '',
    };

    if (formModel.date) {
      data.date = formModel.date;
    }

    return data;
  }


  private subscribeLedgerAccountList() {
    this.ledgerAccountList$ = concat(
      of(this.ledgerAccountSelected.id > 0 ? [this.ledgerAccountSelected] : []),
      this.ledgerAccountInput$.pipe(
        filter(keyword => keyword !== null && keyword.length >= this.ledgerAccountMinTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.ledgerAccountLoading = true),
        switchMap(keyword =>
          this.vouchersData.searchAccountsForEdition(this.voucherId, keyword)
          .pipe(
            catchError(() => of([])),
            tap(() => this.ledgerAccountLoading = false)
        ))
      )
    );
  }


  private subscribeSubledgerAccountList() {
    this.subledgerAccountList$ = concat(
      of(this.subledgerAccountSelected?.id > 0 ? [this.subledgerAccountSelected] : []),
      this.subledgerAccountInput$.pipe(
        filter(keyword => keyword !== null && keyword.length >= this.subledgerAccountMinTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.subledgerAccountLoading = true),
        switchMap(keyword =>
          this.vouchersData.searchSubledgerAccountsForEdition(this.voucherId,
                                                              this.ledgerAccountSelected.id,
                                                              keyword)
          .pipe(
            catchError(() => of([])),
            tap(() => this.subledgerAccountLoading = false)
        ))
      )
    );
  }


  private validateSectorField() {
    this.sectorRequired = this.ledgerAccountSelected.role === AccountRole.Sectorizada;
    this.setControlConfig(this.controls.sector, this.sectorRequired);
  }


  private validateSubledgerField(sectorRule: LedgerAccountSectorRule) {
    this.subledgerAccountRequired = this.ledgerAccountSelected.role === AccountRole.Control ||
      this.sectorRequired && sectorRule?.role === AccountRole.Control;
    this.setControlConfig(this.controls.subledgerAccount, this.subledgerAccountRequired);
  }


  private setControlConfig(control: VoucherEntryEditorFormControls, controlRequired: boolean) {
    this.formHandler.disableControl(control, !controlRequired);

    if (controlRequired) {
      this.formHandler.setControlValidators(control, Validators.required);
    } else {
      this.formHandler.clearControlValidators(control);
    }
  }


  private validateDisableForm() {
    if (this.readonly) {
      this.formHandler.disableForm(true);
    }
  }


  private setValueIfControlIsEmpty(control: VoucherEntryEditorFormControls, value ) {
    if (!this.formHandler.getControl(control).value) {
      this.formHandler.getControl(control).reset(value);
    }
  }

}
