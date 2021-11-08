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

  cardHint = 'Seleccionar los filtros';

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
        this.setOperationalReportData(EmptyOperationalReport, false);
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
        Assertion.assertValue(event.payload.fileType, 'event.payload.fileType');
        this.exportOperationalReport(event.payload.fileType as FileReportType);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getOperationalReport() {
    this.setSubmitted(true);
    this.operationalReportsData.getOperationalReport(this.operationalReportCommand)
      .toPromise()
      .then( x => this.setOperationalReportData(x))
      .finally(() => this.setSubmitted(false));
  }


  private exportOperationalReport(exportTo: FileReportType) {
    const command = Object.assign({}, this.operationalReportCommand, {exportTo});

    this.operationalReportsData.exportOperationalReport(command)
      .toPromise()
      .then(x => this.fileUrl = x.url)
      .catch(() => this.setDisplayExportModal(false));
  }


  private setOperationalReportData(operationalReport: OperationalReport, commandExecuted = true) {
    this.operationalReport = operationalReport;
    this.commandExecuted = commandExecuted;
    this.setText();
  }


  private setText(itemsDisplayed?: number) {
    if (!this.commandExecuted) {
      this.cardHint =  'Seleccionar los filtros';
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
