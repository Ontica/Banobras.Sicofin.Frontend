/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { Assertion } from '@app/core';

import { OperationalReportsDataService } from '@app/data-services';

import { OperationalReportQuery, EmptyOperationalReport, EmptyOperationalReportQuery, OperationalReport,
         FileType, ReportGroup, ReportType, ExportationType, OperationalReportTypeFlags } from '@app/models';

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

  operationalReportQuery: OperationalReportQuery = Object.assign({}, EmptyOperationalReportQuery);

  selectedReportType: ReportType<OperationalReportTypeFlags> = null;

  exportationTypesList: ExportationType[] = [];

  displayExportModal = false;

  fileUrl = '';

  queryExecuted = false;

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
        Assertion.assertValue(event.payload.operationalReportQuery,
          'event.payload.operationalReportQuery');
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');

        this.operationalReportQuery = event.payload.operationalReportQuery as OperationalReportQuery;
        this.setReportType(event.payload.reportType as ReportType<OperationalReportTypeFlags>);
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
        if (this.submitted) {
          return;
        }
        Assertion.assertValue(event.payload.exportationType, 'event.payload.exportationType');
        this.exportOperationalReport(event.payload.exportationType as FileType);
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
    this.operationalReportsData.getOperationalReport(this.operationalReportQuery)
      .toPromise()
      .then( x => this.setOperationalReportData(x))
      .finally(() => this.setSubmitted(false));
  }


  private exportOperationalReport(exportTo: FileType) {
    const operationalReportQuery = Object.assign({}, this.operationalReportQuery, {exportTo});

    this.operationalReportsData.exportOperationalReport(operationalReportQuery)
      .toPromise()
      .then(x => this.fileUrl = x.url)
      .catch(() => this.setDisplayExportModal(false));
  }


  private setOperationalReportData(operationalReport: OperationalReport, queryExecuted = true) {
    this.operationalReport = operationalReport;
    this.queryExecuted = queryExecuted;
    this.setText();
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.queryExecuted) {
      this.cardHint =  'Seleccionar los filtros';
      return;
    }

    if (displayedEntriesMessage) {
      this.cardHint = `${this.selectedReportType.name} - ${displayedEntriesMessage}`;
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


  private setReportType(reportType: ReportType<OperationalReportTypeFlags>) {
    this.selectedReportType = reportType;
    this.exportationTypesList = !this.selectedReportType?.exportTo ? [] :
      this.selectedReportType.exportTo.map(x => Object.create({uid: x, name: x, fileType: x}));
  }

}
