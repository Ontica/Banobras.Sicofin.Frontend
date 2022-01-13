/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion } from '@app/core';

import { AccountingCalendarsDataService } from '@app/data-services';

import { AccountingCalendar, AccountingCalendarPeriod, AccountingCalendarPeriodFields } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormHandler } from '@app/shared/utils';

enum AccountingCalendarsEditorFormControls {
  periodName = 'periodName',
  period = 'period',
}

@Component({
  selector: 'emp-fa-accounting-calendars-editor',
  templateUrl: './accounting-calendars-editor.component.html',
})
export class AccountingCalendarsEditorComponent implements OnInit {

  @Output() closeEvent = new EventEmitter<void>();

  isLoading = false;

  accountingCalendarsList: any[] = [];

  accountingCalendarUID = null;

  accountingCalendarSelected: AccountingCalendar = null;

  formHandler: FormHandler;

  controls = AccountingCalendarsEditorFormControls;

  constructor(private accountingCalendarsData: AccountingCalendarsDataService,
              private messageBox: MessageBoxService){
    this.initForm();
  }


  ngOnInit(): void {
    this.getAccountingCalendars();
  }


  get isFormValid() {
    return this.formHandler.isValid &&
           !!this.formHandler.getControl(this.controls.period).value.fromDate &&
           !!this.formHandler.getControl(this.controls.period).value.toDate;
  }


  onClose() {
    this.closeEvent.emit();
  }


  onAccountingCalendarChanges() {
    this.formHandler.resetForm();
    this.formHandler.disableForm(!this.accountingCalendarUID);

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
      .toPromise()
      .then(x => {
        if (x) {
          this.removePeriodFromAccountingCalendar(this.accountingCalendarSelected.uid, period.uid);
        }
      });
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        periodName: new FormControl('', Validators.required),
        period: new FormControl(null, Validators.required),
      })
    );

    this.formHandler.disableForm(true);
  }


  private getFormData(): AccountingCalendarPeriodFields {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

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
      .toPromise()
      .then(x => this.accountingCalendarsList = x)
      .finally(() => this.isLoading = false);
  }


  private getAccountingCalendar(accountingCalendarUID) {
    this.isLoading = true;

    this.accountingCalendarsData.getAccountingCalendar(accountingCalendarUID)
      .toPromise()
      .then(x => this.accountingCalendarSelected = x)
      .catch(e => this.accountingCalendarSelected = null)
      .finally(() => this.isLoading = false);
  }


  private addPeriodToAccountingCalendar(accountingCalendarUID: string,
                                        periodFields: AccountingCalendarPeriodFields) {
    this.isLoading = true;

    this.accountingCalendarsData.addPeriodToAccountingCalendar(accountingCalendarUID, periodFields)
      .toPromise()
      .then(x => {
        this.accountingCalendarSelected = x;
        this.formHandler.resetForm();
      })
      .finally(() => this.isLoading = false);
  }


  private removePeriodFromAccountingCalendar(accountingCalendarUID: string, periodUID: string) {
    this.isLoading = true;

    this.accountingCalendarsData.removePeriodFromAccountingCalendar(accountingCalendarUID, periodUID)
      .toPromise()
      .then(x => this.accountingCalendarSelected = x)
      .finally(() => this.isLoading = false);
  }


  private getConfirmMessage(period: AccountingCalendarPeriod): string {
    return `Esta operación eliminará el período <strong>${period.period}</strong> del calendario ` +
           `<strong>${this.accountingCalendarSelected.name}</strong>` +
           `<br><br>¿Elimino el período?`;
  }

}
