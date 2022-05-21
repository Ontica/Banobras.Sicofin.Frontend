/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { FileReport, FinancialConcept, ConceptIntegrationEntry } from '@app/models';


@Injectable()
export class FinancialConceptsDataService {

  constructor(private http: HttpService) { }

  getFinancialConceptsGroups(accountsChartUID: string): Observable<Identifiable[]> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');

    const path = `v2/financial-accounting/rules/rules-sets-for/${accountsChartUID}/grouping-rules`;

    return this.http.get<Identifiable[]>(path);
  }


  getFinancialConcepts(financialConceptGroupUID: string): Observable<FinancialConcept[]> {
    Assertion.assertValue(financialConceptGroupUID, 'financialConceptGroupUID');

    const path = `v2/financial-accounting/rules/grouping-rules/${financialConceptGroupUID}`;

    return this.http.get<FinancialConcept[]>(path);
  }


  exportFinancialConceptsToExcel(financialConceptGroupUID: string): Observable<FileReport> {
    Assertion.assertValue(financialConceptGroupUID, 'financialConceptGroupUID');

    const path = `v2/financial-accounting/rules/grouping-rules/${financialConceptGroupUID}/excel`;

    return this.http.get<FileReport>(path);
  }


  getConceptIntegration(financialConceptUID: string): Observable<ConceptIntegrationEntry[]> {
    Assertion.assertValue(financialConceptUID, 'financialConceptUID');

    const path = `v2/financial-accounting/rules/grouping-rule-items/${financialConceptUID}`;

    return this.http.get<ConceptIntegrationEntry[]>(path);
  }

}
