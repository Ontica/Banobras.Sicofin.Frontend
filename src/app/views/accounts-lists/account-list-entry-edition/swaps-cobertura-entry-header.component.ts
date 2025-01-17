/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject, catchError, concat, debounceTime, distinctUntilChanged, filter, of,
         switchMap, tap } from 'rxjs';

import { Assertion, DateString, EventInfo, FlexibleIdentifiable } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { AccountsListsDataService, SubledgerDataService } from '@app/data-services';

import { AccountsListEntry, SwapsCoberturaEntry, SwapsCoberturaFields,
         SubledgerAccountIFRSQuery, DefaultEndDate } from '@app/models';


export enum SwapsCoberturaEntryHeaderEventType {
  CREATE_ENTRY = 'SwapsCoberturaEntryHeaderComponent.Event.CreateEntry',
  UPDATE_ENTRY = 'SwapsCoberturaEntryHeaderComponent.Event.UpdateEntry',
  DELETE_ENTRY = 'SwapsCoberturaEntryHeaderComponent.Event.DeleteEntry',
}

interface SwapsCoberturaEntryFormModel extends FormGroup<{
  subledgerAccount: FormControl<string>;
  classification: FormControl<string>;
  startDate: FormControl<DateString>;
  endDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-fa-swaps-cobertura-entry-header',
  templateUrl: './swaps-cobertura-entry-header.component.html',
})
export class SwapsCoberturaEntryHeaderComponent implements OnChanges, OnInit {

  @Input() accountListEntry: AccountsListEntry = null;

  @Input() isSaved = false;

  @Output() swapsCoberturaEntryHeaderEvent = new EventEmitter<EventInfo>();

  form: SwapsCoberturaEntryFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isClassificationLoading = false;

  classificationList: string[] = [];

  subledgerAccountList$: Observable<FlexibleIdentifiable[]>;

  subledgerAccountInput$ = new Subject<string>();

  subledgerAccountMinTermLength = 3;

  subledgerAccountLoading = false;


  constructor(private subledgerData: SubledgerDataService,
              private accountsListsData: AccountsListsDataService,
              private messageBox: MessageBoxService) {
    this.initForm();
    this.enableEditor(true);
  }


  get swapsCoberturaEntry(): SwapsCoberturaEntry {
    return this.accountListEntry as SwapsCoberturaEntry;
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


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? SwapsCoberturaEntryHeaderEventType.UPDATE_ENTRY :
        SwapsCoberturaEntryHeaderEventType.CREATE_ENTRY;

      const payload = {
        entryUID: this.swapsCoberturaEntry?.uid ?? '',
        entryFields: this.getFormData(),
      };

      sendEvent(this.swapsCoberturaEntryHeaderEvent, eventType, payload);
    }
  }


  onDeleteButtonClicked() {
    const message = `Esta operación <strong>eliminará</strong> la cuenta` +
                    `<strong> (${this.swapsCoberturaEntry.subledgerAccountNumber}) ` +
                    `${this.swapsCoberturaEntry.subledgerAccountName}</strong> de la lista.` +
                    `<br><br>¿Elimino la cuenta?`;

    this.messageBox.confirm(message, 'Eliminar cuenta', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.swapsCoberturaEntryHeaderEvent,
            SwapsCoberturaEntryHeaderEventType.DELETE_ENTRY,
            { entryUID: this.swapsCoberturaEntry?.uid ?? '', entryFields: this.getFormData() });
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
      subledgerAccount: ['', Validators.required],
      classification: ['', Validators.required],
      startDate: [null as DateString, Validators.required],
      endDate: [DefaultEndDate as DateString, Validators.required],
    });
  }


  private setFormData() {
    this.form.reset({
      subledgerAccount: this.swapsCoberturaEntry.subledgerAccountNumber,
      classification: this.swapsCoberturaEntry.classification,
      startDate: this.swapsCoberturaEntry.startDate,
      endDate: this.swapsCoberturaEntry.endDate,
    });

    this.subscribeSubledgerAccountList();
  }


  private getFormData(): SwapsCoberturaFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: SwapsCoberturaFields = {
      uid: this.swapsCoberturaEntry?.uid ?? '',
      subledgerAccountNumber: formModel.subledgerAccount ?? '',
      classification: formModel.classification ?? '',
      startDate: formModel.startDate ?? '',
      endDate: formModel.endDate ?? '',
    };

    return data;
  }


  private loadDataList() {
    this.isClassificationLoading = true;

    this.accountsListsData.getClassificationsForSwapsCobertura()
      .firstValue()
      .then(x => this.classificationList = x)
      .finally(() => this.isClassificationLoading = false);
  }


  private subscribeSubledgerAccountList() {
    this.subledgerAccountList$ = concat(
      of(this.getDefaultSubledgerAccountList(this.swapsCoberturaEntry?.subledgerAccountId,
                                             this.swapsCoberturaEntry?.subledgerAccountNumber,
                                             this.swapsCoberturaEntry?.subledgerAccountName)),
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
      const subledgerAccount: FlexibleIdentifiable = { id, number, name };
      return [subledgerAccount];
    }

    return [];
  }

}
