/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { ExcelFile, FinancialReport, FinancialReportCommand } from '@app/models';


@Injectable()
export class FinancialReportsDataService {

  constructor(private http: HttpService) { }


  exportFinancialReportToExcel(financialReportCommand: FinancialReportCommand): Observable<ExcelFile> {
    Assertion.assertValue(financialReportCommand, 'financialReportCommand');

    const path = `v2/financial-accounting/financial-reports/excel`;

    return this.http.post<ExcelFile>(path, financialReportCommand);
  }


  getFinancialReport(financialReportCommand: FinancialReportCommand): Observable<FinancialReport> {
    Assertion.assertValue(financialReportCommand, 'financialReportCommand');

    const path = `v2/financial-accounting/financial-reports`;

    return this.http.post<FinancialReport>(path, financialReportCommand);
  }


  getFinancialReportBreakdown(financialReportUID: string,
                              financialReportCommand: FinancialReportCommand): Observable<FinancialReport> {
    Assertion.assertValue(financialReportUID, 'financialReportUID');
    Assertion.assertValue(financialReportCommand, 'financialReportCommand');

    const path = `v2/financial-accounting/financial-reports/breakdown/${financialReportUID}`;

    return this.http.post<FinancialReport>(path, financialReportCommand);
  }

}
