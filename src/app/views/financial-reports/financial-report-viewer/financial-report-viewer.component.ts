/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion } from '@app/core';

import { FinancialReportsDataService } from '@app/data-services';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { DataTable, FinancialReportCommand, EmptyFinancialReport, EmptyFinancialReportCommand,
         getFinancialReportNameFromUID } from '@app/models';

import { DataTableEventType } from '@app/views/reports-controls/data-table/data-table.component';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

import { FinancialReportFilterEventType } from './financial-report-filter.component';


@Component({
  selector: 'emp-fa-financial-report-viewer',
  templateUrl: './financial-report-viewer.component.html',
})
export class FinancialReportViewerComponent {

  financialReportTypeName = '';

  cardHint = 'Selecciona los filtros';

  isLoading = false;

  submitted = false;

  financialReport: DataTable = Object.assign({}, EmptyFinancialReport);

  financialReportCommand: FinancialReportCommand = Object.assign({}, EmptyFinancialReportCommand);

  displayExportModal = false;

  excelFileUrl = '';

  commandExecuted = false;

  constructor(private financialReportsData: FinancialReportsDataService,
              private messageBox: MessageBoxService) { }


  onFinancialReportFilterEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as FinancialReportFilterEventType) {

      case FinancialReportFilterEventType.BUILD_FINANCIAL_REPORT_CLICKED:
        Assertion.assertValue(event.payload.financialReportCommand, 'event.payload.financialReportCommand');

        this.financialReportCommand = event.payload.financialReportCommand as FinancialReportCommand;
        this.getFinancialReport();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFinancialReportTableEvent(event) {
    switch (event.type as DataTableEventType) {

      case DataTableEventType.COUNT_FILTERED_ITEMS:
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

      case ExportReportModalEventType.EXPORT_EXCEL_CLICKED:
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
    setTimeout(() => {
      this.excelFileUrl = 'data-dummy';
      this.messageBox.showInDevelopment({type: 'EXPORT_FINANCIAL_REPORT',
        command: this.financialReportCommand});
    }, 500);
  }


  private setFinancialReportData(financialReport: DataTable, commandExecuted = true) {
    this.financialReport = financialReport;
    this.commandExecuted = commandExecuted;
    this.setText();
  }


  private setText(itemsDisplayed?: number) {
    if (!this.commandExecuted) {
      this.cardHint =  'Selecciona los filtros';
      return;
    }

    this.financialReportTypeName =
      getFinancialReportNameFromUID(this.financialReport.command['financialReportType']);


    if (typeof itemsDisplayed === 'number' && itemsDisplayed !== this.financialReport.entries.length) {
      this.cardHint = `${this.financialReportTypeName} - ${itemsDisplayed} de ` +
        `${this.financialReport.entries.length} registros mostrados`;
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
