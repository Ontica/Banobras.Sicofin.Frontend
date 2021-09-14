/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { ExcelFile, StoredBalanceSet } from '@app/models';


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


  createStoredBalancesSet(accountsChartUID: string, balanceSet: any): Observable<StoredBalanceSet> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');
    Assertion.assertValue(balanceSet, 'balanceSet');

    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}/balance-store`;

    return this.http.post<StoredBalanceSet>(path, balanceSet);
  }


  calculateStoredBalancesSet(accountsChartUID: string,
                             balanceSetUID: string,
                             balanceSet: any): Observable<StoredBalanceSet> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');
    Assertion.assertValue(balanceSetUID, 'balanceSetUID');
    Assertion.assertValue(balanceSet, 'balanceSet');

    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}` +
      `/balance-store/${balanceSetUID}/calculate`;

    return this.http.post<StoredBalanceSet>(path, balanceSet);
  }


  exportStoredBalanceSetToExcel(accountsChartUID: string, balanceSetUID: string): Observable<ExcelFile> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');
    Assertion.assertValue(balanceSetUID, 'balanceSetUID');

    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}` +
      `/balance-store/${balanceSetUID}/excel`;

    return this.http.get<ExcelFile>(path);
  }

}
