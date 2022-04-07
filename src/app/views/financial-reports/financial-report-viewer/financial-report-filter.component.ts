/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FinancialReportsDataService } from '@app/data-services';

import { AccountsChartMasterData, EmptyFinancialReportCommand, FinancialReportCommand,
         ReportType } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';


export enum FinancialReportFilterEventType {
  BUILD_FINANCIAL_REPORT_CLICKED   = 'FinancialReportFilterComponent.Event.BuildFinancialReportClicked',
}

@Component({
  selector: 'emp-fa-financial-report-filter',
  templateUrl: './financial-report-filter.component.html',
})
export class FinancialReportFilterComponent implements OnInit, OnDestroy {

  @Output() financialReportFilterEvent = new EventEmitter<EventInfo>();

  command: FinancialReportCommand = Object.assign({}, EmptyFinancialReportCommand);

  selectedReportType: ReportType = null;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  reportTypeList: ReportType[] = [];

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private financialReportsData: FinancialReportsDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadAccountsCharts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get periodValid() {
    if (this.selectedReportType?.show.datePeriod) {
      return !!this.command.fromDate && !!this.command.toDate;
    }

    return true;
  }


  onAccountsChartChanges(accountChart: AccountsChartMasterData) {
    this.resetReportType();
    this.onReportTypeChanges(null);

    if (accountChart.uid) {
      this.getFinancialReportTypes(accountChart.uid);
    }
  }


  onReportTypeChanges(reportType: ReportType) {
    this.selectedReportType = reportType ?? null;

    this.command.financialReportType = reportType?.uid ?? null;
    this.command.fromDate = '';
    this.command.toDate = '';
    this.command.getAccountsIntegration = false;
    this.command.exportTo = null;
  }


  onBuildReportClicked() {
    const payload = {
      command: this.getReportCommandData(),
      reportType: this.selectedReportType,
    };

    sendEvent(this.financialReportFilterEvent,
      FinancialReportFilterEventType.BUILD_FINANCIAL_REPORT_CLICKED, payload);
  }


  private loadAccountsCharts() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.isLoading = false;
      });
  }


  private resetReportType() {
    this.command.financialReportType = '';
    this.reportTypeList = [];
  }


  private getFinancialReportTypes(accountChartUID) {
    this.isLoading = true;

    this.financialReportsData.getFinancialReportTypes(accountChartUID)
      .toPromise()
      .then(x => this.reportTypeList = x)
      .finally(() => this.isLoading = false);
  }


  private getReportCommandData(): FinancialReportCommand {
    const data: FinancialReportCommand = {
      financialReportType: this.command.financialReportType,
      accountsChartUID: this.command.accountsChartUID,
    };

    if (this.selectedReportType?.show.datePeriod) {
      data.fromDate = this.command.fromDate ?? null;
      data.toDate = this.command.toDate ?? null;
    }

    if (this.selectedReportType?.show.singleDate) {
      data.toDate = this.command.toDate ?? null;
    }

    if (this.selectedReportType?.show.getAccountsIntegration) {
      data.getAccountsIntegration = this.command?.getAccountsIntegration ?? false;
    }

    return data;
  }

}
