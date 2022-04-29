/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { InputDatasetsCommand, ReconciliationData, ReconciliationDatasets,
         ReconciliationImportInputDatasetCommand, ReconciliationInputDatasetsCommand,
         ReconciliationType } from '@app/models';


@Injectable()
export class ReconciliationDataService {

  constructor(private http: HttpService) { }


  getReconciliationTypes(): Observable<ReconciliationType[]> {
    const path = `v2/financial-accounting/reconciliation/reconciliation-types`;

    return this.http.get<ReconciliationType[]>(path);
  }


  executeReconciliation(command: ReconciliationInputDatasetsCommand): Observable<ReconciliationData> {
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/reconciliation`;

    return this.http.post<ReconciliationData>(path, command);
  }


  getReconciliationInputDatasets(command: InputDatasetsCommand): Observable<ReconciliationDatasets> {
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/reconciliation/datasets`;

    return this.http.post<ReconciliationDatasets>(path, command);
  }


  importInputDatasetFromFile(file: File, command: ReconciliationImportInputDatasetCommand)
    : Observable<ReconciliationDatasets> {
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(command, 'command');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('command', JSON.stringify(command));

    const path = `v2/financial-accounting/reconciliation/datasets/import-from-file`;

    return this.http.post<ReconciliationDatasets>(path, formData);
  }


  deleteInputDataset(datasetUID: string): Observable<ReconciliationDatasets> {
    Assertion.assertValue(datasetUID, 'datasetUID');

    const path = `v2/financial-accounting/reconciliation/datasets/${datasetUID}`;

    return this.http.delete<ReconciliationDatasets>(path);
  }

}
