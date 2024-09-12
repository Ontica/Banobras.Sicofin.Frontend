/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, AccountsQuery, EmptyAccountsQuery,
         getLevelsListFromPattern } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { empExpandCollapse, sendEvent } from '@app/shared/utils';

export enum AccountsChartFilterEventType {
  SEARCH_ACCOUNTS_CHART_CLICKED = 'AccountsChartFilterComponent.Event.SearchAccountsChartClicked',
  CLEAR_ACCOUNTS_CHART_CLICKED = 'AccountsChartFilterComponent.Event.ClearAccountsChartClicked',
}


@Component({
  selector: 'emp-fa-accounts-chart-filter',
  templateUrl: './accounts-chart-filter.component.html',
  animations: [empExpandCollapse],
})
export class AccountsChartFilterComponent implements OnInit, OnDestroy {

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() accountsChartFilterEvent = new EventEmitter<EventInfo>();

  accountChartSelected: AccountsChartMasterData = null;

  accountsSearch: AccountsQuery = Object.assign({}, EmptyAccountsQuery);

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  levelsList: Identifiable[] = [];

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


  onShowFiltersClicked(){
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onAccountChartChanges(accountChart: AccountsChartMasterData) {
    this.setLevelsList();
    this.validateFieldToClear();
  }


  onClearFilters() {
    this.accountsSearch = Object.assign({}, EmptyAccountsQuery, {
      keywords: this.accountsSearch.keywords
    });

    const payload: any = {
      accountsChart: this.accountChartSelected,
      accountsQuery: Object.assign({}, this.accountsSearch),
    };

    sendEvent(this.accountsChartFilterEvent, AccountsChartFilterEventType.CLEAR_ACCOUNTS_CHART_CLICKED,
      payload);
  }


  onSearchAccountsChartClicked() {
    const payload: any = {
      accountsChart: this.accountChartSelected,
      accountsQuery: Object.assign({}, this.accountsSearch),
    };

    sendEvent(this.accountsChartFilterEvent, AccountsChartFilterEventType.SEARCH_ACCOUNTS_CHART_CLICKED,
      payload);
  }


  onClearKeyword() {
    this.accountsSearch.keywords = '';
  }


  private loadAccountsCharts() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.setDefaultAccountChartSelected();
        this.isLoading = false;
      });
  }


  private setLevelsList(){
    if (!this.accountChartSelected) {
      this.levelsList =  [];
      return;
    }

    this.levelsList = getLevelsListFromPattern(this.accountChartSelected.accountsPattern,
                                               this.accountChartSelected.accountNumberSeparator,
                                               this.accountChartSelected.maxAccountLevel);
  }


  private validateFieldToClear() {
    this.accountsSearch.ledger = this.accountChartSelected.ledgers
      .filter(x => this.accountsSearch.ledger === x.uid).length > 0 ? this.accountsSearch.ledger : '';

    this.accountsSearch.level =
      this.levelsList.filter(x => this.accountsSearch.level + '' === x.uid).length > 0 ?
        this.accountsSearch.level : null;

    this.accountsSearch.types = this.accountChartSelected.accountTypes
      .filter(x => this.accountsSearch.types.includes(x.uid))
      .map(x => x.uid);

    this.accountsSearch.sectors = this.accountChartSelected.sectors
      .filter(x => this.accountsSearch.sectors.includes(x.uid))
      .map(x => x.uid);

    this.accountsSearch.currencies = this.accountChartSelected.currencies
      .filter(x => this.accountsSearch.currencies.includes(x.uid))
      .map(x => x.uid);
  }


  private setDefaultAccountChartSelected() {
    this.accountChartSelected = this.accountsChartMasterDataList[0];
    this.setLevelsList();
  }

}
