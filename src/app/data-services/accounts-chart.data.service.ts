/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { Account, AccountEditionCommand, AccountEditionResult, AccountsChart, AccountsChartMasterData,
         AccountsQuery, FileReport, ImportAccountsCommand, ImportAccountsResult } from '@app/models';


@Injectable()
export class AccountsChartDataService {


  constructor(private http: HttpService) { }


  getAccountsChartsList(): Observable<Identifiable[]> {
    const path = `v2/financial-accounting/accounts-charts`;

    return this.http.get<Identifiable[]>(path);
  }


  getAccountsChartsMasterData(): Observable<AccountsChartMasterData[]> {
    const path = `v2/financial-accounting/accounts-charts-master-data`;

    return this.http.get<AccountsChartMasterData[]>(path);
  }


  searchAccounts(accountsChartUID: string, query: AccountsQuery): Observable<AccountsChart> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}`;

    return this.http.post<AccountsChart>(path, query);
  }


  exportAccountsToExcel(accountsChartUID: string, query: AccountsQuery): Observable<FileReport> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}/excel`;

    return this.http.post<FileReport>(path, query);
  }


  getAccount(accountsChartUID: string,
             accountUID: string): Observable<Account> {
    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}/accounts/${accountUID}`;

    return this.http.get<Account>(path);
  }

  //
  // Edition
  //

  editAccount(command: AccountEditionCommand): Observable<AccountEditionResult> {
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/accounts-charts/process-command`;

    return this.http.post<AccountEditionResult>(path, command);
  }


  dryRunUpdateAccountsChartFromExcel(file: File,
                                     command: ImportAccountsCommand): Observable<ImportAccountsResult[]> {
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(command, 'command');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('command', JSON.stringify(command));

    const path = `v2/financial-accounting/accounts-charts/update-from-excel-file/dry-run`;

    return this.http.post<ImportAccountsResult[]>(path, formData);
  }


  updateAccountsChartFromExcel(file: File,
                              command: ImportAccountsCommand): Observable<ImportAccountsResult[]> {
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(command, 'command');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('command', JSON.stringify(command));

    const path = `v2/financial-accounting/accounts-charts/update-from-excel-file`;

    return this.http.post<ImportAccountsResult[]>(path, formData);
  }

}
