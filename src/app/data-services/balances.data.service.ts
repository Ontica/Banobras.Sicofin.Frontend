/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { AccountBalance, AccountStatement, AccountStatementQuery, BalanceExplorerResult, BalanceExplorerQuery,
         FileReport, TrialBalance, TrialBalanceQuery } from '@app/models';


@Injectable()
export class BalancesDataService {

  constructor(private http: HttpService) { }


  getLedgersAccountsBalances(standardAccountUID: string): EmpObservable<AccountBalance[]> {
    Assertion.assertValue(standardAccountUID, 'standardAccountUID');

    const path = `v2/financial-accounting/balances/${standardAccountUID}`;

    return this.http.get<AccountBalance[]>(path);
  }


  exportBalanceExplorerBalancesToExcel(query: BalanceExplorerQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/financial-accounting/balance-explorer/balances/excel';

    return this.http.post<FileReport>(path, query);
  }


  getBalancesForBalanceExplorer(query: BalanceExplorerQuery): EmpObservable<BalanceExplorerResult> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/balance-explorer/balances`;

    return this.http.post<BalanceExplorerResult>(path, query);
  }


  exportTrialBalanceToExcel(query: TrialBalanceQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/financial-accounting/balance-engine/trial-balance/excel';

    return this.http.post<FileReport>(path, query);
  }


  getTrialBalance(query: TrialBalanceQuery): EmpObservable<TrialBalance> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/balance-engine/trial-balance`;

    return this.http.post<TrialBalance>(path, query);
  }


  exportAccountStatementToExcel(query: AccountStatementQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/account-statement/excel`;

    return this.http.post<FileReport>(path, query);
  }


  getAccountStatement(query: AccountStatementQuery): EmpObservable<AccountStatement> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/account-statement`;

    return this.http.post<AccountStatement>(path, query);
  }

}
