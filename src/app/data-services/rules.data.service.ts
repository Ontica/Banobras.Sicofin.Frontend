/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { GroupingRule } from '@app/models';


@Injectable()
export class RulesDataService {

  constructor(private http: HttpService) { }


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

}
