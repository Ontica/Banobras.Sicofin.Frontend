/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion } from '@app/core';

import { BalancesDataService } from '@app/data-services';

import { EmptyTrialBalance, getTrialBalanceTypeNameFromUid, TrialBalance,
         TrialBalanceCommand } from '@app/models';

import { TrialBalanceFilterEventType } from '../trial-balance-filter/trial-balance-filter.component';

@Component({
  selector: 'emp-fa-trial-balance',
  templateUrl: './trial-balance.component.html',
})
export class TrialBalanceComponent {

  cardHint = 'Selecciona los filtros';

  isLoading = false;

  submitted = false;

  trialBalance: TrialBalance = EmptyTrialBalance;

  constructor(private balancesDataService: BalancesDataService) { }


  onAccountsChartFilterEvent(event) {
    switch (event.type as TrialBalanceFilterEventType) {

      case TrialBalanceFilterEventType.BUILD_TRIAL_BALANCE_CLICKED:
        Assertion.assertValue(event.payload.trialBalanceCommand, 'event.payload.trialBalanceCommand');

        this.getTrialBalance(event.payload.trialBalanceCommand as TrialBalanceCommand);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getTrialBalance(trialBalanceCommand: TrialBalanceCommand) {
    this.setSubmitted(true);

    this.balancesDataService.getTrialBalance(trialBalanceCommand)
      .toPromise()
      .then(x => {
        this.trialBalance = x;
        this.setText(getTrialBalanceTypeNameFromUid(this.trialBalance.command.trialBalanceType));
      })
      .finally(() => this.setSubmitted(false));
  }


  private setText(trialBalanceTypeName) {
    this.cardHint = trialBalanceTypeName ?? 'Selecciona los filtros';
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }

}
