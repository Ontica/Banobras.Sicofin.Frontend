/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, EmptyOperationalReportQuery, EmptyOperationalReportTypeFlags,
         OperationalReportQuery, OperationalReportTypeFlags, ReportGroup, ReportType,
         SendTypesList } from '@app/models';

import { AccountChartStateSelector,
         ReportingStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

import { combineLatest } from 'rxjs';


export enum OperationalReportFilterEventType {
  BUILD_OPERATIONAL_REPORT_CLICKED = 'OperationalReportFilterComponent.Event.BuildOperationalReportClicked',
}

@Component({
  selector: 'emp-fa-operational-report-filter',
  templateUrl: './operational-report-filter.component.html',
})
export class OperationalReportFilterComponent implements OnInit, OnDestroy {

  @Input() reportGroup: ReportGroup;

  @Output() operationalReportFilterEvent = new EventEmitter<EventInfo>();

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  operationalReportQuery: OperationalReportQuery = Object.assign({}, EmptyOperationalReportQuery);

  selectedAccountChart = null;

  selectedReportType: ReportType<OperationalReportTypeFlags> = null;

  reportTypeList: ReportType<OperationalReportTypeFlags>[] = [];

  filteredReportTypeList: ReportType<OperationalReportTypeFlags>[] = [];

  sendTypesList: Identifiable[] = SendTypesList;

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get showField(): OperationalReportTypeFlags  {
    return this.selectedReportType?.show ?? EmptyOperationalReportTypeFlags;
  }


  get periodValid() {
    if (this.showField.datePeriod) {
      return !!this.operationalReportQuery.fromDate && !!this.operationalReportQuery.toDate;
    }

    return true;
  }


  onAccountsChartChanges(accountChart: AccountsChartMasterData) {
    this.selectedAccountChart = accountChart;
    this.setFilteredReportTypeList();
    this.onReportTypeChanges(null);
  }


  onReportTypeChanges(reportType: ReportType<OperationalReportTypeFlags>) {
    this.selectedReportType = reportType ?? null;

    this.operationalReportQuery.reportType = reportType?.uid ?? null;
    this.operationalReportQuery.toDate = null;
    this.operationalReportQuery.fromDate = null;
    this.operationalReportQuery.ledgers = [];
    this.operationalReportQuery.accountNumber = null;
    this.operationalReportQuery.withSubledgerAccount = false;
  }


  onBuildOperationalReportClicked() {
    const payload = {
      operationalReportQuery: this.getOperationalReportQuery(),
      reportType: this.selectedReportType,
    };

    sendEvent(this.operationalReportFilterEvent,
      OperationalReportFilterEventType.BUILD_OPERATIONAL_REPORT_CLICKED, payload);
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
      this.setDefaultAccountsChartUID();
      this.setFilteredReportTypeList();
      this.isLoading = false;
    });
  }


  private setDefaultAccountsChartUID() {
    this.selectedAccountChart = this.accountsChartMasterDataList.length > 0 ?
      this.accountsChartMasterDataList[0] : null;
    this.operationalReportQuery.accountsChartUID = this.selectedAccountChart?.uid;
  }


  private setFilteredReportTypeList() {
    this.filteredReportTypeList = this.reportTypeList.filter(x =>
      x.accountsCharts.includes(this.operationalReportQuery.accountsChartUID) &&
      x.group === this.reportGroup
    );
  }


  private getOperationalReportQuery(): OperationalReportQuery {
    const data: OperationalReportQuery = {
      reportType: this.operationalReportQuery.reportType,
      accountsChartUID: this.operationalReportQuery.accountsChartUID,
      toDate: this.operationalReportQuery.toDate,
    };

    this.validateQueryFields(data);

    return data;
  }


  private validateQueryFields(data: OperationalReportQuery) {
    if (this.showField.ledgers) {
      data.ledgers = this.operationalReportQuery.ledgers ?? [];
    }

    if (this.showField.datePeriod) {
      data.fromDate = this.operationalReportQuery.fromDate ?? '';
    }

    if (this.showField.sendType) {
      data.sendType = this.operationalReportQuery.sendType ?? null;
    }

    if (this.showField.account) {
      data.accountNumber = this.operationalReportQuery.accountNumber ?? null;
    }

    if (this.showField.withSubledgerAccount) {
      data.withSubledgerAccount = this.operationalReportQuery.withSubledgerAccount;
    }
  }

}
