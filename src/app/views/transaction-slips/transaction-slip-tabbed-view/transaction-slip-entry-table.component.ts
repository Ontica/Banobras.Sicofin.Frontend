/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, Input, OnChanges, ViewChild } from '@angular/core';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { EventInfo } from '@app/core';

import { TransactionSlipEntry, TransactionSlipIssue } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';


@Component({
  selector: 'emp-fa-transaction-slip-entry-table',
  templateUrl: './transaction-slip-entry-table.component.html',
})
export class TransactionSlipEntryTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() transactionSlipUID = '';

  @Input() transactionSlipEntryList: TransactionSlipEntry[] = [];

  @Input() showErrors = false;

  displayedColumns: string[] = [];

  dataSource: TableVirtualScrollDataSource<TransactionSlipEntry>;

  displayExportModal = false;

  fileUrl = '';

  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.dataSource = new TableVirtualScrollDataSource(this.transactionSlipEntryList);
    this.resetColumns();
    this.scrollToTop();
  }


  onExportButtonClicked() {
    this.setDisplayExportModal(true);
  }


  onExportReportModalEvent(event: EventInfo) {
    switch (event.type as ExportReportModalEventType) {

      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;

      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        this.exportTransactionSlipEntries();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onShowErrorsClicked(row: TransactionSlipEntry) {
    this.showMessage(row.description, row.issues);
  }


  private exportTransactionSlipEntries() {
    setTimeout(() => {
      this.fileUrl = 'data-dummy';
      this.messageBox.showInDevelopment('Exportar movimientos', this.transactionSlipUID);
    }, 500);
  }


  private resetColumns() {
    this.displayedColumns = [];

    this.displayedColumns = ['entryNumber', 'account', 'sector', 'description', 'functionalArea',
      'verificationNumber', 'currency', 'exchangeRate', 'debit', 'credit'];

    if (this.showErrors) {
      this.displayedColumns = [...this.displayedColumns, ...['issuesCount']];
    }
  }


  private showMessage(description: string, issuesList: TransactionSlipIssue[]) {
    if (issuesList.length > 0) {
      let message = `<strong>${description}:</strong> <br><br> `;
      message += '<ul class="info-list">' +
        issuesList.map(x => '<li>' + x.description + '</li>').join('') + '</ul>';
      this.messageBox.show(message, 'Errores detectados');
    }
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }

}
