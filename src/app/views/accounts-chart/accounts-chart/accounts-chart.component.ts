/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, isEmpty } from '@app/core';

import { AccountsChartDataService } from '@app/data-services/accounts-chart.data.service';

import { AccountsChart, AccountsSearchCommand, EmptyAccountsChart } from '@app/models';

import { RecordingBookSelectorEventType } from '../accounts-chart-filter/accounts-chart-filter.component';

@Component({
  selector: 'emp-fa-accounts-chart',
  templateUrl: './accounts-chart.component.html',
})
export class AccountsChartComponent {

  cardHint = 'Selecciona los filtros';

  isLoading = false;

  submitted = false;

  showFilters = false;

  accountsChart: AccountsChart = EmptyAccountsChart;

  constructor(private accountsChartData: AccountsChartDataService) { }


  onAccountsChartFilterEvent(event) {
    switch (event.type as RecordingBookSelectorEventType) {

      case RecordingBookSelectorEventType.SEARCH_ACCOUNTS_CHART_CLICKED:
        Assertion.assertValue(event.payload.accountsChart, 'event.payload.accountsChart');
        Assertion.assertValue(event.payload.accountsSearchCommand, 'event.payload.accountsSearchCommand');

        this.searchAccounts(event.payload.accountsChart.uid, event.payload.accountsSearchCommand);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  setText(accountsChartName) {
    this.cardHint = accountsChartName ?? 'Selecciona los filtro';
  }


  private searchAccounts(accountsChartUID: string, searchCommand: AccountsSearchCommand) {
    this.setSubmitted(true);

    this.accountsChartData.searchAccounts(accountsChartUID, searchCommand)
      .toPromise()
      .then(x => {
        this.accountsChart = x;
        this.setText(this.accountsChart.name);
      })
      .finally(() => this.setSubmitted(false));
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }

}
