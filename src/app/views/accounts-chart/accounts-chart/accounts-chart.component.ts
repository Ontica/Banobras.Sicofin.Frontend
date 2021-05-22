/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { AccountsChartDataService } from '@app/data-services/accounts-chart.data.service';

import { AccountsChart, AccountsSearchCommand, EmptyAccountsChart } from '@app/models';

import { AccountsChartFilterEventType } from '../accounts-chart-filter/accounts-chart-filter.component';

import { AccountsChartListEventType } from '../accounts-chart-list/accounts-chart-list.component';

export enum AccountsChartEventType {
  ACCOUNT_SELECTED = 'AccountsChartComponent.Event.AccountSelected',
}

@Component({
  selector: 'emp-fa-accounts-chart',
  templateUrl: './accounts-chart.component.html',
})
export class AccountsChartComponent {

  @Output() accountsChartEvent = new EventEmitter<EventInfo>();

  cardHint = 'Selecciona los filtros';

  isLoading = false;

  submitted = false;

  showFilters = false;

  accountsChart: AccountsChart = EmptyAccountsChart;

  selectedAccountChartUID = '';

  constructor(private accountsChartData: AccountsChartDataService) { }


  onAccountsChartFilterEvent(event) {
    switch (event.type as AccountsChartFilterEventType) {

      case AccountsChartFilterEventType.SEARCH_ACCOUNTS_CHART_CLICKED:
        Assertion.assertValue(event.payload.accountsChart, 'event.payload.accountsChart');
        Assertion.assertValue(event.payload.accountsSearchCommand, 'event.payload.accountsSearchCommand');

        this.selectedAccountChartUID = event.payload.accountsChart.uid;

        this.searchAccounts(this.selectedAccountChartUID, event.payload.accountsSearchCommand);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccountsChartListEvent(event) {
    switch (event.type as AccountsChartListEventType) {
      case AccountsChartListEventType.ACCOUNT_CLICKED:
        Assertion.assertValue(event.payload.account, 'event.payload.account');

        this.getAccount(this.selectedAccountChartUID, event.payload.account.uid);

        break;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
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


  private getAccount(accountsChartUID: string, accountUID: string) {
    this.setSubmitted(true);

    this.accountsChartData.getAccount(accountsChartUID, accountUID)
      .toPromise()
      .then(account => this.sendEvent(AccountsChartEventType.ACCOUNT_SELECTED, { account }))
      .finally(() => this.setSubmitted(false));
  }


  private setText(accountsChartName) {
    this.cardHint = accountsChartName ?? 'Selecciona los filtro';
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }


  private sendEvent(eventType: AccountsChartEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.accountsChartEvent.emit(event);
  }

}
