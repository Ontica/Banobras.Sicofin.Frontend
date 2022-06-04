/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, DateString, HttpService, Identifiable } from '@app/core';

import { ExchangeRate, ExchangeRateDescriptor, ExchangeRatesQuery, ExchangeRateValues,
         FileReport } from '@app/models';


@Injectable()
export class ExchangeRatesDataService {

  constructor(private http: HttpService) { }


  getExchangeRatesTypes(): Observable<Identifiable[]> {
    const path = `v2/financial-accounting/exchange-rates/exchange-rates-types`;

    return this.http.get<Identifiable[]>(path);
  }


  getCurrencies(): Observable<Identifiable[]> {
    const path = `v2/financial-accounting/catalogues/currencies`;

    return this.http.get<Identifiable[]>(path);
  }


  getExchangeRatesForDate(date: DateString): Observable<ExchangeRate[]> {
    Assertion.assertValue(date, 'date');

    const path = `v1/financial-accounting/exchange-rates/?date=${date}`;

    return this.http.get<ExchangeRate[]>(path);
  }


  searchExchangeRates(query: ExchangeRatesQuery): Observable<ExchangeRateDescriptor> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/financial-accounting/exchange-rates';

    return this.http.post<ExchangeRateDescriptor>(path, query);
  }


  exportExchangeRatesToExcel(query: ExchangeRatesQuery): Observable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/exchange-rates/excel`;

    return this.http.post<FileReport>(path, query);
  }


  getExchangeRatesForEdition(query: ExchangeRateValues): Observable<ExchangeRateValues> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/financial-accounting/exchange-rates/for-edition';

    return this.http.post<ExchangeRateValues>(path, query);
  }


  updateExchangeRates(exchangeRateValues: ExchangeRateValues): Observable<ExchangeRateValues> {
    Assertion.assertValue(exchangeRateValues, 'exchangeRateValues');

    const path = 'v2/financial-accounting/exchange-rates/update-all';

    return this.http.post<ExchangeRateValues>(path, exchangeRateValues);
  }

}
