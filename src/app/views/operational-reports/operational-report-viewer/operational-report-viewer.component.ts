/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion } from '@app/core';

import { OperationalReportsDataService } from '@app/data-services';

import { OperationalReportCommand, EmptyOperationalReport, EmptyOperationalReportCommand,
         OperationalReport, FileReportType } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { DataTableEventType } from '@app/views/reports-controls/data-table/data-table.component';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

import { OperationalReportFilterEventType } from './operational-report-filter.component';

@Component({
  selector: 'emp-fa-operational-report-viewer',
  templateUrl: './operational-report-viewer.component.html',
})
export class OperationalReportViewerComponent {

  operationalReportTypeName = '';

  cardHint = 'Selecciona los filtros';

  isLoading = false;

  isLoadingBreakdown = false;

  submitted = false;

  operationalReport: OperationalReport = Object.assign({}, EmptyOperationalReport);

  operationalReportCommand: OperationalReportCommand = Object.assign({}, EmptyOperationalReportCommand);

  displayExportModal = false;

  fileUrl = '';

  commandExecuted = false;

  constructor(private operationalReportsData: OperationalReportsDataService,
              private messageBox: MessageBoxService) { }


  onOperationalReportFilterEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as OperationalReportFilterEventType) {

      case OperationalReportFilterEventType.BUILD_OPERATIONAL_REPORT_CLICKED:
        Assertion.assertValue(event.payload.operationalReportCommand,
          'event.payload.operationalReportCommand');
        Assertion.assertValue(event.payload.operationalReportTypeName,
          'event.payload.operationalReportTypeName');

        this.operationalReportCommand = event.payload.operationalReportCommand as OperationalReportCommand;
        this.operationalReportTypeName = event.payload.operationalReportTypeName;
        this.getOperationalReport();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOperationalReportTableEvent(event) {
    switch (event.type as DataTableEventType) {

      case DataTableEventType.COUNT_FILTERED_ENTRIES:
        Assertion.assertValue(event.payload, 'event.payload');
        this.setText(event.payload);
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
        if (this.submitted) {
          return;
        }
        Assertion.assertValue(event.payload.exportFileType, 'event.payload.exportFileType');
        this.validateFileReportType(event.payload.exportFileType as FileReportType);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getOperationalReport() {
    this.setSubmitted(true);
    this.setOperationalReportData(EmptyOperationalReport, false);

    this.operationalReportsData.getOperationalReport(this.operationalReportCommand)
      .toPromise()
      .then( x => this.setOperationalReportData(x))
      .finally(() => this.setSubmitted(false));
  }


  private exportOperationalReportToXML() {
    this.operationalReportsData.exportOperationalReportToXML(this.operationalReportCommand)
      .toPromise()
      .then(x => this.fileUrl = x.url)
      .catch(() => this.setDisplayExportModal(false));
  }


  private validateFileReportType(fileReportType: FileReportType) {
    switch (fileReportType) {
      case FileReportType.excel:
        this.messageBox.showInDevelopment(`Exportar reporte a ${fileReportType}`,
          {fileReportType, command: this.operationalReportCommand});
        return;
      case FileReportType.xml:
        this.exportOperationalReportToXML();
        return;
      default:
        console.log(`Unhandled file report type ${fileReportType}`);
        return;
    }
  }


  private setOperationalReportData(operationalReport: OperationalReport, commandExecuted = true) {
    this.operationalReport = operationalReport;
    this.commandExecuted = commandExecuted;
    this.setText();
  }


  private setText(itemsDisplayed?: number) {
    if (!this.commandExecuted) {
      this.cardHint =  'Selecciona los filtros';
      return;
    }

    if (typeof itemsDisplayed === 'number' && itemsDisplayed !== this.operationalReport.entries.length) {
      this.cardHint = `${this.operationalReportTypeName} - ${itemsDisplayed} de ` +
        `${this.operationalReport.entries.length} registros mostrados`;
      return;
    }

    this.cardHint = `${this.operationalReportTypeName} - ${this.operationalReport.entries.length} ` +
      `registros encontrados`;
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }

}
