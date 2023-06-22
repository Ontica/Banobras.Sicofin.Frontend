/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { TransactionSlipIssue } from '@app/models';

@Component({
  selector: 'emp-fa-transaction-slip-issues-table',
  templateUrl: './transaction-slip-issues-table.component.html',
})
export class TransactionSlipIssuesTableComponent implements OnChanges {

  @Input() transactionSlipIssueList: TransactionSlipIssue[] = [];

  displayedColumns: string[] = ['description'];

  dataSource: MatTableDataSource<TransactionSlipIssue>;


  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.transactionSlipIssueList);
    this.scrollToTop();
  }


  private scrollToTop() {
    const scrollableContainer = document.getElementById('scrollableContainer');
    scrollableContainer.scrollTop = 0;
  }

}
