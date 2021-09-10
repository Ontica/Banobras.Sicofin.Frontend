/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { RulesDataService } from '@app/data-services';

import { AccountsChartMasterData, GroupingRuleCommand } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

export enum GroupingRulesFilterEventType {
  SEARCH_GROUPING_RULES_CLICKED = 'GroupingRulesFilterComponent.Event.SearchGroupingRulesClicked',
}

@Component({
  selector: 'emp-fa-grouping-rules-filter',
  templateUrl: './grouping-rules-filter.component.html',
})
export class GroupingRulesFilterComponent implements OnInit, OnDestroy {

  @Output() groupingRulesFilterEvent = new EventEmitter<EventInfo>();

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  groupingRulesForm = {
    accountChart: null,
    rulesSet: null,
    date: '',
  };

  rulesSetList: Identifiable[] = [];

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private rulesData: RulesDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadAccountsCharts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onAccountsChartChanges(accountChart: AccountsChartMasterData) {
    this.groupingRulesForm.rulesSet = '';
    this.rulesSetList = [];
    if (accountChart.uid) {
      this.getRulesSets(accountChart.uid);
    }
  }


  onSearchGroupingRulesClicked() {
    const payload = {
      groupingRuleCommand: this.getGroupingRuleCommand(),
      rulesSetName: this.groupingRulesForm.rulesSet.name,
      accountChartName: this.groupingRulesForm.accountChart.name,
    };

    sendEvent(this.groupingRulesFilterEvent,
      GroupingRulesFilterEventType.SEARCH_GROUPING_RULES_CLICKED, payload);
  }


  private loadAccountsCharts() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.isLoading = false;
      });
  }


  private getRulesSets(accountChartUID) {
    this.isLoading = true;

    this.rulesData.getRulesSets(accountChartUID)
      .toPromise()
      .then(x => this.rulesSetList = x )
      .finally(() => this.isLoading = false);
  }


  private getGroupingRuleCommand(): GroupingRuleCommand {
    const data: GroupingRuleCommand = {
      accountsChartUID: this.groupingRulesForm.accountChart.uid,
      rulesSetUID: this.groupingRulesForm.rulesSet.uid,
      date:  this.groupingRulesForm.date,
    };

    return data;
  }

}
