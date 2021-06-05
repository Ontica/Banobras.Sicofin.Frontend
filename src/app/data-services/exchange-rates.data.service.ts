/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { ExchangeRate  } from '@app/models';


@Injectable()
export class ExchangeRatesDataService {

  constructor(private http: HttpService) { }


  getExchangeRatesForDate(date: string): Observable<ExchangeRate[]> {
    Assertion.assertValue(date, 'date');

    const path = `v2/financial-accounting/exchange-rates/?date=${date}`;

    return this.http.get<ExchangeRate[]>(path);
  }

}
