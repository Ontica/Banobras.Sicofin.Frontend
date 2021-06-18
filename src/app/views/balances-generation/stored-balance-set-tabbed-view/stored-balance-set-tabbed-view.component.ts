/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { EmptyStoredBalanceSet, StoredBalance, StoredBalanceSet } from '@app/models';

@Component({
  selector: 'emp-fa-stored-balance-set-tabbed-view',
  templateUrl: './stored-balance-set-tabbed-view.component.html',
})
export class StoredBalanceSetTabbedViewComponent implements OnChanges {

  @Input() storedBalanceSet: StoredBalanceSet = EmptyStoredBalanceSet;

  @Output() closeEvent = new EventEmitter<void>();

  title = 'Saldos acumulados';

  hint = '';

  selectedTabIndex = 0;

  queryByList: any[] = ['A nivel de auxiliar'];

  queryBy = '';

  keywords = '';

  storedBalanceDisplayedColumns: string[] = ['accountNumber', 'sectorCode', 'accountName', 'partial',
                                             'balance'];

  storedBalanceListDS: TableVirtualScrollDataSource<StoredBalance>;


  ngOnChanges() {
    this.setTitle();
    this.clearFilters();
    this.storedBalanceListDS = new TableVirtualScrollDataSource(this.storedBalanceSet.balances ?? []);
  }


  onClose() {
    this.closeEvent.emit();
  }


  private setTitle() {
    this.hint = this.storedBalanceSet.name;
  }

  private clearFilters() {
    this.queryBy = '';
    this.keywords = '';
  }

}
