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

import { AccountsChartMasterData, FinancialReportTypesForDesign } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

export enum FinancialReportSelectorEventType {
  SEARCH_REPORT_CLICKED = 'FinancialReportSelectorComponent.Event.SearchReportClicked',
}

@Component({
  selector: 'emp-fa-financial-report-selector',
  templateUrl: './financial-report-selector.component.html',
})
export class FinancialReportSelectorComponent implements OnInit, OnDestroy {

  @Output() financialReportSelectorEvent = new EventEmitter<EventInfo>();

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  reportsForm = {
    accountChartUID: null,
    financialReportType: null,
    // outputType: null,
  };

  financialReportTypesList: FinancialReportTypesForDesign[] = [];

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
    this.reportsForm.financialReportType = null;
    this.financialReportTypesList = [];
    if (accountChart.uid) {
      this.getFinancialReportTypesForDesign(accountChart.uid);
    }
  }


  onSearchReportsClicked() {
    const payload = {
      financialReportTypeUID: this.reportsForm.financialReportType.uid,
      // outputTypeUID: this.reportsForm.outputType.uid,
    };

    sendEvent(this.financialReportSelectorEvent,
      FinancialReportSelectorEventType.SEARCH_REPORT_CLICKED, payload);
  }


  private loadAccountsCharts() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.isLoading = false;
      });
  }


  private getFinancialReportTypesForDesign(accountChartUID) {
    this.isLoading = true;

    this.financialReportsData.getFinancialReportTypesForDesign(accountChartUID)
      .toPromise()
      .then(x => this.financialReportTypesList = x )
      .finally(() => this.isLoading = false);
  }

}
