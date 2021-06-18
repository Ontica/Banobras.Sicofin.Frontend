/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { StoredBalanceSet } from '@app/models';


@Injectable()
export class BalancesStoreDataService {

  constructor(private http: HttpService) { }


  getBalancesSetsList(accountsChartUID: string): Observable<StoredBalanceSet[]> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');

    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}/balance-store`;

    return this.http.get<StoredBalanceSet[]>(path);
  }


  getStoredBalanceSet(accountsChartUID: string, balanceSetUID: string): Observable<StoredBalanceSet> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');

    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}/balance-store/${balanceSetUID}`;

    return this.http.get<StoredBalanceSet>(path);
  }

}
