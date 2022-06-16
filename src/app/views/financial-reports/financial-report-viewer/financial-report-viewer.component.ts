/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { FinancialReportsDataService } from '@app/data-services';

import { FinancialReportQuery, EmptyFinancialReport, EmptyFinancialReportQuery, FinancialReport,
         FinancialReportEntry, EmptyFinancialReportBreakdown, ReportType, ExportationType,
         FileType, FinancialReportBreakdown } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { DataTableEventType } from '@app/views/reports-controls/data-table/data-table.component';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

import { FinancialReportFilterEventType } from './financial-report-filter.component';

export enum FinancialReportViewerEventType {
  FINANCIAL_REPORT_ENTRY_SELECTED = 'FinancialReportViewerComponent.Event.FinancialReportEntrySelected',
}

@Component({
  selector: 'emp-fa-financial-report-viewer',
  templateUrl: './financial-report-viewer.component.html',
})
export class FinancialReportViewerComponent {

  @Input() selectedFinancialReportBreakdown = EmptyFinancialReportBreakdown;

  @Output() financialReportViewerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';

  isLoading = false;

  isLoadingBreakdown = false;

  submitted = false;

  financialReport: FinancialReport = Object.assign({}, EmptyFinancialReport);

  query: FinancialReportQuery = Object.assign({}, EmptyFinancialReportQuery);

  reportType: ReportType = null;

  exportationTypesList: ExportationType[] = [];

  displayExportModal = false;

  fileUrl = '';

  queryExecuted = false;

  constructor(private financialReportsData: FinancialReportsDataService) { }


  onFinancialReportFilterEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as FinancialReportFilterEventType) {

      case FinancialReportFilterEventType.BUILD_FINANCIAL_REPORT_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');

        this.query = event.payload.query as FinancialReportQuery;
        this.setReportType(event.payload.reportType as ReportType);
        this.getFinancialReport();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFinancialReportTableEvent(event) {
    switch (event.type as DataTableEventType) {

      case DataTableEventType.COUNT_FILTERED_ENTRIES:
        Assertion.assertValue(event.payload.displayedEntriesMessage, 'event.payload.displayedEntriesMessage');
        this.setText(event.payload.displayedEntriesMessage as string);
        return;

      case DataTableEventType.EXPORT_DATA:
        this.setDisplayExportModal(true);
        return;

      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        this.getFinancialReportBreakdown(event.payload.entry);
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
        if (this.submitted || !this.query.accountsChartUID ) {
          return;
        }
        Assertion.assertValue(event.payload.exportationType, 'event.payload.exportationType');
        this.exportFinancialReport(event.payload.exportationType as FileType);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getFinancialReport() {
    this.setSubmitted(true);
    this.setFinancialReportData(EmptyFinancialReport, false);

    this.financialReportsData.getFinancialReport(this.query)
      .toPromise()
      .then( x => this.setFinancialReportData(x))
      .finally(() => this.setSubmitted(false));
  }


  private exportFinancialReport(exportTo: FileType) {
    const query = Object.assign({}, this.query, {exportTo});

    this.financialReportsData.exportFinancialReport(query)
      .toPromise()
      .then(x => this.fileUrl = x.url)
      .catch(() => this.setDisplayExportModal(false));
  }


  private getFinancialReportBreakdown(financialReportEntry: FinancialReportEntry) {
    this.isLoadingBreakdown = true;

    this.financialReportsData.getFinancialReportBreakdown(financialReportEntry.uid,
                                                          this.query)
      .toPromise()
      .then(x => {
        const financialReportBreakdown: FinancialReportBreakdown = {
          financialReportEntry,
          financialReportBreakdown: x,
        };

        sendEvent(this.financialReportViewerEvent,
                  FinancialReportViewerEventType.FINANCIAL_REPORT_ENTRY_SELECTED,
                  {financialReportBreakdown});
      })
      .finally(() => this.isLoadingBreakdown = false);
  }


  private setFinancialReportData(financialReport: FinancialReport, queryExecuted = true) {
    this.financialReport = financialReport;
    this.queryExecuted = queryExecuted;
    this.setText();
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.queryExecuted) {
      this.cardHint =  'Selecciona los filtros';
      return;
    }

    if (displayedEntriesMessage) {
      this.cardHint = `${this.reportType.name} - ${displayedEntriesMessage}`;
      return;
    }

    this.cardHint = `${this.reportType.name} - ${this.financialReport.entries.length} ` +
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


  private setReportType(reportType: ReportType) {
    this.reportType = reportType;
    this.setExportationTypesList(this.reportType?.exportTo as ExportationType[]);
  }


  private setExportationTypesList(exportTo: ExportationType[]) {
    if (!exportTo) {
      this.exportationTypesList = [];
      return;
    }

    if (this.query.getAccountsIntegration) {
      this.exportationTypesList = exportTo.filter(x => x.dataset === "AccountsIntegration");
    } else {
      this.exportationTypesList = exportTo.filter(x => x.dataset !== "AccountsIntegration");
    }
  }

}
