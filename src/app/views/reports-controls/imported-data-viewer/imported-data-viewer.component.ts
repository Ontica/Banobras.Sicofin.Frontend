/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PermissionsLibrary } from '@app/main-layout';

import { DataTable, DataTableQuery, DefaultExportationType, DefaultFieldConfig, EmptyDataTable,
         EmptyImportDatasets, ExportationType, FieldConfig, ImportDatasets } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { DataTableEventType } from '@app/views/reports-controls/data-table/data-table.component';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

import { DataImporterEventType } from './data-importer.component';

import { ImportedDataFilterEventType } from './imported-data-filter.component';

export enum ImportedDataViewerEventType {
  EXECUTE_DATA        = 'ImportedDataViewerComponent.Event.ExecuteData',
  GET_INPUT_DATASET   = 'ImportedDataViewerComponent.Event.GetInputDataSet',
  CLEAR_INPUT_DATASET = 'ImportedDataViewerComponent.Event.ClearInputDataSet',
  IMPORT_DATASET      = 'ImportedDataViewerComponent.Event.ImportDataSet',
  DELETE_DATASET      = 'ImportedDataViewerComponent.Event.DeleteDataSet',
  EXPORT_DATA         = 'ImportedDataViewerComponent.Event.ExportData',
  EDIT_DATA_CLICKED   = 'ImportedDataViewerComponent.Event.EditDataClicked',
}

@Component({
  selector: 'emp-fa-imported-data-viewer',
  templateUrl: './imported-data-viewer.component.html',
})
export class ImportedDataViewerComponent implements OnChanges {

  @Input() dataType = '';

  @Input() permissionForOptions: PermissionsLibrary = null;

  @Input() showIconButtonToSubmit = false;

  @Input() showImportData = true;

  @Input() showEditData = false;

  @Input() periodRequired = false;

  @Input() typeFieldConfig: FieldConfig = Object.assign({}, DefaultFieldConfig);

  @Input() additionalFieldConfig: FieldConfig = Object.assign({}, DefaultFieldConfig, {show: false});

  @Input() importTypeRequired = false;

  @Input() multiFiles = false;

  @Input() exportationTypeDefault = true;

  @Input() queryExecuted = false;

  @Input() query: DataTableQuery = {};

  @Input() data: DataTable = Object.assign({}, EmptyDataTable);

  @Input() fileUrl = '';

  @Input() isLoading = false;

  @Input() importerDatasets: ImportDatasets = EmptyImportDatasets;

  @Input() searchButtonText = 'Procesar';

  @Output() importedDataViewerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';

  exportationTypesList: ExportationType[] = [];

  displayImportModal = false;

  displayExportModal = false;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.queryExecuted) {
      this.setText();
    }
  }


  onDataImporterEvent(event: EventInfo) {
    switch (event.type as DataImporterEventType) {

      case DataImporterEventType.CLOSE_MODAL_CLICKED:
        this.displayImportModal = false;
        sendEvent(this.importedDataViewerEvent, ImportedDataViewerEventType.CLEAR_INPUT_DATASET);
        return;

      case DataImporterEventType.INPUT_DATASET_QUERY_CHANGED:
        sendEvent(this.importedDataViewerEvent, ImportedDataViewerEventType.GET_INPUT_DATASET, event.payload);
        return;

      case DataImporterEventType.IMPORT_DATASET_CLICKED:
        sendEvent(this.importedDataViewerEvent, ImportedDataViewerEventType.IMPORT_DATASET, event.payload);
        return;

      case DataImporterEventType.DELETE_DATASET_CLICKED:
        sendEvent(this.importedDataViewerEvent, ImportedDataViewerEventType.DELETE_DATASET, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onImportedDataFilterEvent(event) {
    switch (event.type as ImportedDataFilterEventType) {

      case ImportedDataFilterEventType.EXECUTE_DATA_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.setExtortationType(event.payload.typeSelected?.exportTo as ExportationType[]);
        sendEvent(this.importedDataViewerEvent, ImportedDataViewerEventType.EXECUTE_DATA, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDataTableEvent(event) {
    switch (event.type as DataTableEventType) {

      case DataTableEventType.COUNT_FILTERED_ENTRIES:
        Assertion.assertValue(event.payload.displayedEntriesMessage, 'event.payload.displayedEntriesMessage');
        this.setText(event.payload.displayedEntriesMessage as string);
        return;

      case DataTableEventType.EXPORT_DATA:
        this.setDisplayExportModal(true);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event) {
    switch (event.type as ExportReportModalEventType) {

      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;

      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        const payload = {
          query: this.query,
          exportationType: event.payload.exportationType,
        };

        sendEvent(this.importedDataViewerEvent, ImportedDataViewerEventType.EXPORT_DATA, payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onEditDataClicked() {
    sendEvent(this.importedDataViewerEvent, ImportedDataViewerEventType.EDIT_DATA_CLICKED);
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    if (displayedEntriesMessage) {
      this.cardHint = `${displayedEntriesMessage}`;
      return;
    }

    this.cardHint = `${this.data.entries.length} registros encontrados`;
  }


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }


  private setExtortationType(exportTo: ExportationType[]) {
    if (this.exportationTypeDefault) {
      this.exportationTypesList = [DefaultExportationType];
      return;
    }

    this.exportationTypesList = exportTo ?? [];
  }

}
