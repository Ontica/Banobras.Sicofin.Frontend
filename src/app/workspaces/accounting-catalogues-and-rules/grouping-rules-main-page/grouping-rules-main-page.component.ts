/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { isEmpty } from '@app/core';

import { EmptyGroupingRule, GroupingRule } from '@app/models';

import {
  GroupingRulesViewerEventType
} from '@app/views/grouping-rules/grouping-rules-viewer/grouping-rules-viewer.component';

@Component({
  selector: 'emp-fa-grouping-rules-main-page',
  templateUrl: './grouping-rules-main-page.component.html',
})
export class GroupingRulesMainPageComponent {

  displayGroupingRuleTabbed = false;

  selectedGroupingRule: GroupingRule = EmptyGroupingRule;


  onGroupingRulesViewerEvent(event) {
    switch (event.type as GroupingRulesViewerEventType) {
      case GroupingRulesViewerEventType.GROUPING_RULE_SELECTED:
        this.setSelectedGroupingRule(event.payload.groupingRule as GroupingRule);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseGroupingRuleTabbedView() {
    this.setSelectedGroupingRule(EmptyGroupingRule);
  }


  private setSelectedGroupingRule(groupingRule: GroupingRule) {
    this.selectedGroupingRule = groupingRule;
    this.displayGroupingRuleTabbed = !isEmpty(groupingRule);
  }

}
