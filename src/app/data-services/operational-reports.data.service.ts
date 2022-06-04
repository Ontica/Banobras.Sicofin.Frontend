/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { FileReport, OperationalReport, OperationalReportQuery, ReportType } from '@app/models';


@Injectable()
export class OperationalReportsDataService {

  constructor(private http: HttpService) { }


  getReportTypes(): Observable<ReportType[]> {
    const path = `v2/financial-accounting/reporting/report-types`;

    return this.http.get<ReportType[]>(path);
  }


  exportOperationalReport(query: OperationalReportQuery): Observable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/reporting/${query.reportType}/export`;

    return this.http.post<FileReport>(path, query);
  }


  getOperationalReport(query: OperationalReportQuery): Observable<OperationalReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/reporting/${query.reportType}/data`;

    return this.http.post<OperationalReport>(path, query);
  }

}
