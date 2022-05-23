/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FinancialConceptsDataService } from '@app/data-services';

import { AccountsChartMasterData, FinancialConceptCommand } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

export enum FinancialConceptsFilterEventType {
  SEARCH_FINANCIAL_CONCEPTS_CLICKED = 'FinancialConceptsFilterComponent.Event.SearchFinancialConceptsClicked',
}

@Component({
  selector: 'emp-fa-financial-concepts-filter',
  templateUrl: './financial-concepts-filter.component.html',
})
export class FinancialConceptsFilterComponent implements OnInit, OnDestroy {

  @Output() financialConceptsFilterEvent = new EventEmitter<EventInfo>();

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  financialConceptsForm = {
    accountChart: null,
    financialConceptsGroup: null,
    date: '',
  };

  financialConceptsGroupsList: Identifiable[] = [];

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private financialConceptsData: FinancialConceptsDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadAccountsCharts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onAccountsChartChanges(accountChart: AccountsChartMasterData) {
    this.financialConceptsForm.financialConceptsGroup = '';
    this.financialConceptsGroupsList = [];
    if (accountChart.uid) {
      this.getFinancialConceptsGroups(accountChart.uid);
    }
  }


  onSearchFinancialConceptsClicked() {
    const payload = {
      financialConceptCommand: this.getFinancialConceptCommand(),
      financialConceptsGroupsName: this.financialConceptsForm.financialConceptsGroup.name,
      accountChartName: this.financialConceptsForm.accountChart.name,
    };

    sendEvent(this.financialConceptsFilterEvent,
      FinancialConceptsFilterEventType.SEARCH_FINANCIAL_CONCEPTS_CLICKED, payload);
  }


  private loadAccountsCharts() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.isLoading = false;
      });
  }


  private getFinancialConceptsGroups(accountChartUID) {
    this.isLoading = true;

    this.financialConceptsData.getFinancialConceptsGroups(accountChartUID)
      .toPromise()
      .then(x => this.financialConceptsGroupsList = x )
      .finally(() => this.isLoading = false);
  }


  private getFinancialConceptCommand(): FinancialConceptCommand {
    const data: FinancialConceptCommand = {
      accountsChartUID: this.financialConceptsForm.accountChart.uid,
      groupUID: this.financialConceptsForm.financialConceptsGroup.uid,
      date:  this.financialConceptsForm.date,
    };

    return data;
  }

}
