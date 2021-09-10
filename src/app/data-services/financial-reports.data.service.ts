/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { FinancialReport, FinancialReportCommand } from '@app/models';


@Injectable()
export class FinancialReportsDataService {

  constructor(private http: HttpService) { }


  getFinancialReport(financialReportCommand: FinancialReportCommand): Observable<FinancialReport> {
    Assertion.assertValue(financialReportCommand, 'financialReportCommand');

    const path = `v2/financial-accounting/financial-reports`;

    return this.http.post<FinancialReport>(path, financialReportCommand);
  }

}
