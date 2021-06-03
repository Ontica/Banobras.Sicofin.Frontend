/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, BalancesType, EmptyTrialBalanceCommand, getLevelsListFromPattern,
         TrialBalanceCommand, TrialBalanceType} from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { expandCollapse } from '@app/shared/animations/animations';

export enum TrialBalanceFilterEventType {
  BUILD_TRIAL_BALANCE_CLICKED = 'TrialBalanceFilterComponent.Event.BuildTrialBalanceClicked',
}

@Component({
  selector: 'emp-fa-trial-balance-filter',
  templateUrl: './trial-balance-filter.component.html',
  animations: [expandCollapse],
})
export class TrialBalanceFilterComponent implements OnInit, OnDestroy {

  @Output() trialBalanceFilterEvent = new EventEmitter<EventInfo>();

  accountChartSelected: AccountsChartMasterData = null;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  trialBalanceCommand: TrialBalanceCommand = Object.assign({}, EmptyTrialBalanceCommand);

  trialBalanceTypeList: Identifiable[] = TrialBalanceType;

  levelsList: Identifiable[] = [];

  balancesTypeList: Identifiable[] = BalancesType;

  isLoading = false;

  showFilters = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadAccountsCharts();
    this.trialBalanceCommand.balancesType = this.balancesTypeList[0].uid;
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onAccountChartChanges(accountChart: AccountsChartMasterData) {
    this.accountChartSelected = accountChart;
    this.setLevelsList();
    this.validateFieldToClear();
  }


  onClearFilters() {
    this.trialBalanceCommand = Object.assign({}, EmptyTrialBalanceCommand, {
        trialBalanceType: this.trialBalanceCommand.trialBalanceType,
        fromDate: this.trialBalanceCommand.fromDate,
        toDate: this.trialBalanceCommand.toDate,
        accountsChartUID: this.trialBalanceCommand.accountsChartUID,
        ledgers: this.trialBalanceCommand.ledgers,
        balancesType: this.balancesTypeList[0].uid,
      });
  }


  onBuildTrialBalanceClicked() {
    const payload = {
      trialBalanceCommand: this.trialBalanceCommand
    };

    this.sendEvent(TrialBalanceFilterEventType.BUILD_TRIAL_BALANCE_CLICKED, payload);
  }


  private loadAccountsCharts() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.setLevelsList();
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
    this.trialBalanceCommand.ledgers = this.accountChartSelected.ledgers
      .filter(x => this.trialBalanceCommand.ledgers.includes(x.uID))
      .map(x => x.uID);

    this.trialBalanceCommand.level =
      this.levelsList.filter(x => this.trialBalanceCommand.level + '' === x.uid).length > 0 ?
      this.trialBalanceCommand.level : null;
  }


  private sendEvent(eventType: TrialBalanceFilterEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.trialBalanceFilterEvent.emit(event);
  }

}
