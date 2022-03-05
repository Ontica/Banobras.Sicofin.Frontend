/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { DataTable, DataTableCommand, EmptyDataTable, EmptyImportDatasets,
         ImportDatasets } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { DataTableEventType } from '@app/views/reports-controls/data-table/data-table.component';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

import { DataImporterEventType } from './data-importer.component';

import { ImportedDataFilterEventType } from './imported-data-filter.component';

export enum ImportedDataViewerEventType {
  SEARCH_DATA         = 'ImportedDataViewerComponent.Event.SearchData',
  GET_INPUT_DATASET   = 'ImportedDataViewerComponent.Event.GetInputDataSet',
  CLEAR_INPUT_DATASET = 'ImportedDataViewerComponent.Event.ClearInputDataSet',
  IMPORT_DATASET      = 'ImportedDataViewerComponent.Event.ImportDataSet',
  DELETE_DATASET      = 'ImportedDataViewerComponent.Event.DeleteDataSet',
  EXPORT_DATA         = 'ImportedDataViewerComponent.Event.ExportData',
}

@Component({
  selector: 'emp-fa-imported-data-viewer',
  templateUrl: './imported-data-viewer.component.html',
})
export class ImportedDataViewerComponent implements OnChanges {

  @Input() dataType = '';

  @Input() periodRequired = false;

  @Input() typeRequired = false;

  @Input() importTypeRequired = false;

  @Input() multiFiles = false;

  @Input() data: DataTable = Object.assign({}, EmptyDataTable);

  @Input() excelFileUrl = '';

  @Input() isLoading = false;

  @Input() typeList: Identifiable[] = [];

  @Input() importerDatasets: ImportDatasets = EmptyImportDatasets;

  @Output() importedDataViewerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';

  commandExecuted = false;

  command: DataTableCommand = {};

  displayImportModal = false;

  displayExportModal = false;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && !changes.data.firstChange && this.data.columns.length > 0) {
      this.commandExecuted = true;
      this.setText();
    }
  }


  onDataImporterEvent(event: EventInfo) {
    switch (event.type as DataImporterEventType) {

      case DataImporterEventType.CLOSE_MODAL_CLICKED:
        this.displayImportModal = false;
        sendEvent(this.importedDataViewerEvent, ImportedDataViewerEventType.CLEAR_INPUT_DATASET);
        return;

      case DataImporterEventType.INPUT_DATASET_COMMAND_CHANGED:
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

      case ImportedDataFilterEventType.SEARCH_DATA_CLICKED:
        Assertion.assertValue(event.payload.command, 'event.payload.command');

        this.commandExecuted = false;
        this.data = Object.assign({}, EmptyDataTable);

        this.command = event.payload.command;
        sendEvent(this.importedDataViewerEvent, ImportedDataViewerEventType.SEARCH_DATA,
          event.payload);
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
        sendEvent(this.importedDataViewerEvent, ImportedDataViewerEventType.EXPORT_DATA,
          {command: this.command});
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.commandExecuted) {
      this.cardHint = 'Selecciona los filtros';
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
    this.excelFileUrl = '';
  }

}
