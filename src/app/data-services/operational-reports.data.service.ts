/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { OperationalReport, OperationalReportCommand } from '@app/models';


@Injectable()
export class OperationalReportsDataService {

  constructor(private http: HttpService) { }


  getOperationalReport(operationalReportCommand: OperationalReportCommand): Observable<OperationalReport> {
    Assertion.assertValue(operationalReportCommand, 'operationalReportCommand');

    const path = `v2/financial-accounting/operational-reports`;

    return this.http.post<OperationalReport>(path, operationalReportCommand);
  }

}
