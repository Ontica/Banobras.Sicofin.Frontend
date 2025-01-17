/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { FileControlActions, FileControlEventData, FileData, FileType } from '@app/shared/form-controls';

import { sendEvent } from '@app/shared/utils';

import { EmptyImportDatasets, ImportDatasets, ImportInputDatasetCommand, InputDatasetsQuery, InputDatasetType,
         mapToFileDataFromInputDataset } from '@app/models';


export enum DataImporterEventType {
  CLOSE_MODAL_CLICKED         = 'DataImporterComponent.Event.CloseModalClicked',
  INPUT_DATASET_QUERY_CHANGED = 'DataImporterComponent.Event.InputDatasetQueryChanged',
  IMPORT_DATASET_CLICKED      = 'DataImporterComponent.Event.ImportDataSetClicked',
  DELETE_DATASET_CLICKED      = 'DataImporterComponent.Event.DeleteDataSetClicked',
}

@Component({
  selector: 'emp-ng-data-importer',
  templateUrl: './data-importer.component.html',
})
export class DataImporterComponent implements OnChanges{

  @Input() dataType = '';

  @Input() importTypeRequired = false;

  @Input() importTypeList: Identifiable[] = [];

  @Input() importerDatasets: ImportDatasets = EmptyImportDatasets;

  @Input() multiFiles = false;

  @Output() dataImporterEvent = new EventEmitter<EventInfo>();

  formData = {
    importType: null,
    date: null,
  };

  commandExecuted = false;

  fileControlData = null;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.importerDatasets) {
      this.validateImporterDatasets();
    }
  }


  get instructionMessage(): string {
    if (!this.commandExecuted) {
      return 'Seleccionar los filtros.';
    }

    if (!this.importerDatasets) {
      return 'No se encontraron archivos.';
    }

    return '';
  }


  get filesTotal(): number {
    return this.importerDatasets.missingDatasetKinds.length === 0 ? this.importerDatasets.loadedDatasets.length :
      this.importerDatasets.loadedDatasets.length + 1;
  }


  get tagDefault(): string {
    return this.importerDatasets.missingDatasetKinds.length > 0 ? this.importerDatasets.missingDatasetKinds[0].type : null;
  }


  get tagList(): InputDatasetType[] {
    return this.importerDatasets.missingDatasetKinds.length > 0 ? this.importerDatasets.missingDatasetKinds : [];
  }


  get filesTypesValid(): FileType[] {
    let validFiles: FileType[] = [];

    if (this.importTypeRequired) {
      if (this.importerDatasets.missingDatasetKinds.filter(x => 'excel' === x.fileType.toLowerCase()).length > 0) {
        validFiles.push('excel');
      }

      if (this.importerDatasets.missingDatasetKinds.filter(x => 'csv' === x.fileType.toLowerCase()).length > 0) {
        validFiles.push('csv');
      }
    } else {
      validFiles.push('excel');
    }

    return validFiles;
  }


  get fileControlPlaceholder(): string {
    return `Elegir o arrastrar el archivo ${this.filesTypesValid.length > 0 ? this.filesTypesValid[0] : ''}.`;
  }


  onClose() {
    sendEvent(this.dataImporterEvent, DataImporterEventType.CLOSE_MODAL_CLICKED);
  }


  onFilterChanges() {
    setTimeout(() => {
      if (this.importTypeRequired && (!this.formData.importType || !this.formData.date)) {
        this.commandExecuted = false;
        return;
      }

      this.emitInputDatasetQuery();
    });
  }


  onFileControlEvent(event: FileControlEventData) {
    switch (event.option as FileControlActions) {
      case 'CANCEL':
        this.validateImporterDatasets();
        return;

      case 'SAVE':
        this.importDataSetClicked(event.file as FileData);
        return;

      case 'REMOVE':
        const inputDataset = this.importerDatasets.loadedDatasets.find(x => x.uid === event.file.uid);
        sendEvent(this.dataImporterEvent, DataImporterEventType.DELETE_DATASET_CLICKED, {inputDataset});
        return;
    }
  }


  private emitInputDatasetQuery() {
    const query: InputDatasetsQuery = {
      typeUID: this.importTypeRequired ? this.formData.importType.uid : '',
      date: this.formData.date,
    };

    sendEvent(this.dataImporterEvent, DataImporterEventType.INPUT_DATASET_QUERY_CHANGED, {query});
  }


  private validateImporterDatasets() {
    this.commandExecuted = !!this.importerDatasets;

    if (!this.importerDatasets) {
      this.fileControlData = null;
      return;
    }

    this.setFileControlDataFromDataset();
  }


  private setFileControlDataFromDataset() {
    this.fileControlData = [];
    this.importerDatasets.loadedDatasets.forEach(x => this.fileControlData.push(mapToFileDataFromInputDataset(x)));
  }


  private importDataSetClicked(fileData: FileData) {
    let command: ImportInputDatasetCommand = {
      date: this.formData.date,
    };

    if (this.importTypeRequired) {
      command.typeUID = this.formData.importType.uid;
      command.datasetKind = this.importTypeRequired ? fileData.tag : null;
    }

    const payload = {
      command,
      file: fileData.file,
    };

    sendEvent(this.dataImporterEvent, DataImporterEventType.IMPORT_DATASET_CLICKED, payload);
  }

}
