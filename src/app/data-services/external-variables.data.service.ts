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
         ExternalValuesQuery, ExternalVariableSet, FileReport, ImportDatasets } from '@app/models';


@Injectable()
export class ExternalVariablesDataService {

  constructor(private http: HttpService) { }


  getExternalVariablesSets(): Observable<ExternalVariableSet[]> {
    const path = `v2/financial-accounting/financial-concepts/external-variables-sets`;

    return this.http.get<ExternalVariableSet[]>(path);
  }


  getExternalValues(query: ExternalValuesQuery): Observable<ExternalValuesData> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/financial-concepts/external-values`;

    return this.http.post<ExternalValuesData>(path, query);
  }


  exportExternalValues(query: ExternalValuesQuery): Observable<FileReport> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/financial-concepts/external-values/excel`;

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
