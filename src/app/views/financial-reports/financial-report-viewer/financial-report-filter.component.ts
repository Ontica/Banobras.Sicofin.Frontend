/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FinancialReportsDataService } from '@app/data-services';

import { AccountsChartMasterData, EmptyFinancialReportCommand, FinancialReportCommand } from '@app/models';

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

  financialReportTypeList: Identifiable[] = [];

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


  onAccountsChartChanges(accountChart: AccountsChartMasterData) {
    this.financialReportCommand.financialReportType = '';
    this.financialReportTypeList = [];
    if (accountChart.uid) {
      this.getFinancialReportTypes(accountChart.uid);
    }
  }


  onBuildFinancialReportClicked() {
    const financialReportTypeName = this.financialReportTypeList
      .filter(x => x.uid === this.financialReportCommand.financialReportType);

    const payload = {
      financialReportCommand: Object.assign({}, this.financialReportCommand),
      financialReportTypeName: financialReportTypeName ? financialReportTypeName[0].name : '',
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


  private getFinancialReportTypes(accountChartUID) {
    this.isLoading = true;

    this.financialReportsData.getFinancialReportTypes(accountChartUID)
      .toPromise()
      .then(x => this.financialReportTypeList = x )
      .finally(() => this.isLoading = false);
  }

}
