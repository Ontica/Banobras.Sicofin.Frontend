/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject, catchError, concat, debounceTime, distinctUntilChanged, filter, map, of,
         switchMap, tap } from 'rxjs';

import { Assertion, DateString, EventInfo, FlexibleIdentifiable } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { AccountsChartDataService } from '@app/data-services';

import { AccountsListEntry, ConciliacionDerivadosEntry, ConciliacionDerivadosFields,
         DefaultEndDate } from '@app/models';


export enum ConciliacionDerivadosEntryHeaderEventType {
  CREATE_ENTRY = 'ConciliacionDerivadosEntryHeaderComponent.Event.CreateEntry',
  UPDATE_ENTRY = 'ConciliacionDerivadosEntryHeaderComponent.Event.UpdateEntry',
  DELETE_ENTRY = 'ConciliacionDerivadosEntryHeaderComponent.Event.DeleteEntry',
}

interface ConciliacionDerivadosEntryFormModel extends FormGroup<{
  accountNumber: FormControl<string>;
  startDate: FormControl<DateString>;
  endDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-fa-conciliacion-derivados-entry-header',
  templateUrl: './conciliacion-derivados-entry-header.component.html',
})
export class ConciliacionDerivadosEntryHeaderComponent implements OnChanges, OnInit {

  @Input() accountListEntry: AccountsListEntry = null;

  @Input() isSaved = false;

  @Output() conciliacionDerivadosEntryHeaderEvent = new EventEmitter<EventInfo>();

  form: ConciliacionDerivadosEntryFormModel;

  formHelper = FormHelper;

  editionMode = false;

  accountList$: Observable<FlexibleIdentifiable[]>;

  accountInput$ = new Subject<string>();

  accountMinTermLength = 1;

  accountLoading = false;


  constructor(private accountsChartData: AccountsChartDataService,
              private messageBox: MessageBoxService) {
    this.initForm();
    this.enableEditor(true);
  }


  get conciliacionDerivadosEntry(): ConciliacionDerivadosEntry {
    return this.accountListEntry as ConciliacionDerivadosEntry;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.accountListEntry && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnInit() {
    this.subscribeAccountList();
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? ConciliacionDerivadosEntryHeaderEventType.UPDATE_ENTRY :
        ConciliacionDerivadosEntryHeaderEventType.CREATE_ENTRY;

      const payload = {
        entryUID: this.conciliacionDerivadosEntry?.uid ?? '',
        entryFields: this.getFormData(),
      };

      sendEvent(this.conciliacionDerivadosEntryHeaderEvent, eventType, payload);
    }
  }


  onDeleteButtonClicked() {
    const message = `Esta operación <strong>eliminará</strong> la cuenta` +
                    `<strong> (${this.conciliacionDerivadosEntry.accountNumber}) ` +
                    `${this.conciliacionDerivadosEntry.accountName}</strong> de la lista.` +
                    `<br><br>¿Elimino la cuenta?`;

    this.messageBox.confirm(message, 'Eliminar cuenta', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.conciliacionDerivadosEntryHeaderEvent,
            ConciliacionDerivadosEntryHeaderEventType.DELETE_ENTRY,
            { entryUID: this.conciliacionDerivadosEntry?.uid ?? '', entryFields: this.getFormData() });
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
      accountNumber: ['', Validators.required],
      startDate: [null as DateString, Validators.required],
      endDate: [DefaultEndDate, Validators.required],
    });
  }


  private setFormData() {
    this.form.reset({
      accountNumber: this.conciliacionDerivadosEntry.accountNumber,
      startDate: this.conciliacionDerivadosEntry.startDate,
      endDate: this.conciliacionDerivadosEntry.endDate,
    });

    this.subscribeAccountList();
  }


  private getFormData(): ConciliacionDerivadosFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: ConciliacionDerivadosFields = {
      uid: this.conciliacionDerivadosEntry?.uid ?? '',
      accountNumber: formModel.accountNumber ?? '',
      startDate: formModel.startDate ?? '',
      endDate: formModel.endDate ?? '',
    };

    return data;
  }


  private subscribeAccountList() {
    this.accountList$ = concat(
      of(this.getDefaultAccountList()),
      this.accountInput$.pipe(
        filter(keywords => keywords !== null && keywords.length >= this.accountMinTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.accountLoading = true),
        switchMap(keywords =>
          this.accountsChartData.searchAccountsIFRS({keywords})
            .pipe(
              map(x => x.accounts),
              catchError(() => of([])),
              tap(() => this.accountLoading = false)
            ))
      )
    );
  }


  private getDefaultAccountList(): FlexibleIdentifiable[] {
    if (!this.isSaved || !this.conciliacionDerivadosEntry?.accountUID) {
      return [];
    }

    const account: FlexibleIdentifiable = {
      uid: this.conciliacionDerivadosEntry?.accountUID,
      number: this.conciliacionDerivadosEntry?.accountNumber,
      name: this.conciliacionDerivadosEntry?.accountName,
    }

    return [account];
  }

}
