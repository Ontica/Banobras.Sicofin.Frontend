/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { combineLatest } from 'rxjs';

import { EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountChartStateSelector,
         FinancialConceptsStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

import { AccountsChartMasterData, FinancialConceptCommand, FinancialConceptsGroup } from '@app/models';


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

  groupsList: FinancialConceptsGroup[] = [];

  filteredGroupsList: FinancialConceptsGroup[] = [];

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


  onAccountsChartChanges(accountChart: AccountsChartMasterData) {
    this.financialConceptsForm.financialConceptsGroup = '';
    this.filteredGroupsList = [];
    if (accountChart.uid) {
      this.filterFinancialConceptsGroups(accountChart.uid);
    }
  }


  onSearchFinancialConceptsClicked() {
    const payload = {
      financialConceptCommand: this.getFinancialConceptCommand(),
      financialConceptsGroupsName: this.financialConceptsForm.financialConceptsGroup.name,
    };

    sendEvent(this.financialConceptsFilterEvent,
      FinancialConceptsFilterEventType.SEARCH_FINANCIAL_CONCEPTS_CLICKED, payload);
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<AccountsChartMasterData[]>
        (AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
      this.helper.select<FinancialConceptsGroup[]>
        (FinancialConceptsStateSelector.FINANCIAL_CONCEPTS_GROUPS_LIST),
    ])
    .subscribe(([x, y]) => {
      this.accountsChartMasterDataList = x;
      this.groupsList = y;
      this.setInitialData();
      this.isLoading = false;
    });
  }


  private setInitialData() {
    if (this.accountsChartMasterDataList.length > 0) {
      this.financialConceptsForm.accountChart = this.accountsChartMasterDataList[0];

      if (this.groupsList.length > 0) {
        this.filterFinancialConceptsGroups(this.financialConceptsForm.accountChart.uid);
      }
    }
  }


  private filterFinancialConceptsGroups(accountChartUID: string) {
    this.filteredGroupsList = this.groupsList.filter(x => x.accountsChart.uid === accountChartUID);
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
