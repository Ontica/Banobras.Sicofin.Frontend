/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, EmptyOperationalReportCommand, OperationalReportCommand,
         OperationalReportTypeList } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';


export enum OperationalReportFilterEventType {
  BUILD_OPERATIONAL_REPORT_CLICKED = 'OperationalReportFilterComponent.Event.BuildOperationalReportClicked',
}

@Component({
  selector: 'emp-fa-operational-report-filter',
  templateUrl: './operational-report-filter.component.html',
})
export class OperationalReportFilterComponent implements OnInit, OnDestroy {

  @Output() operationalReportFilterEvent = new EventEmitter<EventInfo>();

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  operationalReportCommand: OperationalReportCommand = Object.assign({}, EmptyOperationalReportCommand);

  operationalReportTypeList: Identifiable[] = OperationalReportTypeList;

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadAccountsCharts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onAccountsChartChanges() {
    this.operationalReportCommand.reportType = null;
    this.operationalReportCommand.toDate = null;
  }


  onBuildOperationalReportClicked() {
    const operationalReportTypeName = this.operationalReportTypeList
      .filter(x => x.uid === this.operationalReportCommand.reportType);

    const payload = {
      operationalReportCommand: Object.assign({}, this.operationalReportCommand),
      operationalReportTypeName: operationalReportTypeName ? operationalReportTypeName[0].name : '',
    };

    sendEvent(this.operationalReportFilterEvent,
      OperationalReportFilterEventType.BUILD_OPERATIONAL_REPORT_CLICKED, payload);
  }


  private loadAccountsCharts() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.isLoading = false;
      });
  }

}
