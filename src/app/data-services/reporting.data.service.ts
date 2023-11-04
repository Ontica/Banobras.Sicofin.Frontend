/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { FileReport, FinancialReport, FinancialReportQuery, LockedUpBalancesData, LockedUpBalancesQuery,
         ReportData, ReportQuery, ReportType, ReportTypeFlags } from '@app/models';


@Injectable()
export class ReportingDataService {

  constructor(private http: HttpService) { }


  getReportTypes(): EmpObservable<ReportType<ReportTypeFlags>[]> {
    const path = `v2/financial-accounting/reporting/report-types`;

    return this.http.get<ReportType<ReportTypeFlags>[]>(path);
  }

  //
  // Reporting
  //

  getReportData(query: ReportQuery): EmpObservable<ReportData> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/reporting/data`;

    return this.http.post<ReportData>(path, query);
  }


  exportReportData(query: ReportQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/reporting/export`;

    return this.http.post<FileReport>(path, query);
  }

  //
  // Financial Report
  //

  getFinancialReport(query: ReportQuery): EmpObservable<FinancialReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/financial-reports/data`;

    return this.http.post<FinancialReport>(path, query);
  }


  exportFinancialReport(query: ReportQuery): EmpObservable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/financial-reports/export`;

    return this.http.post<FileReport>(path, query);
  }


  getFinancialReportBreakdown(reportItemUID: string,
                              query: FinancialReportQuery): EmpObservable<FinancialReport> {
    Assertion.assertValue(reportItemUID, 'reportItemUID');
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/financial-reports/generate/breakdown/${reportItemUID}`;

    return this.http.post<FinancialReport>(path, query);
  }

  //
  // Locked Up Balances
  //

  getLockedUpBalances(query: LockedUpBalancesQuery): EmpObservable<LockedUpBalancesData> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/locked-up-balances`;

    return this.http.post<LockedUpBalancesData>(path, query);
  }

}
