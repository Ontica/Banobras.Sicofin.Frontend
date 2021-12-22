/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, DateString, HttpService, Identifiable } from '@app/core';

import { AccountingCalendar } from '@app/models';


@Injectable()
export class AccountingCalendarsDataService {

  constructor(private http: HttpService) { }


  getAccountingCalendars(): Observable<Identifiable[]> {
    const path = `v2/financial-accounting/catalogues/accounting-calendars`;

    return this.http.get<Identifiable[]>(path);
  }


  getAccountingCalendar(calendarUID: string): Observable<AccountingCalendar> {
    Assertion.assertValue(calendarUID, 'calendarUID');

    const path = `v2/financial-accounting/catalogues/accounting-calendars/${calendarUID}`;

    return this.http.get<AccountingCalendar>(path);
  }


  addDateToAccountingCalendar(calendarUID: string, date: DateString): Observable<AccountingCalendar> {
    Assertion.assertValue(calendarUID, 'calendarUID');
    Assertion.assertValue(date, 'date');

    const path = `v2/financial-accounting/catalogues/accounting-calendars/${calendarUID}/add-date/${date}`;

    return this.http.post<AccountingCalendar>(path);
  }


  removeDateFromAccountingCalendar(calendarUID: string, date: DateString): Observable<AccountingCalendar> {
    Assertion.assertValue(calendarUID, 'calendarUID');
    Assertion.assertValue(date, 'date');

    const path = `v2/financial-accounting/catalogues/accounting-calendars/${calendarUID}/remove-date/${date}`;

    return this.http.delete<AccountingCalendar>(path);
  }

}
