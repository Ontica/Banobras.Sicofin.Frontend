/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { ExcelFile, GroupingRule, GroupingRuleItem } from '@app/models';


@Injectable()
export class RulesDataService {

  constructor(private http: HttpService) { }


  exportGroupingRulesToExcel(rulesSetUID: string): Observable<ExcelFile> {
    Assertion.assertValue(rulesSetUID, 'rulesSetUID');

    const path = `v2/financial-accounting/rules/grouping-rules/${rulesSetUID}/excel`;

    return this.http.get<ExcelFile>(path);
  }


  getRulesSets(accountsChartUID: string): Observable<Identifiable[]> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');

    const path = `v2/financial-accounting/rules/rules-sets-for/${accountsChartUID}/grouping-rules`;

    return this.http.get<Identifiable[]>(path);
  }


  getGroupingRules(rulesSetUID: string): Observable<GroupingRule[]> {
    Assertion.assertValue(rulesSetUID, 'rulesSetUID');

    const path = `v2/financial-accounting/rules/grouping-rules/${rulesSetUID}`;

    return this.http.get<GroupingRule[]>(path);
  }


  getGroupingRuleItems(groupingRuleUID: string): Observable<GroupingRuleItem[]> {
    Assertion.assertValue(groupingRuleUID, 'groupingRuleUID');

    const path = `v2/financial-accounting/rules/grouping-rule-items/${groupingRuleUID}`;

    return this.http.get<GroupingRuleItem[]>(path);
  }

}
