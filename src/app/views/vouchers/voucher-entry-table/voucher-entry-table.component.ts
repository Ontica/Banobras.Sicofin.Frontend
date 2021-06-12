/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { VoucherEntryDescriptor } from '@app/models';

@Component({
  selector: 'emp-fa-voucher-entry-table',
  templateUrl: './voucher-entry-table.component.html',
})
export class VoucherEntryTableComponent implements OnChanges {

  @Input() voucherEntryList: VoucherEntryDescriptor[] = [];

  displayedColumns: string[] = ['accountNumber', 'sector', 'accountName', 'verificationNumber',
    'responsibilityArea', 'currency', 'exchangeRate', 'partial', 'debit', 'credit' ];

  dataSource: MatTableDataSource<VoucherEntryDescriptor>;

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.voucherEntryList);
  }

}
