/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { ExternalVariableSet, InputDatasetsQuery, ImportInputDatasetCommand, InputDataset, ImportDatasets,
         mapToExternalValuesDatasetsQuery, ExternalValuesDatasetsQuery,
         mapToExternalValuesImportDatasetCommand, ExternalValuesImportDatasetCommand, ExternalValuesQuery,
         EmptyExternalValuesData, ExternalValuesData, mapToExternalValuesQuery,
         ExecuteDatasetsQuery } from '@app/models';

import { ExternalVariablesDataService } from '@app/data-services';

import { PermissionsLibrary } from '@app/main-layout';

import { MessageBoxService } from '@app/shared/containers/message-box';

import {
  ImportedDataViewerEventType
} from '@app/views/reports-controls/imported-data-viewer/imported-data-viewer.component';


@Component({
  selector: 'emp-fa-external-variables-main-page',
  templateUrl: './external-variables-main-page.component.html',
})
export class ExternalVariablesMainPageComponent implements OnInit {

  externalVariableSetList: ExternalVariableSet[] = [];

  externalValuesDatasets: ImportDatasets;

  externalValuesQueryExecuted = false;

  externalValuesQuery: ExternalValuesQuery = null;

  externalValuesData: ExternalValuesData = Object.assign({}, EmptyExternalValuesData);

  permissionToImport = PermissionsLibrary.FEATURE_IMPORTACION_VALORES_EXTERNOS;

  fileUrl = '';

  submitted = false;

  isLoading = false;

  constructor(private externalVariablesData: ExternalVariablesDataService,
              private messageBox: MessageBoxService) { }


  ngOnInit() {
    this.getExternalVariablesSets();
  }


  onImportedDataViewerEvent(event: EventInfo){
    if (this.submitted) {
      return;
    }

    switch (event.type as ImportedDataViewerEventType) {

      case ImportedDataViewerEventType.EXECUTE_DATA:
        Assertion.assertValue(event.payload.query, 'event.payload.query');

        this.externalValuesQueryExecuted = false;
        this.externalValuesData = Object.assign({}, EmptyExternalValuesData);
        this.externalValuesQuery = mapToExternalValuesQuery(event.payload.query as ExecuteDatasetsQuery);

        this.getExternalValues(this.externalValuesQuery);
        return;

      case ImportedDataViewerEventType.EXPORT_DATA:
        Assertion.assertValue(event.payload.exportationType, 'event.payload.exportationType');

        const externalValuesQuery = Object.assign({}, this.externalValuesQuery,
          {exportTo: event.payload.exportationType});

        this.exportExternalValues(externalValuesQuery);
        return;

      case ImportedDataViewerEventType.GET_INPUT_DATASET:
        Assertion.assertValue(event.payload.query.typeUID, 'event.payload.query.typeUID');
        Assertion.assertValue(event.payload.query.date, 'event.payload.query.date');

        const query = mapToExternalValuesDatasetsQuery(event.payload.query as InputDatasetsQuery);

        this.getExternalValuesDatasets(query);
        return;

      case ImportedDataViewerEventType.CLEAR_INPUT_DATASET:
        this.externalValuesDatasets = null;
        return;

      case ImportedDataViewerEventType.IMPORT_DATASET:
        Assertion.assertValue(event.payload.file, 'event.payload.file');
        Assertion.assertValue(event.payload.command.typeUID, 'event.payload.command.typeUID');
        Assertion.assertValue(event.payload.command.datasetKind, 'event.payload.command.datasetKind');
        Assertion.assertValue(event.payload.command.date, 'event.payload.command.date');

        const command =
          mapToExternalValuesImportDatasetCommand(event.payload.command as ImportInputDatasetCommand);

        this.importExternalValuesDatasetFromFile(event.payload.file as File, command);
        return;

      case ImportedDataViewerEventType.DELETE_DATASET:
        Assertion.assertValue(event.payload.inputDataset.uid, 'event.payload.inputDataset.uid');

        this.showConfirmDeleteDataSet(event.payload.inputDataset as InputDataset);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getExternalVariablesSets() {
    this.setSubmitted(true);
    this.externalVariablesData.getExternalVariablesSets()
      .toPromise()
      .then(x => this.externalVariableSetList = x)
      .finally(() => this.setSubmitted(false));
  }


  private getExternalValuesDatasets(query: ExternalValuesDatasetsQuery) {
    this.setSubmitted(true);
    this.externalVariablesData.getExternalValuesDatasets(query)
      .toPromise()
      .then(x => this.externalValuesDatasets = x)
      .finally(() => this.setSubmitted(false));
  }


  private importExternalValuesDatasetFromFile(file: File, command: ExternalValuesImportDatasetCommand) {
    this.setSubmitted(true);
    this.externalVariablesData.importExternalValuesDatasetFromFile(file, command)
      .toPromise()
      .then(x => this.externalValuesDatasets = x)
      .finally(() => this.setSubmitted(false));
  }


  private showConfirmDeleteDataSet(inputDataset: InputDataset) {
    const message = `Esta operación eliminará el archivo <strong> ${inputDataset.fileName}</strong>.
                     <br><br>¿Procedo con la eliminación del archivo?`;

    this.messageBox.confirm(message, 'Eliminar Archivo', 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {
          this.deleteExternalValuesDataset(inputDataset.uid);
        }
      });
  }


  private deleteExternalValuesDataset(inputDatasetUID: string) {
    this.setSubmitted(true);
    this.externalVariablesData.deleteExternalValuesDataset(inputDatasetUID)
      .toPromise()
      .then(x => this.externalValuesDatasets = x)
      .finally(() => this.setSubmitted(false));
  }


  private getExternalValues(query: ExternalValuesQuery) {
    this.setSubmitted(true);
    this.externalVariablesData.getExternalValues(query)
      .toPromise()
      .then(x => {
        this.externalValuesQueryExecuted = true;
        this.externalValuesData = x;
      })
      .finally(() => this.setSubmitted(false));
  }


  private exportExternalValues(query: ExternalValuesQuery) {
    this.externalVariablesData.exportExternalValues(query)
      .toPromise()
      .then(x => this.fileUrl = x.url);
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }

}
