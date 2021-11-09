/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { Assertion } from '@app/core';

import { OperationalReportsDataService } from '@app/data-services';

import { OperationalReportCommand, EmptyOperationalReport, EmptyOperationalReportCommand,
         OperationalReport, FileType, ReportGroup } from '@app/models';

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
export class OperationalReportViewerComponent implements OnChanges {

  @Input() reportGroup: ReportGroup;

  reportGroupName = '';

  cardHint = 'Seleccionar los filtros';

  isLoading = false;

  isLoadingBreakdown = false;

  submitted = false;

  operationalReport: OperationalReport = Object.assign({}, EmptyOperationalReport);

  operationalReportCommand: OperationalReportCommand = Object.assign({}, EmptyOperationalReportCommand);

  selectedReportType = null;

  displayExportModal = false;

  fileUrl = '';

  commandExecuted = false;

  reportGroups = ReportGroup;

  constructor(private operationalReportsData: OperationalReportsDataService,
              private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.setReportGroupName();
  }


  onOperationalReportFilterEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as OperationalReportFilterEventType) {

      case OperationalReportFilterEventType.BUILD_OPERATIONAL_REPORT_CLICKED:
        Assertion.assertValue(event.payload.operationalReportCommand,
          'event.payload.operationalReportCommand');
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');

        this.operationalReportCommand = event.payload.operationalReportCommand as OperationalReportCommand;
        this.selectedReportType = event.payload.reportType;

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
        this.exportOperationalReport(event.payload.fileType as FileType);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setReportGroupName() {
    switch (this.reportGroup) {
      case ReportGroup.ReportesFiscales:
        this.reportGroupName = 'fiscales';
        return;

      case ReportGroup.ReportesOperativos:
        this.reportGroupName = 'operativos';
        return;

      default:
        this.reportGroupName = '';
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


  private exportOperationalReport(exportTo: FileType) {
    const operationalReportCommand = Object.assign({}, this.operationalReportCommand, {exportTo});

    this.operationalReportsData.exportOperationalReport(operationalReportCommand)
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
      this.cardHint = `${this.selectedReportType.name} - ${itemsDisplayed} de ` +
        `${this.operationalReport.entries.length} registros mostrados`;
      return;
    }

    this.cardHint = `${this.selectedReportType.name} - ${this.operationalReport.entries.length} ` +
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
