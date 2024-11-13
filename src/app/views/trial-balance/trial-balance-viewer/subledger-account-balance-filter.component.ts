/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { DateStringLibrary, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, FileReportVersion, SubledgerAccount, EmptySubledgerAccount,
         SubledgerAccountBalanceType, BalanceExplorerQuery, BalanceExplorerTypes } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

export enum SubledgerAccountBalanceFilterEventType {
  BUILD_BALANCE_CLICKED = 'SubledgerAccountBalanceFilterComponent.Event.BuildBalanceClicked',
  CLEAR_BALANCE_CLICKED = 'SubledgerAccountBalanceFilterComponent.Event.ClearBalanceClicked',
}

@Component({
  selector: 'emp-fa-subledger-account-balance-filter',
  templateUrl: './subledger-account-balance-filter.component.html',
})
export class SubledgerAccountBalanceFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() subledgerAccount: SubledgerAccount = EmptySubledgerAccount;

  @Output() subledgerAccountBalanceFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    accountsChartUID: '',
    ledgers: [],
    toDate: null,
    withAllAccounts: false,
  };

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  isLoadingAccountsCharts = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.setDefaultFormData();
  }


  ngOnInit() {
    this.loadAccountsCharts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get accountChartSelected(): AccountsChartMasterData {
    return !this.formData.accountsChartUID ? null :
      this.accountsChartMasterDataList.find(x => x.uid === this.formData.accountsChartUID);
  }


  onAccountChartChanges() {
    this.validateLedgersToClear();
  }


  onBuildBalanceClicked() {
    const payload = {
      reportType: SubledgerAccountBalanceType,
      query: this.getSubledgerAccountBalanceQuery(),
    };

    sendEvent(this.subledgerAccountBalanceFilterEvent,
      SubledgerAccountBalanceFilterEventType.BUILD_BALANCE_CLICKED, payload);
  }


  private loadAccountsCharts() {
    this.isLoadingAccountsCharts = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x ?? [];
        this.setDefaultAccountsChart();
        this.isLoadingAccountsCharts = false;
      });
  }


  private setDefaultAccountsChart() {
    const defaultAccountChart = this.accountsChartMasterDataList.length > 0 ?
      this.accountsChartMasterDataList[0] : null;

    this.formData.accountsChartUID = !!this.subledgerAccount.accountsChartUID ?
      this.subledgerAccount.accountsChartUID : defaultAccountChart.uid;
  }


  private setDefaultFormData() {
    this.formData.toDate = DateStringLibrary.today();
    this.formData.ledgers = [];
    this.formData.withAllAccounts = false;
  }


  private validateLedgersToClear() {
    this.formData.ledgers = this.accountChartSelected.ledgers
      .filter(x => this.formData.ledgers.includes(x.uid))
      .map(x => x.uid);
  }


  private getSubledgerAccountBalanceQuery(): BalanceExplorerQuery {
    const query: BalanceExplorerQuery = {
      trialBalanceType: SubledgerAccountBalanceType.uid as BalanceExplorerTypes,
      subledgerAccountID: this.subledgerAccount.id,
      accountsChartUID: this.formData.accountsChartUID,
      ledgers: this.formData.ledgers,
      initialPeriod: {
        fromDate: DateStringLibrary.getFirstDayOfMonthFromDateString(this.formData.toDate),
        toDate: this.formData.toDate,
      },
      withAllAccounts: this.formData.withAllAccounts,
      exportTo: FileReportVersion.V2,
    };

    return query;
  }

}
