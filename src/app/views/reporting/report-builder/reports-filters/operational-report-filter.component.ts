/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { combineLatest } from 'rxjs';

import { EventInfo, Identifiable, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountChartStateSelector,
         ReportingStateSelector } from '@app/presentation/exported.presentation.types';

import { AccountsChartMasterData, EmptyOperationalReportQuery, EmptyOperationalReportType,
         EmptyOperationalReportTypeFlags, EmtyAccountsChartMasterData, OperationalReportQuery,
         OperationalReportTypeFlags, ReportGroup, ReportType, SendTypesList } from '@app/models';


export enum OperationalReportFilterEventType {
  BUILD_REPORT_CLICKED = 'OperationalReportFilterComponent.Event.BuildReportClicked',
}

@Component({
  selector: 'emp-fa-operational-report-filter',
  templateUrl: './operational-report-filter.component.html',
})
export class OperationalReportFilterComponent implements OnInit, OnDestroy {

  @Input() reportGroup: ReportGroup;

  @Output() operationalReportFilterEvent = new EventEmitter<EventInfo>();

  query: OperationalReportQuery = Object.assign({}, EmptyOperationalReportQuery);

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  selectedAccountChart: AccountsChartMasterData = EmtyAccountsChartMasterData;

  reportTypeList: ReportType<OperationalReportTypeFlags>[] = [];

  filteredReportTypeList: ReportType<OperationalReportTypeFlags>[] = [];

  selectedReportType: ReportType<OperationalReportTypeFlags> = EmptyOperationalReportType;

  sendTypesList: Identifiable[] = SendTypesList;

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


  get showField(): OperationalReportTypeFlags  {
    return isEmpty(this.selectedReportType) ? EmptyOperationalReportTypeFlags : this.selectedReportType.show;
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
    this.resetLedgers();
  }


  onReportTypeChanges(reportType: ReportType<OperationalReportTypeFlags>) {
    this.selectedReportType = isEmpty(reportType) ? EmptyOperationalReportType: reportType;
    this.query.reportType = this.selectedReportType.uid ?? '';
  }


  onBuildOperationalReportClicked() {
    const payload = {
      query: this.getReportQuery(),
      reportType: this.selectedReportType,
    };

    sendEvent(this.operationalReportFilterEvent,
      OperationalReportFilterEventType.BUILD_REPORT_CLICKED, payload);
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<AccountsChartMasterData[]>
        (AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
      this.helper.select<ReportType<OperationalReportTypeFlags>[]>
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
      x.group === this.reportGroup
    );
  }


  private resetLedgers() {
    this.query.ledgers = [];
  }


  private getReportQuery(): OperationalReportQuery {
    const data: OperationalReportQuery = {
      reportType: this.query.reportType,
      accountsChartUID: this.query.accountsChartUID,
    };

    this.validateReportQueryFields(data);

    return data;
  }


  private validateReportQueryFields(data: OperationalReportQuery) {
    if (this.showField.ledgers) {
      data.ledgers = this.query.ledgers ?? [];
    }

    if (this.showField.singleDate) {
      data.toDate = this.query.toDate ?? null;
    }

    if (this.showField.datePeriod) {
      data.toDate = this.query.toDate ?? null;
      data.fromDate = this.query.fromDate ?? null;
    }

    if (this.showField.sendType) {
      data.sendType = this.query.sendType ?? null;
    }

    if (this.showField.account) {
      data.accountNumber = this.query.accountNumber ?? '';
    }

    if (this.showField.withSubledgerAccount) {
      data.withSubledgerAccount = this.query.withSubledgerAccount;
    }

    if (this.showField.outputType) {
      data.outputType = this.query.outputType;
    }
  }

}
