/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { FileDownloadService } from '@app/data-services/file-services/file-download.service';

import { EmptyImportDatasets, ImportDatasets, ImportInputDatasetCommand, InputDatasetsCommand,
         InputDatasetType, mapToFileDataFromInputDataset } from '@app/models';

import { FileControlActions, FileData,
         FileType } from '@app/shared/form-controls/file-control/file-control-data';

import { sendEvent } from '@app/shared/utils';

export enum DataImporterEventType {
  CLOSE_MODAL_CLICKED  = 'DataImporterComponent.Event.CloseModalClicked',
  INPUT_DATASET_COMMAND_CHANGED = 'DataImporterComponent.Event.InputDatasetCommandChanged',
  IMPORT_DATASET_CLICKED = 'DataImporterComponent.Event.ImportDataSetClicked',
  DELETE_DATASET_CLICKED = 'DataImporterComponent.Event.DeleteDataSetClicked',
}

@Component({
  selector: 'emp-fa-data-importer',
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

  constructor(private fileDownload: FileDownloadService) { }


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
    return this.importerDatasets.missing.length === 0 ? this.importerDatasets.loaded.length :
      this.importerDatasets.loaded.length + 1;
  }


  get tagDefault(): string {
    return this.importerDatasets.missing.length > 0 ? this.importerDatasets.missing[0].type : null;
  }


  get tagList(): InputDatasetType[] {
    return this.importerDatasets.missing.length > 0 ? this.importerDatasets.missing : [];
  }


  get filesTypesValid(): FileType[] {
    let filesValid: FileType[] = [];

    if (this.importTypeRequired) {
      if (this.importerDatasets.missing.filter(x => 'excel' === x.fileType.toLowerCase()).length > 0) {
        filesValid.push('excel');
      }

      if (this.importerDatasets.missing.filter(x => 'csv' === x.fileType.toLowerCase()).length > 0) {
        filesValid.push('csv');
      }
    } else {
      filesValid.push('excel');
    }

    return filesValid;
  }


  get fileControlPlaceholder(): string {
    return `Elija o arrastre el archivo ${this.filesTypesValid.length > 0 ? this.filesTypesValid[0] : ''}.`;
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

      this.emitInputDatasetCommand();
    });
  }


  onFileControlEvent(event) {
    switch (event.option as FileControlActions) {
      case 'CANCEL':
        this.validateImporterDatasets();
        return;

      case 'SAVE':
        this.importDataSetClicked(event.file as FileData);
        return;

      case 'DOWNLOAD':
        this.downloadInputDataset(event.file.url);
        return;

      case 'REMOVE':
        const iputDataset = this.importerDatasets.loaded.find(x => x.uid === event.file.uid);
        sendEvent(this.dataImporterEvent, DataImporterEventType.DELETE_DATASET_CLICKED, {iputDataset});
        return;
    }
  }


  private emitInputDatasetCommand() {
    const command: InputDatasetsCommand = {
      typeUID: this.importTypeRequired ? this.formData.importType.uid : '',
      date: this.formData.date,
    };

    sendEvent(this.dataImporterEvent, DataImporterEventType.INPUT_DATASET_COMMAND_CHANGED, {command});
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
    this.importerDatasets.loaded.forEach(x => this.fileControlData.push(mapToFileDataFromInputDataset(x)));
  }


  private importDataSetClicked(fileData: FileData) {
    let command: ImportInputDatasetCommand = {
      date: this.formData.date,
    };

    if (this.importTypeRequired) {
      command.typeUID = this.formData.importType.uid;
      command.datasetType = this.importTypeRequired ? fileData.tag : null;
    }

    const payload = {
      command,
      file: fileData.file,
    };

    sendEvent(this.dataImporterEvent, DataImporterEventType.IMPORT_DATASET_CLICKED, payload);
  }


  private downloadInputDataset(url: string) {
    this.fileDownload.download(url);
  }

}
