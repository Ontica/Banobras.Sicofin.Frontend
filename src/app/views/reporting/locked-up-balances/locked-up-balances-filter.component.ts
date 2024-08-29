/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { sendEvent } from '@app/shared/utils';

import { AccountsChartMasterData, EmptyLockedUpBalancesQuery, LockedUpBalancesQuery } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

export enum LockedUpBalancesFilterEventType {
  SEARCH_BUTTON_CLICKED = 'LockedUpBalancesFilterComponent.Event.SearchButtonClicked',
}

@Component({
  selector: 'emp-fa-locked-up-balances-filter',
  templateUrl: './locked-up-balances-filter.component.html',
})
export class LockedUpBalancesFilterComponent implements OnInit, OnDestroy {

  @Output() lockedUpBalancesFilterEvent = new EventEmitter<EventInfo>();

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  query: LockedUpBalancesQuery = Object.assign({}, EmptyLockedUpBalancesQuery);

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


  get periodValid() {
    return !!this.query.fromDate && !!this.query.toDate;
  }


  onBuildOperationalReportClicked() {
    const payload = {
      query: this.getLockedUpBalancesQuery(),
    };

    sendEvent(this.lockedUpBalancesFilterEvent,
      LockedUpBalancesFilterEventType.SEARCH_BUTTON_CLICKED, payload);
  }


  private loadAccountsCharts() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.setAccountsChartMasterData(x);
        this.isLoading = false;
      });
  }


  private setAccountsChartMasterData(data: AccountsChartMasterData[]) {
    this.accountsChartMasterDataList = data;
    const accountsChartDefault = this.accountsChartMasterDataList.length > 0 ?
      this.accountsChartMasterDataList[0] : null;
    this.query.accountsChartUID = accountsChartDefault?.uid ?? '';
  }


  private getLockedUpBalancesQuery(): LockedUpBalancesQuery {
    const data: LockedUpBalancesQuery = {
      accountsChartUID: this.query.accountsChartUID,
      fromDate: this.query.fromDate ?? '',
      toDate: this.query.toDate,
    };

    return data;
  }

}
