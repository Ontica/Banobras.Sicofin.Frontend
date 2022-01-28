/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { FileReport, FinancialReport, FinancialReportCommand, FinancialReportDesign,
         ReportType } from '@app/models';


@Injectable()
export class FinancialReportsDataService {

  constructor(private http: HttpService) { }


  exportFinancialReport(command: FinancialReportCommand): Observable<FileReport> {
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/financial-reports/export`;

    return this.http.post<FileReport>(path, command);
  }


  getFinancialReport(command: FinancialReportCommand): Observable<FinancialReport> {
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/financial-reports/generate`;

    return this.http.post<FinancialReport>(path, command);
  }


  getFinancialReportBreakdown(financialReportItemUID: string,
                              command: FinancialReportCommand): Observable<FinancialReport> {
    Assertion.assertValue(financialReportItemUID, 'financialReportItemUID');
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/financial-reports/generate/breakdown/${financialReportItemUID}`;

    return this.http.post<FinancialReport>(path, command);
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
