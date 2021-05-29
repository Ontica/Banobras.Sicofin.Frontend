/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EmptyTrialBalance, TrialBalance, TrialBalanceEntry } from '@app/models';

@Component({
  selector: 'emp-fa-trial-balance-table',
  templateUrl: './trial-balance-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrialBalanceTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() trialBalance: TrialBalance = EmptyTrialBalance;

  columns = [
    {field: 'accountNumber',  title: 'Cuenta',         type: 'text-nowrap'},
    {field: 'sectorCode',     title: '',               type: 'text'},
    {field: 'accountName',    title: 'Nombre',         type: 'text'},
    {field: 'initialBalance', title: 'Saldo anterior', type: 'decimal'},
    {field: 'debit',          title: 'Cargos',         type: 'decimal'},
    {field: 'credit',         title: 'Abonos',         type: 'decimal'},
    {field: 'currentBalance', title: 'Saldo actual',   type: 'decimal'},
  ];

  displayedColumns = this.columns.map(column => column.field);

  dataSource: MatTableDataSource<TrialBalanceEntry>;

  ngOnChanges(): void {
    this.scrollToTop();
    this.dataSource = new MatTableDataSource(this.trialBalance.entries);
  }


  get displayTrialBalanceTable() {
    return !!this.trialBalance.command.trialBalanceType;
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }
  }

}
