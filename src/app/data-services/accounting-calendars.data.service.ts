/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { AccountingCalendar, AccountingCalendarPeriodFields  } from '@app/models';


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


  addPeriodToAccountingCalendar(calendarUID: string, periodFields: AccountingCalendarPeriodFields):
    Observable<AccountingCalendar> {
    Assertion.assertValue(calendarUID, 'calendarUID');
    Assertion.assertValue(periodFields, 'periodFields');

    const path = `v2/financial-accounting/catalogues/accounting-calendars/${calendarUID}/add-period`;

    return this.http.post<AccountingCalendar>(path, periodFields);
  }


  removePeriodFromAccountingCalendar(calendarUID: string,
                                     periodUID: string): Observable<AccountingCalendar> {
    Assertion.assertValue(calendarUID, 'calendarUID');
    Assertion.assertValue(periodUID, 'periodUID');

    const path = `v2/financial-accounting/catalogues/accounting-calendars/${calendarUID}` +
      `/remove-period/${periodUID}`;

    return this.http.delete<AccountingCalendar>(path);
  }

}
