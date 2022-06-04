/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { FileReport, FinancialReport, FinancialReportQuery, FinancialReportDesign,
         ReportType } from '@app/models';


@Injectable()
export class FinancialReportsDataService {

  constructor(private http: HttpService) { }


  exportFinancialReport(query: FinancialReportQuery): Observable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/financial-reports/export`;

    return this.http.post<FileReport>(path, query);
  }


  getFinancialReport(query: FinancialReportQuery): Observable<FinancialReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/financial-reports/generate`;

    return this.http.post<FinancialReport>(path, query);
  }


  getFinancialReportBreakdown(financialReportItemUID: string,
                              query: FinancialReportQuery): Observable<FinancialReport> {
    Assertion.assertValue(financialReportItemUID, 'financialReportItemUID');
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/financial-reports/generate/breakdown/${financialReportItemUID}`;

    return this.http.post<FinancialReport>(path, query);
  }

  getFinancialReportTypes(accountsChartUID: string): Observable<ReportType[]> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');

    const path = `v2/financial-accounting/financial-reports/types/${accountsChartUID}`;

    return this.http.get<ReportType[]>(path);
  }

  //
  // Designer
  //

  getFinancialReportTypesForDesign(accountsChartUID: string): Observable<Identifiable[]> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');

    const path = `v2/financial-accounting/financial-reports/design/types/${accountsChartUID}`;

    return this.http.get<Identifiable[]>(path);
  }


  getFinancialReportDesign(financialReportTypeUID: string): Observable<FinancialReportDesign> {
    Assertion.assertValue(financialReportTypeUID, 'financialReportTypeUID');

    const path = `v2/financial-accounting/financial-reports/design/${financialReportTypeUID}`;

    return this.http.get<FinancialReportDesign>(path);
  }

}
