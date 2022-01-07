/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';

export interface AccountingCalendar {
  uid: string;
  name: string;
  periods: AccountingCalendarPeriod[];
}


export interface AccountingCalendarPeriod {
  uid: string;
  period: string;
  fromDate: DateString;
  toDate: DateString;
}


export interface AccountingCalendarPeriodFields {
  period: string;
  fromDate: DateString;
  toDate: DateString;
}
