/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { DateStringLibrary, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, BalanceTypeList, getEmptyTrialBalanceCommand, TrialBalanceCommand,
         TrialBalanceType} from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

export enum BalanceQuickFilterEventType {
  BUILD_TRIAL_BALANCE_CLICKED = 'BalanceQuickFilterComponent.Event.BuildTrialBalanceClicked',
  CLEAR_TRIAL_BALANCE_CLICKED = 'BalanceQuickFilterComponent.Event.ClearTrialBalanceClicked',
}

@Component({
  selector: 'emp-fa-balance-quick-filter',
  templateUrl: './balance-quick-filter.component.html',
})
export class BalanceQuickFilterComponent implements OnInit, OnDestroy {

  @Output() balanceQuickFilterEvent = new EventEmitter<EventInfo>();

  trialBalanceCommand: TrialBalanceCommand = getEmptyTrialBalanceCommand();

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  trialBalanceTypeList: Identifiable[] = BalanceTypeList;

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.trialBalanceCommand.initialPeriod.fromDate = DateStringLibrary.today();
    this.loadAccountsCharts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get displayFromAccount(): boolean {
    return this.trialBalanceCommand.trialBalanceType === TrialBalanceType.SaldosPorCuenta;
  }


  get displaySubledgerAccount(): boolean {
    return this.trialBalanceCommand.trialBalanceType === TrialBalanceType.SaldosPorAuxiliar;
  }


  get displayWithSubledgerAccount(): boolean {
    return this.trialBalanceCommand.trialBalanceType === TrialBalanceType.SaldosPorCuenta;
  }


  onTrialBalanceTypeChange() {
    this.trialBalanceCommand.fromAccount = '';
    this.trialBalanceCommand.subledgerAccount = '';
    this.trialBalanceCommand.withSubledgerAccount = this.displaySubledgerAccount;
  }


  onBuildTrialBalanceClicked() {
    sendEvent(this.balanceQuickFilterEvent, BalanceQuickFilterEventType.BUILD_TRIAL_BALANCE_CLICKED,
      {trialBalanceCommand: this.getTrialBalanceCommandData()});
  }


  private getTrialBalanceCommandData(): TrialBalanceCommand {
    const data: TrialBalanceCommand = {
      accountsChartUID: this.trialBalanceCommand.accountsChartUID,
      trialBalanceType: this.trialBalanceCommand.trialBalanceType,
      fromAccount: this.trialBalanceCommand.fromAccount,
      subledgerAccount: this.trialBalanceCommand.subledgerAccount,
      initialPeriod: {
        fromDate: this.trialBalanceCommand.initialPeriod.fromDate,
        toDate: this.trialBalanceCommand.initialPeriod.fromDate,
      },
      withSubledgerAccount: this.trialBalanceCommand.withSubledgerAccount,
    };

    return data;
  }


  private loadAccountsCharts() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.isLoading = false;
      });
  }

}
