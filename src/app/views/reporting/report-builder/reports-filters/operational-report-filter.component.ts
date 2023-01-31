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
  BUILD_REPORT_CLICKED = 'OperationalReportFilterComponent.Event.BuildReportClicked',
}

@Component({
  selector: 'emp-fa-operational-report-filter',
  templateUrl: './operational-report-filter.component.html',
})
export class OperationalReportFilterComponent implements OnInit, OnDestroy {

  @Input() reportGroup: ReportGroup;

  @Output() operationalReportFilterEvent = new EventEmitter<EventInfo>();

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  query: OperationalReportQuery = Object.assign({}, EmptyOperationalReportQuery);

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
      return !!this.query.fromDate && !!this.query.toDate;
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

    this.query.reportType = reportType?.uid ?? null;
    this.query.toDate = null;
    this.query.fromDate = null;
    this.query.ledgers = [];
    this.query.accountNumber = null;
    this.query.withSubledgerAccount = false;
  }


  onBuildOperationalReportClicked() {
    const payload = {
      query: this.getOperationalReportQuery(),
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
      this.setDefaultAccountsChartUID();
      this.setFilteredReportTypeList();
      this.isLoading = false;
    });
  }


  private setDefaultAccountsChartUID() {
    this.selectedAccountChart = this.accountsChartMasterDataList.length > 0 ?
      this.accountsChartMasterDataList[0] : null;
    this.query.accountsChartUID = this.selectedAccountChart?.uid;
  }


  private setFilteredReportTypeList() {
    this.filteredReportTypeList = this.reportTypeList.filter(x =>
      x.accountsCharts.includes(this.query.accountsChartUID) &&
      x.group === this.reportGroup
    );
  }


  private getOperationalReportQuery(): OperationalReportQuery {
    const data: OperationalReportQuery = {
      reportType: this.query.reportType,
      accountsChartUID: this.query.accountsChartUID,
      toDate: this.query.toDate,
    };

    this.validateQueryFields(data);

    return data;
  }


  private validateQueryFields(data: OperationalReportQuery) {
    if (this.showField.ledgers) {
      data.ledgers = this.query.ledgers ?? [];
    }

    if (this.showField.datePeriod) {
      data.fromDate = this.query.fromDate ?? '';
    }

    if (this.showField.sendType) {
      data.sendType = this.query.sendType ?? null;
    }

    if (this.showField.account) {
      data.accountNumber = this.query.accountNumber ?? null;
    }

    if (this.showField.withSubledgerAccount) {
      data.withSubledgerAccount = this.query.withSubledgerAccount;
    }

    if (this.showField.outputType) {
      data.outputType = this.query.outputType;
    }
  }

}
