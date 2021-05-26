/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { AccountsChartDataService } from '@app/data-services';

import { AccountsChartMasterData, AccountsSearchCommand, EmptyAccountsSearchCommand,
         getLevelsListFromPattern } from '@app/models';

import { expandCollapse } from '@app/shared/animations/animations';


export enum AccountsChartFilterEventType {
  SEARCH_ACCOUNTS_CHART_CLICKED = 'AccountsChartFilterComponent.Event.SearchAccountsChartClicked',
}


@Component({
  selector: 'emp-fa-accounts-chart-filter',
  templateUrl: './accounts-chart-filter.component.html',
  animations: [expandCollapse],
})
export class AccountsChartFilterComponent implements OnInit {

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() accountsChartFilterEvent = new EventEmitter<EventInfo>();

  accountChartSelected: AccountsChartMasterData = null;

  accountsSearch: AccountsSearchCommand = Object.assign({}, EmptyAccountsSearchCommand);

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  levelsList: Identifiable[] = [];

  isLoading = false;


  constructor(private accountsChartData: AccountsChartDataService) { }


  ngOnInit(): void {
    this.loadAccountsCharts();
  }


  toggleFilters() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onAccountChartChanges(accountChart: AccountsChartMasterData) {
    this.setLevelsList();
    this.validateFieldToClear();
  }


  onClearFilters() {
    this.accountsSearch = Object.assign({}, EmptyAccountsSearchCommand,
      {keywords: this.accountsSearch.keywords});
  }


  onSearchAccountsChartClicked() {
    const payload: any = {
      accountsChart: this.accountChartSelected,
      accountsSearchCommand: this.accountsSearch
    };

    this.sendEvent(AccountsChartFilterEventType.SEARCH_ACCOUNTS_CHART_CLICKED, payload);
  }


  onClearKeyword() {
    this.accountsSearch.keywords = '';
  }


  private loadAccountsCharts() {
    this.isLoading = true;
    this.accountsChartData.getAccountsChartsMasterData()
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.setDefaultAccountChartSelected();
      })
      .add(() => this.isLoading = false);
  }


  private setLevelsList(){
    if (!this.accountChartSelected) {
      this.levelsList =  [];
    }

    this.levelsList = getLevelsListFromPattern(this.accountChartSelected.accountsPattern,
                                               this.accountChartSelected.accountNumberSeparator,
                                               this.accountChartSelected.maxAccountLevel);
  }


  private validateFieldToClear() {
    this.accountsSearch.ledger = this.accountChartSelected.ledgers
      .filter(x => this.accountsSearch.ledger === x.uID).length > 0 ? this.accountsSearch.ledger : '';

   this.accountsSearch.level =
      this.levelsList.filter(x => this.accountsSearch.level + '' === x.uid).length > 0 ?
      this.accountsSearch.level : null;

    this.accountsSearch.types = this.accountChartSelected.accountTypes
      .filter(x => this.accountsSearch.types.includes(x.uid))
      .map(x => x.uid);

    this.accountsSearch.roles = this.accountChartSelected.accountRoles
      .filter(x => this.accountsSearch.roles.includes(x));

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


  private sendEvent(eventType: AccountsChartFilterEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.accountsChartFilterEvent.emit(event);
  }

}
