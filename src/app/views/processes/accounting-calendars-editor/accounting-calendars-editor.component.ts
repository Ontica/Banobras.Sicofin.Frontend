/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { FormHelper } from '@app/shared/utils';

import { AccountingCalendarsDataService } from '@app/data-services';

import { AccountingCalendar, AccountingCalendarPeriod, AccountingCalendarPeriodFields,
         DateRange } from '@app/models';


interface AccountingCalendarsFormModel extends FormGroup<{
  periodName: FormControl<string>;
  period: FormControl<DateRange>;
}> { }

@Component({
  selector: 'emp-fa-accounting-calendars-editor',
  templateUrl: './accounting-calendars-editor.component.html',
})
export class AccountingCalendarsEditorComponent implements OnInit {

  @Output() closeEvent = new EventEmitter<void>();

  form: AccountingCalendarsFormModel;

  formHelper = FormHelper;

  isLoading = false;

  accountingCalendarsList: any[] = [];

  accountingCalendarUID = null;

  accountingCalendarSelected: AccountingCalendar = null;


  constructor(private accountingCalendarsData: AccountingCalendarsDataService,
              private messageBox: MessageBoxService){
    this.initForm();
  }


  ngOnInit() {
    this.getAccountingCalendars();
  }


  get isFormValid(): boolean {
    return this.formHelper.isFormReady(this.form) &&
           !!this.form.value.period.fromDate &&
           !!this.form.value.period.toDate;
  }


  onClose() {
    this.closeEvent.emit();
  }


  onAccountingCalendarChanges() {
    this.form.reset();
    this.formHelper.setDisableForm(this.form, !this.accountingCalendarUID);

    if (!!this.accountingCalendarUID) {
      this.getAccountingCalendar(this.accountingCalendarUID);
    }
  }


  onAddPeriodClicked() {
    if (this.isFormValid) {
      this.addPeriodToAccountingCalendar(this.accountingCalendarSelected.uid, this.getFormData());
    }
  }


  onRemovePeriodClicked(period: AccountingCalendarPeriod) {
    const message = this.getConfirmMessage(period);

    this.messageBox.confirm(message, 'Eliminar período', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          this.removePeriodFromAccountingCalendar(this.accountingCalendarSelected.uid, period.uid);
        }
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      periodName: ['', Validators.required],
      period: [null as DateRange, Validators.required],
    });

    this.formHelper.setDisableForm(this.form, true);
  }


  private getFormData(): AccountingCalendarPeriodFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: AccountingCalendarPeriodFields = {
      period: formModel.periodName ?? '',
      fromDate: formModel.period?.fromDate ?? '',
      toDate: formModel.period?.toDate ?? '',
    };

    return data;
  }


  private getAccountingCalendars() {
    this.isLoading = true;

    this.accountingCalendarsData.getAccountingCalendars()
      .firstValue()
      .then(x => this.accountingCalendarsList = x)
      .finally(() => this.isLoading = false);
  }


  private getAccountingCalendar(accountingCalendarUID) {
    this.isLoading = true;

    this.accountingCalendarsData.getAccountingCalendar(accountingCalendarUID)
      .firstValue()
      .then(x => this.accountingCalendarSelected = x)
      .catch(e => this.accountingCalendarSelected = null)
      .finally(() => this.isLoading = false);
  }


  private addPeriodToAccountingCalendar(accountingCalendarUID: string,
                                        periodFields: AccountingCalendarPeriodFields) {
    this.isLoading = true;

    this.accountingCalendarsData.addPeriodToAccountingCalendar(accountingCalendarUID, periodFields)
      .firstValue()
      .then(x => {
        this.accountingCalendarSelected = x;
        this.form.reset();
      })
      .finally(() => this.isLoading = false);
  }


  private removePeriodFromAccountingCalendar(accountingCalendarUID: string, periodUID: string) {
    this.isLoading = true;

    this.accountingCalendarsData.removePeriodFromAccountingCalendar(accountingCalendarUID, periodUID)
      .firstValue()
      .then(x => this.accountingCalendarSelected = x)
      .finally(() => this.isLoading = false);
  }


  private getConfirmMessage(period: AccountingCalendarPeriod): string {
    return `Esta operación eliminará el período <strong>${period.period}</strong> del calendario ` +
           `<strong>${this.accountingCalendarSelected.name}</strong>` +
           `<br><br>¿Elimino el período?`;
  }

}
