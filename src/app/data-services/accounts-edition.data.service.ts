/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { AccountEditionCommand, AccountEditionResult, ImportAccountsCommand,
         ImportAccountsResult } from '@app/models';


@Injectable()
export class AccountsEditionDataService {


  constructor(private http: HttpService) { }


  createAccount(accountsChartUID: string,
                command: AccountEditionCommand): Observable<AccountEditionResult> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}/accounts`;

    return this.http.post<AccountEditionResult>(path, command);
  }


  updateAccount(accountsChartUID: string,
                accountUID: string,
                command: AccountEditionCommand): Observable<AccountEditionResult> {
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/accounts-charts/${accountsChartUID}/accounts/${accountUID}`;

    return this.http.put<AccountEditionResult>(path, command);
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
