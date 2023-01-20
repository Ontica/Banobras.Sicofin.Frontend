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

import { Assertion, EventInfo, Identifiable, isEmpty, Validate } from '@app/core';

import { AccountRole, EmptyLedgerAccount, EmptyVoucherEntry, LedgerAccount, LedgerAccountSectorRule,
         mapSubledgerAccountDescriptorFromSubledgerAccount, SubledgerAccount, SubledgerAccountDescriptor,
         ValuedCurrency, Voucher, VoucherEntry, VoucherEntryFields, VoucherEntryTypeList } from '@app/models';

import { FormatLibrary, FormHandler, sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { VouchersDataService } from '@app/data-services';

import { MessageBoxService } from '@app/shared/containers/message-box';

import {
  SubledgerAccountCreatorEventType
} from '@app/views/subledger-accounts/subledger-account-creator/subledger-account-creator.component';


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

  @Input() voucher: Voucher;

  @Input() voucherEntry: VoucherEntry = EmptyVoucherEntry;

  @Input() readonly = false;

  @Output() voucherEntryEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = VoucherEntryEditorFormControls;
  editionMode = false;
  cloneMode = false;
  isLoading = false;
  displayDateAndConcept = false;

  voucherEntryTypeList: Identifiable[] = VoucherEntryTypeList;
  functionalAreasList: Identifiable[] = [];
  eventTypesList: Identifiable[] = [];

  ledgerAccountList$: Observable<LedgerAccount[]>;
  ledgerAccountInput$ = new Subject<string>();
  ledgerAccountMinTermLength = 1;
  ledgerAccountLoading = false;

  subledgerAccountList$: Observable<SubledgerAccountDescriptor[]>;
  subledgerAccountInput$ = new Subject<string>();
  subledgerAccountMinTermLength = 4;
  subledgerAccountLoading = false;

  sectorRequired = false;
  subledgerAccountRequired = false;

  exchangeRateDefault = '';

  displaySubledgerAccountCreator = false;

  constructor(private uiLayer: PresentationLayer,
              private vouchersData: VouchersDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.initFieldsValidations();
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
        this.setAndValidateFormData(this.voucherEntry);
      }
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get ledgerAccountSelected(): LedgerAccount {
    const ledgerAccount = this.formHandler.getControl(this.controls.ledgerAccount).value;
    return ledgerAccount?.id > 0 ? ledgerAccount : EmptyLedgerAccount;
  }


  get subledgerAccountSelected(): SubledgerAccountDescriptor {
    const subledgerAccount = this.formHandler.getControl(this.controls.subledgerAccount).value;
    return subledgerAccount?.id > 0 ? subledgerAccount : null;
  }


  get currencySelected(): ValuedCurrency {
    const currencyUID = this.formHandler.getControl(this.controls.currency).value;
    const currency: ValuedCurrency = this.ledgerAccountSelected.currencies.find(x => x.uid === currencyUID);
    return isEmpty(currency) ? null : currency;
  }


  get placeholderSector(): string {
    if (this.formHandler.getControl(this.controls.ledgerAccount).valid) {
      if (this.sectorRequired) {
        return 'Seleccionar';
      }
      return 'No aplica';
    }
    return this.readonly ? '' : 'Seleccionar la cuenta';
  }


  get placeholderSubledgerAccount(): string {
    if (this.formHandler.getControl(this.controls.ledgerAccount).valid) {
      if (this.sectorRequired && this.formHandler.getControl(this.controls.sector).invalid) {
        return 'Seleccionar el sector';
      }

      if (this.subledgerAccountRequired) {
        return 'Buscar auxiliar';
      }
      return 'No aplica';
    }
    return this.readonly ? '' : 'Seleccionar la cuenta';
  }


  get placeholderCurrency(): string {
    return this.formHandler.getControl(this.controls.ledgerAccount).valid ?
      'Seleccionar' : 'Seleccionar la cuenta';
  }


  onClose() {
    sendEvent(this.voucherEntryEditorEvent, VoucherEntryEditorEventType.CLOSE_MODAL_CLICKED);
  }


  onLedgerAccountChanges(ledgerAccount: LedgerAccount) {
    this.ledgerAccountChange();
    this.subscribeSubledgerAccountList();

    if (ledgerAccount && ledgerAccount.id === 0 && ledgerAccount.standardAccountId > 0) {
      this.showConfirmAssignAccountToVoucher(ledgerAccount);
    }
  }


  onClearLedgerAccount() {
    this.subscribeLedgerAccountList();
    this.subscribeSubledgerAccountList();
  }


  onSectorChanges(sectorRule: LedgerAccountSectorRule) {
    this.formHandler.getControl(this.controls.subledgerAccount).reset();
    this.validateSubledgerField(sectorRule);
  }


  onCurrencyChanges() {
    this.validateCurrencyField();
    this.formHandler.getControl(this.controls.exchangeRate).reset(this.exchangeRateDefault);

    const amount = FormatLibrary.stringToNumber(this.formHandler.getControl(this.controls.amount).value);

    if (this.exchangeRateDefault || amount > 0) {
      this.onCalculateBaseCurrencyAmount();
    } else {
      this.resetAmountFields();
    }
  }


  onClearSubledgerAccount() {
    this.subscribeSubledgerAccountList();
  }


  onCopyOfLastVoucherEntryClicked() {
    this.getCopyOfLastEntry(this.voucher.id);
  }


  onCloneVoucherEntryClicked() {
    this.setVoucherEntryToClone(this.voucherEntry);
  }


  onCreateSubledgerAccountClicked() {
    this.displaySubledgerAccountCreator = true;
  }


  onSubledgerAccountCreatorEvent(event: EventInfo) {
    switch (event.type as SubledgerAccountCreatorEventType) {

      case SubledgerAccountCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displaySubledgerAccountCreator = false;
        return;

      case SubledgerAccountCreatorEventType.SUBLEDGER_ACCOUNT_CREATED:
        Assertion.assertValue(event.payload.subledgerAccount, 'event.payload.subledgerAccount');
        this.setSubledgerAccountCreated(event.payload.subledgerAccount as SubledgerAccount);
        this.displaySubledgerAccountCreator = false;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCalculateBaseCurrencyAmount() {
    this.setValueIfControlIsEmpty(this.controls.amount, '0.00');
    this.setValueIfControlIsEmpty(this.controls.exchangeRate, this.exchangeRateDefault);

    setTimeout(() => {
      const amount = FormatLibrary.stringToNumber(this.formHandler.getControl(this.controls.amount).value);
      const exchangeRate =
        FormatLibrary.stringToNumber(this.formHandler.getControl(this.controls.exchangeRate).value);
      const baseCurrencyAmount = amount * exchangeRate;

      this.formHandler.getControl(this.controls.baseCurrencyAmount)
        .reset(FormatLibrary.numberWithCommas(baseCurrencyAmount, '1.2-2'));
    });
  }


  onDisplayDateAndConceptClicked() {
    this.formHandler.getControl(this.controls.date).reset();
    this.formHandler.getControl(this.controls.concept).reset();
    this.formHandler.form.markAsDirty();
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


  private getCopyOfLastEntry(voucherEntryId: number) {
    this.isLoading = true;

    this.vouchersData.getCopyOfLastEntry(voucherEntryId)
      .toPromise()
      .then(x => this.setVoucherEntryToClone(x))
      .finally(() => this.isLoading = false);
  }


  private assignAccountToVoucher(standardAccountId: number) {
    this.isLoading = true;

    this.vouchersData.assignAccountToVoucher(this.voucher.id, standardAccountId)
      .toPromise()
      .then(x => {
        this.formHandler.getControl(this.controls.ledgerAccount).reset(x);
        this.subscribeLedgerAccountList();
        this.ledgerAccountChange();
      })
      .finally(() => this.isLoading = false);
  }


  private setVoucherEntryToClone(voucherEntry: VoucherEntry) {
    voucherEntry.id = 0;
    this.editionMode = false;
    this.cloneMode = true;
    this.setAndValidateFormData(voucherEntry);
    this.formHandler.form.markAsDirty();
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
        amount: new FormControl('', [Validators.required, Validate.isPositive]),
        exchangeRate: new FormControl('', [Validators.required, Validate.isPositive]),
        baseCurrencyAmount: new FormControl('', [Validators.required, Validate.isPositive]),
        responsibilityArea: new FormControl(''),
        budgetConcept: new FormControl('', Validators.maxLength(6)),
        eventType: new FormControl(''),
        verificationNumber: new FormControl('', Validators.maxLength(6)),
        concept: new FormControl('', Validators.maxLength(255)),
        date: new FormControl(''),
      })
    );
  }


  private initFieldsValidations() {
    this.validateSectorField();
    this.validateSubledgerField(null);
    this.validateCurrencyField();
  }


  private setAndValidateFormData(voucherEntry: VoucherEntry) {
    this.setFormData(voucherEntry);
    this.validateSectorField();
    this.validateSubledgerField(voucherEntry.sector);
    this.validateCurrencyField();
    this.validateDisableForm();
    this.subscribeLedgerAccountList();
    this.subscribeSubledgerAccountList();
  }


  private setFormData(voucherEntry: VoucherEntry) {
    this.formHandler.form.reset({
      voucherEntryType: voucherEntry.voucherEntryType || '',
      ledgerAccount: voucherEntry.ledgerAccount || '',
      sector: voucherEntry.sector?.id || '',
      subledgerAccount: voucherEntry.subledgerAccount?.id ? voucherEntry.subledgerAccount : '',
      currency: isEmpty(voucherEntry.currency) ? '' : voucherEntry.currency.uid,
      amount: voucherEntry.amount ? FormatLibrary.numberWithCommas(voucherEntry.amount, '1.2-2') : '',
      exchangeRate: voucherEntry.exchangeRate ?
        FormatLibrary.numberWithCommas(voucherEntry.exchangeRate, '1.6-6') : '',
      baseCurrencyAmount: voucherEntry.baseCurrencyAmount ?
        FormatLibrary.numberWithCommas(voucherEntry.baseCurrencyAmount, '1.2-2') : '',
      responsibilityArea: isEmpty(voucherEntry.responsibilityArea) ? '' : voucherEntry.responsibilityArea.uid,
      budgetConcept: voucherEntry.budgetConcept || '',
      eventType: isEmpty(voucherEntry.eventType) ? '' : voucherEntry.eventType.uid,
      verificationNumber: voucherEntry.verificationNumber || '',
      concept: voucherEntry.concept || '',
      date: voucherEntry.date || '',
    });

    this.formHandler.disableForm(false);
    this.displayDateAndConcept = !!voucherEntry.date || !!voucherEntry.concept;
  }


  private setSubledgerAccountCreated(subledgerAccount: SubledgerAccount) {
    const subledgerAccountCreated = mapSubledgerAccountDescriptorFromSubledgerAccount(subledgerAccount);
    this.formHandler.getControl(this.controls.subledgerAccount).reset(subledgerAccountCreated);
    this.subscribeSubledgerAccountList();
    this.formHandler.form.markAsDirty();
  }


  private resetAmountFields() {
    this.formHandler.getControl(this.controls.amount).reset();
    this.formHandler.getControl(this.controls.baseCurrencyAmount).reset();
  }


  private getFormData(): VoucherEntryFields {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: VoucherEntryFields = {
      voucherId: this.voucher.id,
      referenceEntryId: 0,
      voucherEntryType: formModel.voucherEntryType ?? '',
      ledgerAccountId: formModel.ledgerAccount?.id ? +formModel.ledgerAccount?.id : 0,
      sectorId: formModel.sector ? +formModel.sector : 0,
      subledgerAccountId: formModel.subledgerAccount?.id ? +formModel.subledgerAccount?.id : 0,
      currencyUID: formModel.currency ?? '',
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
          this.vouchersData.searchAccountsForEdition(this.voucher.id, keyword)
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
          this.vouchersData.searchSubledgerAccountsForEdition(this.voucher.id,
                                                              this.ledgerAccountSelected.id,
                                                              keyword)
          .pipe(
            catchError(() => of([])),
            tap(() => this.subledgerAccountLoading = false)
        ))
      )
    );
  }


  private ledgerAccountChange() {
    this.formHandler.getControl(this.controls.sector).reset();
    this.formHandler.getControl(this.controls.currency).reset();

    this.validateSectorField();
    this.onSectorChanges(null);
    this.onCurrencyChanges();
  }


  private showConfirmAssignAccountToVoucher(ledgerAccount: LedgerAccount) {
    const message = `La cuenta <strong>${ledgerAccount.number}: ${ledgerAccount.name}</strong>
      no se ha utilizado en la contabilidad ${this.voucher.ledger.name}.
      <br><br>¿Desea utilizarla por primera vez?`;

    this.messageBox.confirm(message, 'Agregar cuenta')
      .toPromise()
      .then(x => {
        if (x) {
          this.assignAccountToVoucher(ledgerAccount.standardAccountId);
        } else {
          this.formHandler.getControl(this.controls.ledgerAccount).reset();
        }
      });
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


  private validateCurrencyField() {
    const exchangeRateDisabled = isEmpty(this.currencySelected) || this.currencySelected?.exchangeRate === 1;

    this.exchangeRateDefault = isEmpty(this.currencySelected) ? '' :
      FormatLibrary.numberWithCommas(this.currencySelected?.exchangeRate ?? 0, '1.6-6');

    this.formHandler.disableControl(this.controls.exchangeRate, exchangeRateDisabled);
  }


  private setControlConfig(control: VoucherEntryEditorFormControls, required: boolean) {
    this.formHandler.disableControl(control, !required);

    if (required) {
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


  private setValueIfControlIsEmpty(control: VoucherEntryEditorFormControls, value) {
    if (!this.formHandler.getControl(control).value) {
      this.formHandler.getControl(control).reset(value);
    }
  }

}
