/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { AccountsChartDataService } from '@app/data-services';

import { AccountsChart, AccountsSearchCommand, EmptyAccountsChart,
         EmptyAccountsSearchCommand } from '@app/models';

import {
  ExportReportModalEventType
} from '../../reports-controls/export-report-modal/export-report-modal.component';

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

  cardHint = 'Editor y visualizador de los catálogos de cuentas';

  isLoading = false;

  submitted = false;

  accountsChart: AccountsChart = EmptyAccountsChart;

  accountsSearchCommand: AccountsSearchCommand = Object.assign({}, EmptyAccountsSearchCommand);

  selectedAccountChartUID = '';

  displayExportModal = false;

  excelFileUrl = '';


  constructor(private accountsChartData: AccountsChartDataService) { }


  onAccountsChartFilterEvent(event) {
    switch (event.type as AccountsChartFilterEventType) {

      case AccountsChartFilterEventType.SEARCH_ACCOUNTS_CHART_CLICKED:
        Assertion.assertValue(event.payload.accountsChart, 'event.payload.accountsChart');
        Assertion.assertValue(event.payload.accountsSearchCommand, 'event.payload.accountsSearchCommand');

        this.selectedAccountChartUID = event.payload.accountsChart.uid;

        this.accountsSearchCommand = event.payload.accountsSearchCommand as AccountsSearchCommand;

        this.excelFileUrl = '';

        this.searchAccounts(this.selectedAccountChartUID, this.accountsSearchCommand);

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

      case AccountsChartListEventType.EXPORT_ACCOUNTS:
        this.displayExportModal = true;

        break;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event) {
    switch (event.type as ExportReportModalEventType) {

      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.displayExportModal = false;
        return;

      case ExportReportModalEventType.EXPORT_EXCEL_CLICKED:
        if (this.submitted || !this.accountsSearchCommand ) {
          return;
        }

        this.exportAccountsToExcel();

        return;

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


  private exportAccountsToExcel() {
    console.log('EXPORT_ACCOUNTS', {accountsChartUID: this.selectedAccountChartUID,
                                    searchCommand: this.accountsSearchCommand });

    setTimeout(() => {
      this.excelFileUrl = 'data-dummy';
    }, 1000);
  }


  private getAccount(accountsChartUID: string, accountUID: string) {
    this.setSubmitted(true);

    this.accountsChartData.getAccount(accountsChartUID, accountUID)
      .toPromise()
      .then(account => this.sendEvent(AccountsChartEventType.ACCOUNT_SELECTED, { account }))
      .finally(() => this.setSubmitted(false));
  }


  private setText(accountsChartName) {
    this.cardHint = accountsChartName ?? 'Filtro no seleccionado';
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
