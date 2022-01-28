/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { Account, AccountsChart, AccountsChartMasterData, AccountsSearchCommand,
         FileReport } from '@app/models';


@Injectable()
export class AccountsChartDataService {


  constructor(private http: HttpService) { }


  getAccount(accountsChartUID: string,
             accountUID: string): Observable<Account> {
    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}/accounts/${accountUID}`;

    return this.http.get<Account>(path);
  }


  getAccountsChartsList(): Observable<Identifiable[]> {
    const path = `v2/financial-accounting/accounts-charts`;

    return this.http.get<Identifiable[]>(path);
  }


  getAccountsChartsMasterData(): Observable<AccountsChartMasterData[]> {
    const path = `v2/financial-accounting/accounts-charts-master-data`;

    return this.http.get<AccountsChartMasterData[]>(path);
  }


  exportAccountsToExcel(accountsChartUID: string,
                        searchCommand: AccountsSearchCommand): Observable<FileReport> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');
    Assertion.assertValue(searchCommand, 'searchCommand');

    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}/excel`;

    return this.http.post<FileReport>(path, searchCommand);
  }


  searchAccounts(accountsChartUID: string,
                 searchCommand: AccountsSearchCommand): Observable<AccountsChart> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');
    Assertion.assertValue(searchCommand, 'searchCommand');

    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}`;

    return this.http.post<AccountsChart>(path, searchCommand);
  }


  cleanUpAccounts(): Observable<string> {
    const path = `v2/financial-accounting/accounts-charts/cleanup`;

    return this.http.post<string>(path);
  }

}
