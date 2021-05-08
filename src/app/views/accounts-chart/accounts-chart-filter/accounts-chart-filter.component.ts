/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { AccountsChartDataService } from '@app/data-services/accounts-chart.data.service';

import { AccountsSearchCommand, EmptyAccountsSearchCommand } from '@app/models';

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

  @Output() accountsChartFilterEvent = new EventEmitter<EventInfo>();

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  accountsChart = null;

  accountsSearch: AccountsSearchCommand = Object.assign(EmptyAccountsSearchCommand, { date: new Date() });

  accountsChartList: Identifiable[] = [];

  levelsList: any[] = [];

  accountTypesList: any[] = [];

  rolesList: any[] = [];

  sectorsList: any[] = [];

  currenciesList: any[] = [];

  isLoading = false;


  constructor(private accountsChartData: AccountsChartDataService) { }


  ngOnInit(): void {
    this.loadAccountsCharts();
  }


  toggleFilters() {
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onSearchAccountsChartClicked() {
    const payload: any = {
      accountsChart: this.accountsChart,
      accountsSearchCommand: this.accountsSearch
    };

    this.sendEvent(RecordingBookSelectorEventType.SEARCH_ACCOUNTS_CHART_CLICKED, payload);
  }


  private loadAccountsCharts() {
    this.isLoading = true;
    this.accountsChartData.getAccountsCharts()
      .subscribe(x => {
        this.accountsChartList = x;
      })
      .add(() => this.isLoading = false);
  }


  private sendEvent(eventType: RecordingBookSelectorEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.accountsChartFilterEvent.emit(event);
  }

}
