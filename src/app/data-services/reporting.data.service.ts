/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { FileReport, FinancialReport, FinancialReportQuery, FinancialReportTypeFlags, LockedUpBalancesData,
         LockedUpBalancesQuery, ReportData, ReportQuery, ReportType, ReportTypeFlags } from '@app/models';


@Injectable()
export class ReportingDataService {

  constructor(private http: HttpService) { }


  getReportTypes(): Observable<ReportType<ReportTypeFlags>[]> {
    const path = `v2/financial-accounting/reporting/report-types`;

    return this.http.get<ReportType<ReportTypeFlags>[]>(path);
  }


  exportReportData(query: ReportQuery): Observable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/reporting/${query.reportType}/export`;

    return this.http.post<FileReport>(path, query);
  }


  getReportData(query: ReportQuery): Observable<ReportData> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/reporting/${query.reportType}/data`;

    return this.http.post<ReportData>(path, query);
  }


  getLockedUpBalances(query: LockedUpBalancesQuery): Observable<LockedUpBalancesData> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/locked-up-balances`;

    return this.http.post<LockedUpBalancesData>(path, query);
  }


  //
  // Tmp: Financial Report
  //

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

}
