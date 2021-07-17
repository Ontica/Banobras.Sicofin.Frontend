/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { concat, Observable, of, Subject } from 'rxjs';

import { catchError, debounceTime, delay, distinctUntilChanged, filter, switchMap,
         tap } from 'rxjs/operators';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { EmptyVoucherEntry, VoucherEntry, VoucherEntryTypeList } from '@app/models';

import { FormatLibrary, FormHandler, sendEvent } from '@app/shared/utils';


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

  @Input() voucherEntry: VoucherEntry = EmptyVoucherEntry;

  @Output() voucherEntryEditorEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;
  controls = VoucherEntryEditorFormControls;
  editionMode = false;
  isLoading = false;

  voucherEntryTypeList: Identifiable[] = VoucherEntryTypeList;

  helper: SubscriptionHelper;

  ledgerAccountList$: Observable<any[]>;
  ledgerAccountInput$ = new Subject<string>();
  ledgerAccountLoading = false;
  minTermLength = 5;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit(): void {
    this.subscribeLedgerAccountList();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucherEntry) {
      this.editionMode = this.voucherEntry.id > 0;

      if (this.editionMode) {
        this.setFormData();
      }
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onClose() {
    sendEvent(this.voucherEntryEditorEvent, VoucherEntryEditorEventType.CLOSE_MODAL_CLICKED);
  }


  onCloneLastVoucherEntryClicked() {
    console.log('CLONE LAST VOUCHER ENTRY CLICKED');
  }


  onExchangeRateClicked() {
    console.log('EXCHANGE RATE CLICKED');
  }


  onCalculateBaseCurrencyAmountClicked() {
    if (!this.formHandler.getControl(this.controls.amount).value) {
      this.formHandler.getControl(this.controls.amount).reset('0.00');
    }

    if (!this.formHandler.getControl(this.controls.exchangeRate).value) {
      this.formHandler.getControl(this.controls.exchangeRate).reset('1.00');
    }

    const amount = FormatLibrary.stringToNumber(this.formHandler.getControl(this.controls.amount).value);
    const exchangeRate =
      FormatLibrary.stringToNumber(this.formHandler.getControl(this.controls.exchangeRate).value);
    const baseCurrencyAmount = amount * exchangeRate;

    this.formHandler.getControl(this.controls.baseCurrencyAmount)
      .reset(FormatLibrary.numberWithCommas(baseCurrencyAmount, '1.2-2'));
  }


  onSubmitForm() {
    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    let eventType = VoucherEntryEditorEventType.CREATE_VOUCHER_ENTRY;

    if (this.editionMode) {
      eventType = VoucherEntryEditorEventType.UPDATE_VOUCHER_ENTRY;
    }

    sendEvent(this.voucherEntryEditorEvent, eventType, {voucher: this.getFormData()});
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        voucherEntryType: new FormControl('', Validators.required),
        ledgerAccount: new FormControl('', Validators.required),
        sector: new FormControl('', Validators.required),
        subledgerAccount: new FormControl('', Validators.required),
        currency: new FormControl('', Validators.required),
        amount: new FormControl('', Validators.required),
        exchangeRate: new FormControl('', Validators.required),
        baseCurrencyAmount: new FormControl('', Validators.required),
        responsibilityArea: new FormControl(''),
        budgetConcept: new FormControl(''),
        eventType: new FormControl(''),
        verificationNumber: new FormControl(''),
        concept: new FormControl(''),
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
      ledgerAccount: this.voucherEntry.ledgerAccount?.uid || '',
      sector: this.voucherEntry.sector.name || '',
      subledgerAccount: this.voucherEntry.subledgerAccount?.uid || '',
      currency: this.voucherEntry.currency?.uid || '',
      amount: this.voucherEntry.amount || '',
      exchangeRate: this.voucherEntry.exchangeRate || '',
      baseCurrencyAmount: this.voucherEntry.baseCurrencyAmount || '',
      responsibilityArea: this.voucherEntry.responsibilityArea?.uid || '',
      budgetConcept: this.voucherEntry.budgetConcept || '',
      eventType: this.voucherEntry.eventType?.uid || '',
      verificationNumber: this.voucherEntry.verificationNumber || '',
      concept: this.voucherEntry.concept || '',
      date: this.voucherEntry.date || '',
    });
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: any = {
      voucherEntryType: formModel.voucherEntryType ?? '',
      ledgerAccount: formModel.ledgerAccount ?? '',
      sector: formModel.sector ?? '',
      subledgerAccount: formModel.subledgerAccount ?? '',
      currency: formModel.currency ?? '',
      amount: formModel.amount ?? '',
      exchangeRate: formModel.exchangeRate ?? '',
      baseCurrencyAmount: formModel.baseCurrencyAmount ?? '',
      responsibilityArea: formModel.responsibilityArea ?? '',
      budgetConcept: formModel.budgetConcept ?? '',
      eventType: formModel.eventType ?? '',
      verificationNumber: formModel.verificationNumber ?? '',
      concept: formModel.concept ?? '',
      date: formModel.date ?? '',
    };

    return data;
  }


  private subscribeLedgerAccountList() {
    this.ledgerAccountList$ = concat(
      of([]),
      this.ledgerAccountInput$.pipe(
          filter(keyword => keyword !== null && keyword.length >= this.minTermLength),
          distinctUntilChanged(),
          debounceTime(800),
          tap(() => this.ledgerAccountLoading = true),
          switchMap(keyword =>
            of([]).pipe(
              delay(2000),
              catchError(() => of([])),
              tap(() => this.ledgerAccountLoading = false)
          ))
      )
    );
  }


  private buildLedgerAccountFilter(keywords: string): any {
    const ledgerAccountFilter: any = {
      keywords
    };

    return ledgerAccountFilter;
  }

}
