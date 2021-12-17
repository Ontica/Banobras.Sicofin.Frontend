/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { FinancialReportsDataService } from '@app/data-services';

import { FinancialReportCommand, EmptyFinancialReport, EmptyFinancialReportCommand,
         FinancialReport, FinancialReportEntry, EmptyFinancialReportBreakdown} from '@app/models';

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

  @Output() financialReportViewerEvent = new EventEmitter<EventInfo>();

  financialReportTypeName = '';

  cardHint = 'Seleccionar los filtros';

  isLoading = false;

  isLoadingBreakdown = false;

  submitted = false;

  financialReport: FinancialReport = Object.assign({}, EmptyFinancialReport);

  financialReportCommand: FinancialReportCommand = Object.assign({}, EmptyFinancialReportCommand);

  displayExportModal = false;

  excelFileUrl = '';

  selectedFinancialReportBreakdown = EmptyFinancialReportBreakdown;

  commandExecuted = false;

  constructor(private financialReportsData: FinancialReportsDataService) { }


  onFinancialReportFilterEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as FinancialReportFilterEventType) {

      case FinancialReportFilterEventType.BUILD_FINANCIAL_REPORT_CLICKED:
        Assertion.assertValue(event.payload.financialReportCommand, 'event.payload.financialReportCommand');
        Assertion.assertValue(event.payload.financialReportTypeName, 'event.payload.financialReportTypeName');

        this.financialReportCommand = event.payload.financialReportCommand as FinancialReportCommand;
        this.financialReportTypeName = event.payload.financialReportTypeName;
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
        if (this.submitted || !this.financialReportCommand.accountsChartUID ) {
          return;
        }

        this.exportFinancialReportToExcel();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getFinancialReport() {
    this.setSubmitted(true);
    this.setFinancialReportData(EmptyFinancialReport, false);

    this.financialReportsData.getFinancialReport(this.financialReportCommand)
      .toPromise()
      .then( x => this.setFinancialReportData(x))
      .finally(() => this.setSubmitted(false));
  }


  private exportFinancialReportToExcel() {
    this.financialReportsData.exportFinancialReportToExcel(this.financialReportCommand)
      .toPromise()
      .then(x => this.excelFileUrl = x.url)
      .catch(() => this.setDisplayExportModal(false));
  }


  private getFinancialReportBreakdown(financialReportEntry: FinancialReportEntry) {
    this.isLoadingBreakdown = true;

    this.financialReportsData.getFinancialReportBreakdown(financialReportEntry.uid,
                                                          this.financialReportCommand)
      .toPromise()
      .then(x => {
        this.selectedFinancialReportBreakdown = {
          financialReportEntry,
          financialReportBreakdown: x,
        };

        sendEvent(this.financialReportViewerEvent,
                  FinancialReportViewerEventType.FINANCIAL_REPORT_ENTRY_SELECTED,
                  {financialReportBreakdown: this.selectedFinancialReportBreakdown});
      })
      .finally(() => this.isLoadingBreakdown = false);
  }


  private setFinancialReportData(financialReport: FinancialReport, commandExecuted = true) {
    this.financialReport = financialReport;
    this.commandExecuted = commandExecuted;
    this.setText();
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.commandExecuted) {
      this.cardHint =  'Selecciona los filtros';
      return;
    }

    if (displayedEntriesMessage) {
      this.cardHint = `${this.financialReportTypeName} - ${displayedEntriesMessage}`;
      return;
    }

    this.cardHint = `${this.financialReportTypeName} - ${this.financialReport.entries.length} ` +
      `registros encontrados`;
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.excelFileUrl = '';
  }

}
