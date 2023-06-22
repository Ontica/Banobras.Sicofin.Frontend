/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, DateString, EmpObservable, HttpService } from '@app/core';

import { FinancialReportCell, FinancialReportDesign, FinancialReportEditionCommand, FinancialReportRow,
         FinancialReportTypesForDesign } from '@app/models';


@Injectable()
export class FinancialReportsEditionDataService {

  constructor(private http: HttpService) { }


  getFinancialReportTypesForDesign(accountsChartUID: string): EmpObservable<FinancialReportTypesForDesign[]> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');

    const path = `v2/financial-accounting/financial-reports/design/types/${accountsChartUID}`;

    return this.http.get<FinancialReportTypesForDesign[]>(path);
  }


  getFinancialReportDesign(reportTypeUID: string, date: DateString): EmpObservable<FinancialReportDesign> {
    Assertion.assertValue(reportTypeUID, 'reportTypeUID');

    const path = `v2/financial-accounting/financial-reports/design/${reportTypeUID}/?date=${date}`;

    return this.http.get<FinancialReportDesign>(path);
  }


  insertRow(financialReportTypeUID: string,
            command: FinancialReportEditionCommand): EmpObservable<FinancialReportRow> {
    Assertion.assertValue(financialReportTypeUID, 'financialReportTypeUID');
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/financial-reports/design/${financialReportTypeUID}/rows`;

    return this.http.post<FinancialReportRow>(path, command);
  }


  updateRow(financialReportTypeUID: string,
            rowUID: string,
            command: FinancialReportEditionCommand): EmpObservable<FinancialReportRow> {
    Assertion.assertValue(financialReportTypeUID, 'financialReportTypeUID');
    Assertion.assertValue(rowUID, 'rowUID');
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/financial-reports/design/${financialReportTypeUID}/rows/${rowUID}`;

    return this.http.put<FinancialReportRow>(path, command);
  }


  deleteRow(financialReportTypeUID: string,
            rowUID: string): EmpObservable<void> {
    Assertion.assertValue(financialReportTypeUID, 'financialReportTypeUID');
    Assertion.assertValue(rowUID, 'rowUID');

    const path = `v2/financial-accounting/financial-reports/design/${financialReportTypeUID}/rows/${rowUID}`;

    return this.http.delete<void>(path);
  }


  insertCell(financialReportTypeUID: string,
             command: FinancialReportEditionCommand): EmpObservable<FinancialReportCell> {
    Assertion.assertValue(financialReportTypeUID, 'financialReportTypeUID');
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/financial-reports/design/${financialReportTypeUID}/cells`;

    return this.http.post<FinancialReportCell>(path, command);
  }


  updateCell(financialReportTypeUID: string,
             cellUID: string,
             command: FinancialReportEditionCommand): EmpObservable<FinancialReportCell> {
    Assertion.assertValue(financialReportTypeUID, 'financialReportTypeUID');
    Assertion.assertValue(cellUID, 'cellUID');
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/financial-reports/design/${financialReportTypeUID}/cells/${cellUID}`;

    return this.http.put<FinancialReportCell>(path, command);
  }


  deleteCell(financialReportTypeUID: string,
             cellUID: string): EmpObservable<void> {
    Assertion.assertValue(financialReportTypeUID, 'financialReportTypeUID');
    Assertion.assertValue(cellUID, 'cellUID');

    const path = `v2/financial-accounting/financial-reports/design/${financialReportTypeUID}/cells/${cellUID}`;

    return this.http.delete<void>(path);
  }

}
