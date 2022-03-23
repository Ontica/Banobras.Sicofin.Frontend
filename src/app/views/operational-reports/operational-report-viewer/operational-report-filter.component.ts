/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, EmptyOperationalReportCommand, OperationalReportCommand, ReportGroup,
         ReportPayloadType, ReportType, SendTypesList } from '@app/models';

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

  operationalReportCommand: OperationalReportCommand = Object.assign({}, EmptyOperationalReportCommand);

  selectedAccountChart = null;

  selectedReportType: ReportType = null;

  reportTypeList: ReportType[] = [];

  filteredReportTypeList: ReportType[] = [];

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


  get displayDate() {
    return [ReportPayloadType.AccountsChartAndDate,
            ReportPayloadType.DateAndSendType].includes(this.selectedReportType?.payloadType);
  }


  get displayLedgerAndPeriod() {
    return [ReportPayloadType.LedgerAccountWithSubledgerAccountAndPeriod,
            ReportPayloadType.LedgerAndPeriod].includes(this.selectedReportType?.payloadType);
  }

  get displayAccountAndWithSubledgerAccount() {
    return ReportPayloadType.LedgerAccountWithSubledgerAccountAndPeriod ===
           this.selectedReportType?.payloadType;
  }


  get displayDateAndSendType() {
    return this.selectedReportType?.payloadType === ReportPayloadType.DateAndSendType;
  }


  get periodValid() {
    if (this.displayLedgerAndPeriod) {
      return !!this.operationalReportCommand.fromDate && !!this.operationalReportCommand.toDate;
    }

    return true;
  }


  onAccountsChartChanges(accountChart: AccountsChartMasterData) {
    this.selectedAccountChart = accountChart;
    this.setFilteredReportTypeList();
    this.onReportTypeChanges(null);
  }


  onReportTypeChanges(reportType: ReportType) {
    this.selectedReportType = reportType ?? null;

    this.operationalReportCommand.reportType = reportType?.uid ?? null;
    this.operationalReportCommand.toDate = null;
    this.operationalReportCommand.fromDate = null;
    this.operationalReportCommand.ledgers = [];
    this.operationalReportCommand.accountNumber = null;
    this.operationalReportCommand.withSubledgerAccount = false;
  }


  onBuildOperationalReportClicked() {
    const payload = {
      operationalReportCommand: this.getOperationalReportCommandData(),
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
      this.helper.select<ReportType[]>(ReportingStateSelector.REPORT_TYPES_LIST),
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
    this.operationalReportCommand.accountsChartUID = this.selectedAccountChart?.uid;
  }


  private setFilteredReportTypeList() {
    this.filteredReportTypeList = this.reportTypeList.filter(x =>
      x.accountsCharts.includes(this.operationalReportCommand.accountsChartUID) &&
      x.group === this.reportGroup
    );
  }


  private getOperationalReportCommandData(): OperationalReportCommand {
    const data: OperationalReportCommand = {
      reportType: this.operationalReportCommand.reportType,
      accountsChartUID: this.operationalReportCommand.accountsChartUID,
      toDate: this.operationalReportCommand.toDate,
    };

    if (this.displayLedgerAndPeriod) {
      data.ledgers = this.operationalReportCommand.ledgers ?? [];
      data.fromDate = this.operationalReportCommand.fromDate ?? '';
    }

    if (this.displayDateAndSendType) {
      data.sendType = this.operationalReportCommand.sendType ?? null;
    }

    if (this.displayAccountAndWithSubledgerAccount) {
      data.accountNumber = this.operationalReportCommand.accountNumber ?? null;
      data.withSubledgerAccount = this.operationalReportCommand.withSubledgerAccount;
    }

    return data;
  }

}
