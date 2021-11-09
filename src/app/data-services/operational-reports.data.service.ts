/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { FileReport, OperationalReport, OperationalReportCommand, ReportType } from '@app/models';


@Injectable()
export class OperationalReportsDataService {

  constructor(private http: HttpService) { }


  getReportTypes(): Observable<ReportType[]> {
    const path = `v2/financial-accounting/reporting/report-types`;

    return this.http.get<ReportType[]>(path);
  }


  exportOperationalReport(command: OperationalReportCommand): Observable<FileReport> {
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/reporting/${command.reportType}/export`;

    return this.http.post<FileReport>(path, command);
  }


  getOperationalReport(command: OperationalReportCommand): Observable<OperationalReport> {
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/reporting/${command.reportType}/data`;

    return this.http.post<OperationalReport>(path, command);
  }

}
