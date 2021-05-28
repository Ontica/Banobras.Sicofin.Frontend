/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion } from '@app/core';

import { TrialBalanceFilterEventType } from '../trial-balance-filter/trial-balance-filter.component';

@Component({
  selector: 'emp-fa-trial-balance',
  templateUrl: './trial-balance.component.html',
})
export class TrialBalanceComponent {

  cardHint = 'Selecciona los filtros';

  isLoading = false;

  submitted = false;

  showFilters = false;


  onAccountsChartFilterEvent(event) {
    switch (event.type as TrialBalanceFilterEventType) {

      case TrialBalanceFilterEventType.BUILD_TRIAL_BALANCE_CLICKED:
        Assertion.assertValue(event.payload.trialBalanceCommand, 'event.payload.trialBalanceCommand');

        console.log('BUILD_TRIAL_BALANCE_CLICKED: ', event.payload.trialBalanceCommand);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText(trialBalanceTypeName) {
    this.cardHint = trialBalanceTypeName ?? 'Selecciona los filtros';
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }

}
