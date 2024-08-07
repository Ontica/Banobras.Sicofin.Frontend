/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { SubledgerDataService } from '@app/data-services';

import { AccountsChartMasterData, SubledgerAccountQuery } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

export enum SubledgerAccountsFilterEventType {
  SEARCH_SUBLEDGER_ACCOUNTS_CLICKED = 'SubledgerAccountsFilterComponent.Event.SearchSubledgerAccountsClicked',
}

@Component({
  selector: 'emp-fa-subledger-accounts-filter',
  templateUrl: './subledger-accounts-filter.component.html',
})
export class SubledgerAccountsFilterComponent implements OnInit, OnDestroy {

  @Output() subledgerAccountsFilterEvent = new EventEmitter<EventInfo>();

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  subledgerAccountsForm = {
    accountChart: null,
    ledger: null,
    type: null,
    keywords: null,
  };

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private subledgerData: SubledgerDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadAccountsCharts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onAccountChartChanges() {
    this.subledgerAccountsForm.ledger = null;
    this.onLedgerChanges();
  }


  onLedgerChanges() {
    this.subledgerAccountsForm.type = null;
  }


  onClearKeyword() {
    this.subledgerAccountsForm.keywords = '';
  }


  onSearchClicked() {
    const payload = {
      subledgerAccountQuery: this.getSubledgerAccountQuery(),
      accountChartName: this.subledgerAccountsForm.accountChart?.name,
    };

    sendEvent(this.subledgerAccountsFilterEvent,
      SubledgerAccountsFilterEventType.SEARCH_SUBLEDGER_ACCOUNTS_CLICKED, payload);
  }


  private loadAccountsCharts() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.isLoading = false;
      });
  }


  private getSubledgerAccountQuery(): SubledgerAccountQuery {
    const data: SubledgerAccountQuery = {
      accountsChartUID: this.subledgerAccountsForm.accountChart?.uid || '',
      ledgerUID:  this.subledgerAccountsForm.ledger?.uid || '',
      typeUID: this.subledgerAccountsForm.type?.uid || '',
      keywords: this.subledgerAccountsForm.keywords || '',
      lists: [],
    };

    return data;
  }

}
