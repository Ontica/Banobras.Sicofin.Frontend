/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { combineLatest } from 'rxjs';

import { EventInfo, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountChartStateSelector,
         ReportingStateSelector } from '@app/presentation/exported.presentation.types';

import { AccountsChartMasterData, EmptyFinancialReportQuery, EmptyFinancialReportType,
         EmptyFinancialReportTypeFlags, EmtyAccountsChartMasterData, FinancialReportQuery,
         FinancialReportTypeFlags, ReportGroup, ReportType } from '@app/models';


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

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  selectedAccountChart: AccountsChartMasterData = EmtyAccountsChartMasterData;

  reportTypeList: ReportType<FinancialReportTypeFlags>[] = [];

  filteredReportTypeList: ReportType<FinancialReportTypeFlags>[] = [];

  selectedReportType: ReportType<FinancialReportTypeFlags> = EmptyFinancialReportType;

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get showField(): FinancialReportTypeFlags  {
    return isEmpty(this.selectedReportType) ? EmptyFinancialReportTypeFlags : this.selectedReportType.show;
  }


  get isPeriodValid(): boolean {
    if (this.showField.datePeriod) {
      return !!this.query.fromDate && !!this.query.toDate;
    }

    return true;
  }


  onAccountsChartChanges(accountChart: AccountsChartMasterData) {
    this.selectedAccountChart = accountChart;
    this.setFilteredReportTypeList();
    this.onReportTypeChanges(null);
  }


  onReportTypeChanges(reportType: ReportType<FinancialReportTypeFlags>) {
    this.selectedReportType = isEmpty(reportType) ? EmptyFinancialReportType : reportType;
    this.query.reportType = this.selectedReportType.uid ?? '';
  }


  onBuildReportClicked() {
    const payload = {
      query: this.getReportQuery(),
      reportType: this.selectedReportType,
    };

    sendEvent(this.financialReportFilterEvent, FinancialReportFilterEventType.BUILD_REPORT_CLICKED, payload);
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<AccountsChartMasterData[]>
        (AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
      this.helper.select<ReportType<FinancialReportTypeFlags>[]>
        (ReportingStateSelector.REPORT_TYPES_LIST),
    ])
      .subscribe(([x, y]) => {
        this.accountsChartMasterDataList = x;
        this.reportTypeList = y;
        this.setDefaultAccountsChart();
        this.setFilteredReportTypeList();
        this.isLoading = false;
      });
  }


  private setDefaultAccountsChart() {
    this.selectedAccountChart = this.accountsChartMasterDataList.length > 0 ?
      this.accountsChartMasterDataList[0] : EmtyAccountsChartMasterData;
    this.query.accountsChartUID = this.selectedAccountChart.uid;
  }


  private setFilteredReportTypeList() {
    this.filteredReportTypeList = this.reportTypeList.filter(x =>
      x.accountsCharts.includes(this.query.accountsChartUID) &&
      x.group === ReportGroup.ReportesRegulatorios
    );
  }


  private getReportQuery(): FinancialReportQuery {
    const data: FinancialReportQuery = {
      reportType: this.query.reportType,
      accountsChartUID: this.query.accountsChartUID,
    };

    if (this.showField.singleDate) {
      data.toDate = this.query.toDate ?? null;
    }

    if (this.showField.datePeriod) {
      data.fromDate = this.query.fromDate ?? null;
      data.toDate = this.query.toDate ?? null;
    }

    return data;
  }

}
