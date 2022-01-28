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

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

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

  isLoadingAccounts = false;

  isLoading = false;

  submitted = false;

  accountsChart: AccountsChart = EmptyAccountsChart;

  accountsSearchCommand: AccountsSearchCommand = Object.assign({}, EmptyAccountsSearchCommand);

  selectedAccountChartUID = '';

  displayExportModal = false;

  excelFileUrl = '';

  showFilters = false;

  constructor(private accountsChartData: AccountsChartDataService,
              private messageBox: MessageBoxService) { }


  onAccountsChartFilterEvent(event) {
    switch (event.type as AccountsChartFilterEventType) {

      case AccountsChartFilterEventType.CLEAR_ACCOUNTS_CHART_CLICKED:
        Assertion.assertValue(event.payload.accountsChart, 'event.payload.accountsChart');
        Assertion.assertValue(event.payload.accountsSearchCommand, 'event.payload.accountsSearchCommand');

        this.selectedAccountChartUID = event.payload.accountsChart.uid;

        this.accountsSearchCommand = event.payload.accountsSearchCommand as AccountsSearchCommand;

        this.setAccountData(EmptyAccountsChart);

        return;

      case AccountsChartFilterEventType.SEARCH_ACCOUNTS_CHART_CLICKED:
        Assertion.assertValue(event.payload.accountsChart, 'event.payload.accountsChart');
        Assertion.assertValue(event.payload.accountsSearchCommand, 'event.payload.accountsSearchCommand');

        this.selectedAccountChartUID = event.payload.accountsChart.uid;

        this.accountsSearchCommand = event.payload.accountsSearchCommand as AccountsSearchCommand;

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
        this.setDisplayExportModal(true);
        break;

      case AccountsChartListEventType.CLEAN_UP_ACCOUNT_DATA:
        this.cleanUpAccounts();
        break;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event) {
    switch (event.type as ExportReportModalEventType) {

      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;

      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
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
    this.setLoadingAccounts(true);

    this.accountsChartData.searchAccounts(accountsChartUID, searchCommand)
      .toPromise()
      .then(x => {
        this.setAccountData(x);
        this.showFilters = false;
      })
      .finally(() => this.setLoadingAccounts(false));
  }


  private exportAccountsToExcel() {
    this.accountsChartData.exportAccountsToExcel(this.selectedAccountChartUID,
                                                 this.accountsSearchCommand)
      .toPromise()
      .then(x => {
        this.excelFileUrl = x.url;
      });
  }


  private cleanUpAccounts() {
    this.setSubmitted(true);

    this.accountsChartData.cleanUpAccounts()
      .toPromise()
      .then(x => this.messageBox.show(x, 'Limpiar cuentas'))
      .finally(() => this.setSubmitted(false));
  }


  private getAccount(accountsChartUID: string, accountUID: string) {
    this.setSubmitted(true);

    this.accountsChartData.getAccount(accountsChartUID, accountUID)
      .toPromise()
      .then(account => sendEvent(this.accountsChartEvent, AccountsChartEventType.ACCOUNT_SELECTED,
                        { account }))
      .finally(() => this.setSubmitted(false));
  }


  private setAccountData(accountsChart: AccountsChart) {
    this.accountsChart = accountsChart;
    this.setText(this.accountsChart.name);
  }


  private setText(accountsChartName) {
    this.cardHint = accountsChartName ?? 'Filtro no seleccionado';
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }


  private setLoadingAccounts(loading: boolean) {
    this.isLoadingAccounts = loading;
    this.setSubmitted(loading);
  }


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.excelFileUrl = '';
  }

}
