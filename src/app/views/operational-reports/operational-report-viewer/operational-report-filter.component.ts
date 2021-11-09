/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, EmptyOperationalReportCommand, OperationalReportCommand,
         ReportGroup, ReportType} from '@app/models';

import { AccountChartStateSelector, ReportingtStateSelector } from '@app/presentation/exported.presentation.types';

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

  reportTypeList: ReportType[] = [];

  filteredReportTypeList: ReportType[] = [];

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


  onAccountsChartChanges() {
    this.setFilteredReportTypeList();
    this.operationalReportCommand.reportType = null;
    this.operationalReportCommand.toDate = null;
  }


  onBuildOperationalReportClicked() {
    const reportType = this.reportTypeList.filter(x => x.uid === this.operationalReportCommand.reportType);

    const payload = {
      operationalReportCommand: Object.assign({}, this.operationalReportCommand),
      reportType: reportType.length > 0 ? reportType[0] : null,
    };

    sendEvent(this.operationalReportFilterEvent,
      OperationalReportFilterEventType.BUILD_OPERATIONAL_REPORT_CLICKED, payload);
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<AccountsChartMasterData[]>
        (AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
      this.helper.select<ReportType[]>(ReportingtStateSelector.REPORT_TYPES_LIST),
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
    this.operationalReportCommand.accountsChartUID = this.accountsChartMasterDataList.length > 0 ?
      this.accountsChartMasterDataList[0].uid : '';
  }


  private setFilteredReportTypeList() {
    this.filteredReportTypeList = this.reportTypeList.filter(x =>
      x.accountsCharts.includes(this.operationalReportCommand.accountsChartUID) &&
      x.group === this.reportGroup
    );
  }

}
