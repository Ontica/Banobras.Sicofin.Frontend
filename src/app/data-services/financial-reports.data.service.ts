/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { FileReport, FinancialReport, FinancialReportCommand, FinancialReportDesign } from '@app/models';


@Injectable()
export class FinancialReportsDataService {

  constructor(private http: HttpService) { }


  exportFinancialReportToExcel(financialReportCommand: FinancialReportCommand): Observable<FileReport> {
    Assertion.assertValue(financialReportCommand, 'financialReportCommand');

    const path = `v2/financial-accounting/financial-reports/generate/excel`;

    return this.http.post<FileReport>(path, financialReportCommand);
  }


  getFinancialReport(financialReportCommand: FinancialReportCommand): Observable<FinancialReport> {
    Assertion.assertValue(financialReportCommand, 'financialReportCommand');

    const path = `v2/financial-accounting/financial-reports/generate`;

    return this.http.post<FinancialReport>(path, financialReportCommand);
  }


  getFinancialReportBreakdown(financialReportUID: string,
                              financialReportCommand: FinancialReportCommand): Observable<FinancialReport> {
    Assertion.assertValue(financialReportUID, 'financialReportUID');
    Assertion.assertValue(financialReportCommand, 'financialReportCommand');

    const path = `v2/financial-accounting/financial-reports/generate/breakdown/${financialReportUID}`;

    return this.http.post<FinancialReport>(path, financialReportCommand);
  }


  getFinancialReportTypes(accountsChartUID: string): Observable<Identifiable[]> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');

    const path = `v2/financial-accounting/financial-reports/types/${accountsChartUID}`;

    return this.http.get<Identifiable[]>(path);
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
