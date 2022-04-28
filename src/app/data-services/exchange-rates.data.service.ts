/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, DateString, HttpService, Identifiable } from '@app/core';

import { ExchangeRate, ExchangeRatesSearchCommand  } from '@app/models';


@Injectable()
export class ExchangeRatesDataService {

  constructor(private http: HttpService) { }


  getExchangeRatesTypes(): Observable<Identifiable[]> {
    const path = `v2/financial-accounting/exchange-rates/exchange-rates-types`;

    return this.http.get<Identifiable[]>(path);
  }


  getCurrencies(): Observable<Identifiable[]> {
    const path = `v2/financial-accounting/currencies`;

    return this.http.get<Identifiable[]>(path);
  }


  getExchangeRatesForDate(date: DateString): Observable<ExchangeRate[]> {
    Assertion.assertValue(date, 'date');

    const path = `v1/financial-accounting/exchange-rates/?date=${date}`;

    return this.http.get<ExchangeRate[]>(path);
  }


  searchExchangeRates(command: ExchangeRatesSearchCommand): Observable<any> {
    Assertion.assertValue(command, 'command');

    const path = 'v2/financial-accounting/exchange-rates';

    return this.http.post<any>(path, command);
  }

}
