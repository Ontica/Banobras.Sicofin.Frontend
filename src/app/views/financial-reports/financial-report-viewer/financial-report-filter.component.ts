/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, EmptyFinancialReportCommand, FinancialReportCommand,
         FinancialReportList } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';


export enum FinancialReportFilterEventType {
  BUILD_FINANCIAL_REPORT_CLICKED = 'FinancialReportFilterComponent.Event.BuildFinancialReportClicked',
}

@Component({
  selector: 'emp-fa-financial-report-filter',
  templateUrl: './financial-report-filter.component.html',
})
export class FinancialReportFilterComponent implements OnInit, OnDestroy {

  @Output() financialReportFilterEvent = new EventEmitter<EventInfo>();

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  financialReportCommand: FinancialReportCommand = Object.assign({}, EmptyFinancialReportCommand);

  financialReportTypeList: Identifiable[] = FinancialReportList;

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


  onBuildFinancialReportClicked() {
    const payload = {
      financialReportCommand: Object.assign({}, this.financialReportCommand),
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

}
