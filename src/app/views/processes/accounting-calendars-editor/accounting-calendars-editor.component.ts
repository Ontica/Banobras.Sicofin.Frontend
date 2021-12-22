/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { DateString } from '@app/core';

import { AccountingCalendarsDataService } from '@app/data-services';

import { AccountingCalendar } from '@app/models';

@Component({
  selector: 'emp-fa-accounting-calendars-editor',
  templateUrl: './accounting-calendars-editor.component.html',
  styles: [`
    .date-item {
      padding: 4px 1px 4px 8px;
      margin-right: 8px;
      border-radius: 2px;
      border-left: 4px solid #235b4e;
      background: #f6f6f6;
    }
    .date-item button {
      height: 24px;
      width: 24px;
      line-height: 24px;
      margin-right: 1px;
    }
  `],
})
export class AccountingCalendarsEditorComponent implements OnInit {

  @Output() closeEvent = new EventEmitter<void>();

  isLoading = false;

  accountingCalendarsList: any[] = [];

  accountingCalendarUID = null;

  accountingCalendarSelected: AccountingCalendar = null;

  dateToAdd: DateString = null;

  constructor(private accountingCalendarsData: AccountingCalendarsDataService){}


  ngOnInit(): void {
    this.getAccountingCalendars();
  }


  onClose() {
    this.closeEvent.emit();
  }


  onAccountingCalendarChanges() {
    this.accountingCalendarSelected = null;
    this.dateToAdd = null;

    if (!!this.accountingCalendarUID) {
      this.getAccountingCalendar(this.accountingCalendarUID);
    }
  }


  onAddDateClicked() {
    if (!!this.dateToAdd) {
      this.addDateToAccountingCalendar(this.accountingCalendarSelected.uid, this.dateToAdd);
    }
  }


  onRemoveDateClicked(date: DateString) {
    this.removeDateFromAccountingCalendar(this.accountingCalendarSelected.uid, date);
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
      .finally(() => this.isLoading = false);
  }


  private addDateToAccountingCalendar(accountingCalendarUID: string, date: DateString) {
    this.isLoading = true;

    this.accountingCalendarsData.addDateToAccountingCalendar(accountingCalendarUID, date)
      .toPromise()
      .then(x => {
        this.accountingCalendarSelected = x;
        this.dateToAdd = null;
      })
      .finally(() => this.isLoading = false);
  }


  private removeDateFromAccountingCalendar(accountingCalendarUID: string, date: DateString) {
    this.isLoading = true;

    this.accountingCalendarsData.removeDateFromAccountingCalendar(accountingCalendarUID, date)
      .toPromise()
      .then(x => this.accountingCalendarSelected = x)
      .finally(() => this.isLoading = false);
  }

}
