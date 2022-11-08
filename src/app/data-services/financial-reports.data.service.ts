/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { FileReport, FinancialReport, FinancialReportQuery, FinancialReportDesign, ReportType,
         FinancialReportTypeFlags } from '@app/models';


@Injectable()
export class FinancialReportsDataService {

  constructor(private http: HttpService) { }


  exportFinancialReport(buildQuery: FinancialReportQuery): Observable<FileReport> {
    Assertion.assertValue(buildQuery, 'buildQuery');

    const path = `v2/financial-accounting/financial-reports/export`;

    return this.http.post<FileReport>(path, buildQuery);
  }


  getFinancialReport(buildQuery: FinancialReportQuery): Observable<FinancialReport> {
    Assertion.assertValue(buildQuery, 'buildQuery');

    const path = `v2/financial-accounting/financial-reports/generate`;

    return this.http.post<FinancialReport>(path, buildQuery);
  }


  getFinancialReportBreakdown(financialReportItemUID: string,
                              buildQuery: FinancialReportQuery): Observable<FinancialReport> {
    Assertion.assertValue(financialReportItemUID, 'financialReportItemUID');
    Assertion.assertValue(buildQuery, 'buildQuery');

    const path = `v2/financial-accounting/financial-reports/generate/breakdown/${financialReportItemUID}`;

    return this.http.post<FinancialReport>(path, buildQuery);
  }

  getFinancialReportTypes(accountsChartUID: string): Observable<ReportType<FinancialReportTypeFlags>[]> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');

    const path = `v2/financial-accounting/financial-reports/types/${accountsChartUID}`;

    return this.http.get<ReportType<FinancialReportTypeFlags>[]>(path);
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
