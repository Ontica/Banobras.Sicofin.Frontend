/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject, catchError, combineLatest, concat, debounceTime, distinctUntilChanged, filter,
         of, switchMap, tap } from 'rxjs';

import { Assertion, DateString, EventInfo, FlexibleIdentifiable, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { CataloguesStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/services';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { AccountsListsDataService, SubledgerDataService } from '@app/data-services';

import { AccountsListEntry, PrestamosInterbancariosEntry, PrestamosInterbancariosFields,
         SubledgerAccountIFRSQuery } from '@app/models';


export enum PrestamosInterbancariosEntryHeaderEventType {
  CREATE_ENTRY = 'PrestamosInterbancariosEntryHeaderComponent.Event.CreateEntry',
  UPDATE_ENTRY = 'PrestamosInterbancariosEntryHeaderComponent.Event.UpdateEntry',
  DELETE_ENTRY = 'PrestamosInterbancariosEntryHeaderComponent.Event.DeleteEntry',
}

interface PrestamosInterbancariosEntryFormModel extends FormGroup<{
  subledgerAccountNumber: FormControl<string>;
  prestamoUID: FormControl<string>;
  sectorCode: FormControl<string>;
  currencyCode: FormControl<string>;
  vencimiento: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-fa-prestamos-interbancarios-entry-header',
  templateUrl: './prestamos-interbancarios-entry-header.component.html',
})
export class PrestamosInterbancariosEntryHeaderComponent implements OnChanges, OnInit, OnDestroy {

  @Input() accountListEntry: AccountsListEntry = null;

  @Input() isSaved = false;

  @Output() prestamosInterbancariosEntryHeaderEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: PrestamosInterbancariosEntryFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  prestamoList: Identifiable[] = [];

  currencyList: Identifiable[] = [];

  sectorList: Identifiable[] = [];

  subledgerAccountList$: Observable<FlexibleIdentifiable[]>;

  subledgerAccountInput$ = new Subject<string>();

  subledgerAccountMinTermLength = 3;

  subledgerAccountLoading = false;


  constructor(private subledgerData: SubledgerDataService,
              private accountsListsData: AccountsListsDataService,
              private messageBox: MessageBoxService,
              private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.accountListEntry && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnInit() {
    this.loadDataList();
    this.subscribeSubledgerAccountList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get prestamosInterbancariosEntry(): PrestamosInterbancariosEntry {
    return this.accountListEntry as PrestamosInterbancariosEntry;
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? PrestamosInterbancariosEntryHeaderEventType.UPDATE_ENTRY :
        PrestamosInterbancariosEntryHeaderEventType.CREATE_ENTRY;

      const payload = {
        entryUID: this.prestamosInterbancariosEntry?.uid ?? '',
        entryFields: this.getFormData(),
      };

      sendEvent(this.prestamosInterbancariosEntryHeaderEvent, eventType, payload);
    }
  }


  onDeleteButtonClicked() {
    const message = `Esta operación <strong>eliminará</strong> la cuenta` +
                    `<strong> (${this.prestamosInterbancariosEntry.subledgerAccountNumber}) ` +
                    `${this.prestamosInterbancariosEntry.subledgerAccountName}</strong> de la lista.` +
                    `<br><br>¿Elimino la cuenta?`;

    this.messageBox.confirm(message, 'Eliminar cuenta', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.prestamosInterbancariosEntryHeaderEvent,
            PrestamosInterbancariosEntryHeaderEventType.DELETE_ENTRY,
            { entryUID: this.prestamosInterbancariosEntry?.uid ?? '', entryFields: this.getFormData() });
        }
      });
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.formHelper.setDisableForm(this.form, !this.editionMode);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      subledgerAccountNumber: ['', Validators.required],
      prestamoUID: ['', Validators.required],
      sectorCode: ['', Validators.required],
      currencyCode: ['', Validators.required],
      vencimiento: [null as DateString, Validators.required],
    });
  }


  private setFormData() {
    this.form.reset({
      subledgerAccountNumber: this.prestamosInterbancariosEntry.subledgerAccountNumber,
      prestamoUID: this.prestamosInterbancariosEntry.prestamoUID,
      sectorCode: this.prestamosInterbancariosEntry.sectorCode,
      currencyCode: this.prestamosInterbancariosEntry.currencyCode,
      vencimiento: this.prestamosInterbancariosEntry.vencimiento,
    });

    this.subscribeSubledgerAccountList();
  }


  private getFormData(): PrestamosInterbancariosFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: PrestamosInterbancariosFields = {
      uid: this.prestamosInterbancariosEntry?.uid ?? '',
      subledgerAccountNumber: formModel.subledgerAccountNumber ?? '',
      prestamoUID: formModel.prestamoUID ?? '',
      sectorCode: formModel.sectorCode ?? '',
      currencyCode: formModel.currencyCode ?? '',
      vencimiento: formModel.vencimiento ?? '',
    };

    return data;
  }


  private loadDataList() {
    this.isLoading = true;


    combineLatest([
      this.accountsListsData.getPrestamosForPrestamosInterbancarios(),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.SECTORS_LIST),
      this.helper.select<Identifiable[]>(CataloguesStateSelector.CURRENCIES_LIST),
    ])
      .subscribe(([a, b, c]) => {
        this.prestamoList = a;
        this.sectorList = b;
        this.currencyList = c;
        this.isLoading = false;
      });
  }


  private subscribeSubledgerAccountList() {
    this.subledgerAccountList$ = concat(
      of(this.getDefaultSubledgerAccountList(this.prestamosInterbancariosEntry?.subledgerAccountId,
                                             this.prestamosInterbancariosEntry?.subledgerAccountNumber,
                                             this.prestamosInterbancariosEntry?.subledgerAccountName)),
      this.subledgerAccountInput$.pipe(
        filter(keywords => keywords !== null && keywords.length >= this.subledgerAccountMinTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.subledgerAccountLoading = true),
        switchMap(keywords =>
          this.subledgerData.searchSubledgerAccountsIFRS(this.getSubledgerAccountIFRSQuery(keywords))
            .pipe(
              catchError(() => of([])),
              tap(() => this.subledgerAccountLoading = false)
            ))
      )
    );
  }


  private getSubledgerAccountIFRSQuery(keywords: string): SubledgerAccountIFRSQuery {
    const query: SubledgerAccountIFRSQuery = {
      keywords,
    };
    return query;
  }


  private getDefaultSubledgerAccountList(id: number, number: string, name: string): FlexibleIdentifiable[] {
    if (this.isSaved && id && id > 0) {
      const subledgerAccount: FlexibleIdentifiable = { id, number, name }
      return [subledgerAccount];
    }

    return [];
  }

}
