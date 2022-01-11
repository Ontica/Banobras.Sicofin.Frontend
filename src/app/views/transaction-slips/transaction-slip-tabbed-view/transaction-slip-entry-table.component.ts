/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, Input, OnChanges, ViewChild } from '@angular/core';

import { TransactionSlipEntry, TransactionSlipIssue } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

@Component({
  selector: 'emp-fa-transaction-slip-entry-table',
  templateUrl: './transaction-slip-entry-table.component.html',
})
export class TransactionSlipEntryTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() transactionSlipEntryList: TransactionSlipEntry[] = [];

  @Input() showErrors = false;

  displayedColumns: string[] = [];

  dataSource: TableVirtualScrollDataSource<TransactionSlipEntry>;

  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.dataSource = new TableVirtualScrollDataSource(this.transactionSlipEntryList);
    this.resetColumns();
    this.scrollToTop();
  }


  onShowErrorsClicked(row: TransactionSlipEntry) {
    this.showMessage(row.description, row.issues);
  }


  private resetColumns() {
    this.displayedColumns = [];

    this.displayedColumns = ['entryNumber', 'account', 'sector', 'description', 'functionalArea',
      'currency', 'exchangeRate', 'debit', 'credit'];

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

}
