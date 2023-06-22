/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { ReportingDataService } from '@app/data-services';

import { AccountsChartMasterData, EmptyFinancialReportQuery, EmptyFinancialReportType,
         EmptyFinancialReportTypeFlags, FinancialReportQuery, FinancialReportTypeFlags,
         ReportType } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';


export enum FinancialReportFilterEventType {
  BUILD_REPORT_CLICKED = 'FinancialReportFilterComponent.Event.BuildReportClicked',
}

@Component({
  selector: 'emp-fa-financial-report-filter',
  templateUrl: './financial-report-filter.component.html',
})
export class FinancialReportFilterComponent implements OnInit, OnDestroy {

  @Output() financialReportFilterEvent = new EventEmitter<EventInfo>();

  query: FinancialReportQuery = Object.assign({}, EmptyFinancialReportQuery);

  selectedReportType: ReportType<FinancialReportTypeFlags> = EmptyFinancialReportType;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  reportTypeList: ReportType<FinancialReportTypeFlags>[] = [];

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private reportingData: ReportingDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.loadAccountsCharts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get showField(): FinancialReportTypeFlags  {
    return isEmpty(this.selectedReportType) ? EmptyFinancialReportTypeFlags : this.selectedReportType.show;
  }


  get periodValid(): boolean {
    if (this.showField.datePeriod) {
      return !!this.query.fromDate && !!this.query.toDate;
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


  onReportTypeChanges(reportType: ReportType<FinancialReportTypeFlags>) {
    this.selectedReportType = isEmpty(reportType) ? EmptyFinancialReportType : reportType;
    this.query.financialReportType = this.selectedReportType.uid ?? '';
  }


  onBuildReportClicked() {
    const payload = {
      query: this.getReportQueryData(),
      reportType: this.selectedReportType,
    };

    sendEvent(this.financialReportFilterEvent, FinancialReportFilterEventType.BUILD_REPORT_CLICKED, payload);
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
    this.query.financialReportType = '';
    this.reportTypeList = [];
  }


  private getFinancialReportTypes(accountChartUID: string) {
    this.isLoading = true;

    this.reportingData.getFinancialReportTypes(accountChartUID)
      .firstValue()
      .then(x => this.reportTypeList = x)
      .finally(() => this.isLoading = false);
  }


  private getReportQueryData(): FinancialReportQuery {
    const data: FinancialReportQuery = {
      financialReportType: this.query.financialReportType,
      accountsChartUID: this.query.accountsChartUID,
    };

    if (this.showField.singleDate) {
      data.toDate = this.query.toDate ?? null;
    }

    if (this.showField.datePeriod) {
      data.fromDate = this.query.fromDate ?? null;
      data.toDate = this.query.toDate ?? null;
    }

    if (this.showField.getAccountsIntegration) {
      data.getAccountsIntegration = this.query?.getAccountsIntegration ?? false;
    }

    return data;
  }

}
