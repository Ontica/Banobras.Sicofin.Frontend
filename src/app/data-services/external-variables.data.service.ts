/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { ExternalValuesData, ExternalValuesImportDatasetCommand, ExternalValuesDatasetsQuery,
         ExternalValuesQuery, ExternalVariableSet, FileReport, ImportDatasets, ExternalVariable,
         ExternalVariableFields } from '@app/models';


@Injectable()
export class ExternalVariablesDataService {

  constructor(private http: HttpService) { }


  getExternalVariablesSets(): Observable<ExternalVariableSet[]> {
    const path = `v2/financial-accounting/financial-concepts/external-variables-sets`;

    return this.http.get<ExternalVariableSet[]>(path);
  }


  getExternalVariables(setUID: string): Observable<ExternalVariable[]> {
    const path = `v2/financial-accounting/financial-concepts/external-variables-sets/${setUID}/variables`;

    return this.http.get<ExternalVariable[]>(path);
  }


  addExternalVariable(setUID: string, fields: ExternalVariableFields): Observable<ExternalVariable> {
    Assertion.assertValue(setUID, 'setUID');
    Assertion.assertValue(fields, 'fields');

    const path = `v2/financial-accounting/financial-concepts/external-variables-sets/${setUID}/variables`;

    return this.http.post<ExternalVariable>(path, fields);
  }


  updateExternalVariable(setUID: string,
                         variableUID: string,
                         fields: ExternalVariableFields): Observable<ExternalVariable> {
    Assertion.assertValue(setUID, 'setUID');
    Assertion.assertValue(variableUID, 'variableUID');
    Assertion.assertValue(fields, 'fields');

    const path = `v2/financial-accounting/financial-concepts/external-variables-sets/` +
      `${setUID}/variables/${variableUID}`;

    return this.http.put<ExternalVariable>(path, fields);
  }


  removeExternalVariable(setUID: string, variableUID: string): Observable<void> {
    Assertion.assertValue(setUID, 'setUID');
    Assertion.assertValue(variableUID, 'variableUID');

    const path = `v2/financial-accounting/financial-concepts/external-variables-sets/` +
      `${setUID}/variables/${variableUID}`;

    return this.http.delete<void>(path);
  }


  getExternalValues(query: ExternalValuesQuery): Observable<ExternalValuesData> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/financial-concepts/external-values`;

    return this.http.post<ExternalValuesData>(path, query);
  }


  exportExternalValues(query: ExternalValuesQuery): Observable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/financial-concepts/external-values/export`;

    return this.http.post<FileReport>(path, query);
  }


  getExternalValuesDatasets(query: ExternalValuesDatasetsQuery): Observable<ImportDatasets> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/financial-concepts/external-values/datasets`;

    return this.http.post<ImportDatasets>(path, query);
  }


  importExternalValuesDatasetFromFile(file: File, command: ExternalValuesImportDatasetCommand)
    : Observable<ImportDatasets> {
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(command, 'command');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('command', JSON.stringify(command));

    const path = `v2/financial-accounting/financial-concepts/external-values/import-from-file`;

    return this.http.post<ImportDatasets>(path, formData);
  }


  deleteExternalValuesDataset(datasetUID: string): Observable<ImportDatasets> {
    Assertion.assertValue(datasetUID, 'datasetUID');

    const path = `v2/financial-accounting/financial-concepts/external-values/datasets/${datasetUID}`;

    return this.http.delete<ImportDatasets>(path);
  }

}
