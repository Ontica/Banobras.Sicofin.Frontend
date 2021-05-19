/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { AccountsChartDataService } from '@app/data-services/accounts-chart.data.service';

import { AccountsChartMasterData, AccountsSearchCommand, EmptyAccountsSearchCommand } from '@app/models';

import { expandCollapse } from '@app/shared/animations/animations';


export enum RecordingBookSelectorEventType {
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

  levelsList: any[] = [];

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
    this.accountsSearch = Object.assign({}, EmptyAccountsSearchCommand,
      {keywords: this.accountsSearch.keywords});
  }


  onSearchAccountsChartClicked() {
    const payload: any = {
      accountsChart: this.accountChartSelected,
      accountsSearchCommand: this.accountsSearch
    };

    this.sendEvent(RecordingBookSelectorEventType.SEARCH_ACCOUNTS_CHART_CLICKED, payload);
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


  private setDefaultAccountChartSelected() {
    this.accountChartSelected = this.accountsChartMasterDataList[this.accountsChartMasterDataList.length - 1];
    this.setLevelsList();
  }


  private setLevelsList() {
    if (!this.accountChartSelected) {
      this.levelsList = [];
      return;
    }

    this.levelsList = Array.from({length: this.accountChartSelected.maxAccountLevel}, (value, key) => key + 1)
                        .map(level => ({
                          uid: level,
                          name: `Nivel ${level}: ${this.getAccountPatternFromLevel(level)}`,
                        }));
  }


  private getAccountPatternFromLevel(level: number){
    return this.accountChartSelected.accountsPattern
      .split(this.accountChartSelected.accountNumberSeparator, level)
      .join(this.accountChartSelected.accountNumberSeparator);
  }


  private sendEvent(eventType: RecordingBookSelectorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.accountsChartFilterEvent.emit(event);
  }

}
