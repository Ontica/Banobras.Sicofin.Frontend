/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { AccountBalance, Balance, BalanceCommand, FileReport, TrialBalance,
         TrialBalanceCommand } from '@app/models';


@Injectable()
export class BalancesDataService {

  constructor(private http: HttpService) { }


  exportTrialBalanceToExcel(trialBalanceCommand: TrialBalanceCommand): Observable<FileReport> {
    Assertion.assertValue(trialBalanceCommand, 'trialBalanceCommand');

    const path = `v2/financial-accounting/trial-balance/excel`;

    return this.http.post<FileReport>(path, trialBalanceCommand);
  }


  getLedgersAccountsBalances(standardAccountUID: string): Observable<AccountBalance[]> {
    Assertion.assertValue(standardAccountUID, 'standardAccountUID');

    const path = `v2/financial-accounting/balances/${standardAccountUID}`;

    return this.http.get<AccountBalance[]>(path);
  }


  getBalance(balanceCommand: BalanceCommand): Observable<Balance> {
    Assertion.assertValue(balanceCommand, 'balanceCommand');

    const path = `v2/financial-accounting/balance`;

    return this.http.post<Balance>(path, balanceCommand);
  }


  getTrialBalance(trialBalanceCommand: TrialBalanceCommand): Observable<TrialBalance> {
    Assertion.assertValue(trialBalanceCommand, 'trialBalanceCommand');

    const path = `v2/financial-accounting/trial-balance`;

    return this.http.post<TrialBalance>(path, trialBalanceCommand);
  }

}
