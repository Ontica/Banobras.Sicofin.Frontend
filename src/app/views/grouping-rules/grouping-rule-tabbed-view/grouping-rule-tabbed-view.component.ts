/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { RulesDataService } from '@app/data-services';

import { EmptyGroupingRule, GroupingRule, GroupingRuleItem } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum GroupingRuleTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'GroupingRuleTabbedViewComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-fa-grouping-rule-tabbed-view',
  templateUrl: './grouping-rule-tabbed-view.component.html',
})
export class GroupingRuleTabbedViewComponent implements OnChanges {

  @Input() groupingRule: GroupingRule = EmptyGroupingRule;

  @Output() groupingRuleTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';
  hint = '';
  selectedTabIndex = 0;
  isLoading = false;

  groupingRuleItemList: GroupingRuleItem[] = [];

  constructor(private rulesData: RulesDataService){

  }


  ngOnChanges() {
    this.setTitle();
    this.getGroupingRuleItems();
  }


  onClose() {
    sendEvent(this.groupingRuleTabbedViewEvent, GroupingRuleTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  private setTitle() {
    this.title = `${this.groupingRule.code}: ${this.groupingRule.concept}`;
    this.hint = `${this.groupingRule.accountsChartName} - ${this.groupingRule.rulesSetName}`;
  }


  private getGroupingRuleItems() {
    this.isLoading = true;
    this.groupingRuleItemList = [];

    this.rulesData.getGroupingRuleItems(this.groupingRule.uid)
      .toPromise()
      .then(x => this.groupingRuleItemList = x)
      .finally(() => this.isLoading = false);
  }

}
