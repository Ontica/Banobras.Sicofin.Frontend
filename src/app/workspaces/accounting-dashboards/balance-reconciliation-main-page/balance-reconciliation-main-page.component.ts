/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit } from '@angular/core';

import { Assertion, EventInfo, SessionService } from '@app/core';

import { ReconciliationType, InputDatasetsQuery, ReconciliationDatasets, ImportInputDatasetCommand,
         InputDataset, mapToReconciliationImportInputDatasetCommand, mapToReconciliationInputDatasetsCommand,
         ReconciliationImportInputDatasetCommand, ReconciliationData, EmptyReconciliationData,
         ReconciliationInputDatasetsCommand, mapToReconciliationCommand, ExecuteDatasetsQuery,
         ReconciliationCommand } from '@app/models';

import { ReconciliationDataService } from '@app/data-services';

import { PermissionsLibrary } from '@app/main-layout';

import { MessageBoxService } from '@app/shared/containers/message-box';

import {
  ImportedDataViewerEventType
} from '@app/views/reports-controls/imported-data-viewer/imported-data-viewer.component';


@Component({
  selector: 'emp-fa-balance-reconciliation-main-page',
  templateUrl: './balance-reconciliation-main-page.component.html',
})
export class BalanceReconciliationMainPageComponent implements OnInit {

  reconciliationTypeList: ReconciliationType[] = [];

  reconciliationDatasets: ReconciliationDatasets;

  reconciliationCommandExecuted = false;

  reconciliationCommand: ReconciliationCommand = null;

  reconciliationDataTable: ReconciliationData = Object.assign({}, EmptyReconciliationData);

  hasPermissionToImport = false;

  fileUrl = '';

  submitted = false;

  isLoading = false;

  constructor(private reconciliationData: ReconciliationDataService,
              private session: SessionService,
              private messageBox: MessageBoxService) { }


  ngOnInit() {
    this.getReconciliationTypes();
    this.setHasPermissionToImport();
  }


  onImportedDataViewerEvent(event: EventInfo){
    if (this.submitted) {
      return;
    }

    let command = null;

    switch (event.type as ImportedDataViewerEventType) {

      case ImportedDataViewerEventType.EXECUTE_DATA:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.reconciliationCommandExecuted = false;
        this.reconciliationDataTable = Object.assign({}, EmptyReconciliationData);
        this.reconciliationCommand = mapToReconciliationCommand(event.payload.query as ExecuteDatasetsQuery);
        this.executeReconciliation(this.reconciliationCommand);
        return;

      case ImportedDataViewerEventType.EXPORT_DATA:
        Assertion.assertValue(event.payload.exportationType, 'event.payload.exportationType');

        const reconciliationCommand = Object.assign({}, this.reconciliationCommand,
          {exportTo: event.payload.exportationType});

        this.exportReconciliation(reconciliationCommand);
        return;

      case ImportedDataViewerEventType.GET_INPUT_DATASET:
        Assertion.assertValue(event.payload.query.typeUID, 'event.payload.query.typeUID');
        Assertion.assertValue(event.payload.query.date, 'event.payload.query.date');

        command = mapToReconciliationInputDatasetsCommand(event.payload.query as InputDatasetsQuery);
        this.getReconciliationInputDatasets(command);
        return;

      case ImportedDataViewerEventType.CLEAR_INPUT_DATASET:
        this.reconciliationDatasets = null;
        return;

      case ImportedDataViewerEventType.IMPORT_DATASET:
        Assertion.assertValue(event.payload.file, 'event.payload.file');
        Assertion.assertValue(event.payload.command.typeUID, 'event.payload.command.typeUID');
        Assertion.assertValue(event.payload.command.datasetKind, 'event.payload.command.datasetKind');
        Assertion.assertValue(event.payload.command.date, 'event.payload.command.date');

        command =
          mapToReconciliationImportInputDatasetCommand(event.payload.command as ImportInputDatasetCommand);
        this.importInputDatasetFromFile(event.payload.file as File, command);
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


  private setHasPermissionToImport() {
    this.hasPermissionToImport =
      this.session.hasPermission(PermissionsLibrary.FEATURE_IMPORTACION_CONCILIACIONES);
  }


  private getReconciliationTypes() {
    this.setSubmitted(true);
    this.reconciliationData.getReconciliationTypes()
      .toPromise()
      .then(x => this.reconciliationTypeList = x)
      .finally(() => this.setSubmitted(false));
  }


  private getReconciliationInputDatasets(command: ReconciliationInputDatasetsCommand) {
    this.setSubmitted(true);
    this.reconciliationData.getReconciliationInputDatasets(command)
      .toPromise()
      .then(x => this.reconciliationDatasets = x)
      .finally(() => this.setSubmitted(false));
  }


  private importInputDatasetFromFile(file: File, command: ReconciliationImportInputDatasetCommand) {
    this.setSubmitted(true);
    this.reconciliationData.importInputDatasetFromFile(file, command)
      .toPromise()
      .then(x => this.reconciliationDatasets = x)
      .finally(() => this.setSubmitted(false));
  }


  private showConfirmDeleteDataSet(inputDataset: InputDataset) {
    const message = `Esta operación eliminará el archivo <strong> ${inputDataset.fileName}</strong>.
                     <br><br>¿Procedo con la eliminación del archivo?`;

    this.messageBox.confirm(message, 'Eliminar Archivo', 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {
          this.deleteInputDataset(inputDataset.uid);
        }
      });
  }


  private deleteInputDataset(inputDatasetUID: string) {
    this.setSubmitted(true);
    this.reconciliationData.deleteInputDataset(inputDatasetUID)
      .toPromise()
      .then(x => this.reconciliationDatasets = x)
      .finally(() => this.setSubmitted(false));
  }


  private executeReconciliation(command: ReconciliationInputDatasetsCommand) {
    this.setSubmitted(true);
    this.reconciliationData.executeReconciliation(command)
      .toPromise()
      .then(x => {
        this.reconciliationCommandExecuted = true;
        this.reconciliationDataTable = x;
      })
      .finally(() => this.setSubmitted(false));
  }


  private exportReconciliation(command: ReconciliationInputDatasetsCommand) {
    this.reconciliationData.exportReconciliation(command)
      .toPromise()
      .then(x => this.fileUrl = x.url);
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }

}
