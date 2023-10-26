/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { Account, AccountsChart, AccountsChartMasterData, AccountsQuery, FileReport } from '@app/models';


@Injectable()
export class AccountsChartDataService {


  constructor(private http: HttpService) { }


  getAccountsChartsList(): EmpObservable<Identifiable[]> {
    const path = `v2/financial-accounting/accounts-charts`;

    return this.http.get<Identifiable[]>(path);
  }


  getAccountsChartsMasterData(): EmpObservable<AccountsChartMasterData[]> {
    const path = `v2/financial-accounting/accounts-charts-master-data`;

    return this.http.get<AccountsChartMasterData[]>(path);
  }


  searchAccounts(accountsChartUID: string, query: AccountsQuery): EmpObservable<AccountsChart> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}`;

    return this.http.post<AccountsChart>(path, query);
  }


  searchAccountsIFRS(query: AccountsQuery): EmpObservable<AccountsChart> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/accounts-charts/ifrs`;

    return this.http.post<AccountsChart>(path, query);
  }


  exportAccountsToExcel(accountsChartUID: string, query: AccountsQuery): EmpObservable<FileReport> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}/excel`;

    return this.http.post<FileReport>(path, query);
  }


  getAccount(accountsChartUID: string,
             accountUID: string): EmpObservable<Account> {
    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}/accounts/${accountUID}`;

    return this.http.get<Account>(path);
  }

}
