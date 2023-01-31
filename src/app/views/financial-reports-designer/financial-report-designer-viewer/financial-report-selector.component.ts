/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FinancialReportsEditionDataService } from '@app/data-services';

import { AccountsChartMasterData, FinancialReportDesignQuery,
         FinancialReportTypesForDesign } from '@app/models';

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
    date: '',
    // outputType: null,
  };

  financialReportTypesList: FinancialReportTypesForDesign[] = [];

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private financialReportsEditionData: FinancialReportsEditionDataService) {
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
      query: this.getFinancialReportDesignQuery(),
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

    this.financialReportsEditionData.getFinancialReportTypesForDesign(accountChartUID)
      .toPromise()
      .then(x => this.financialReportTypesList = x )
      .finally(() => this.isLoading = false);
  }


  private getFinancialReportDesignQuery(): FinancialReportDesignQuery {
    const query: FinancialReportDesignQuery = {
      accountChartUID: this.reportsForm.accountChartUID,
      financialReportTypeUID: this.reportsForm.financialReportType.uid,
      date: this.reportsForm.date,
      // outputType: this.reportsForm.outputType.uid,
    };

    return query;
  }

}
