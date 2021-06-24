/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { EmptyStoredBalanceSet, StoredBalance, StoredBalanceSet } from '@app/models';

import { EventInfo, Identifiable } from '@app/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

export enum StoredBalanceSetTabbedViewEventType {
  CLOSE_MODAL_CLICKED = 'StoredBalanceSetTabbedViewComponent.Event.CloseModalClicked',
  CALCULATE_STORED_BALANCE_SET = 'StoredBalanceSetTabbedViewComponent.Event.CalculateStoredBalanceSetClicked',
}

@Component({
  selector: 'emp-fa-stored-balance-set-tabbed-view',
  templateUrl: './stored-balance-set-tabbed-view.component.html',
})
export class StoredBalanceSetTabbedViewComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() storedBalanceSet: StoredBalanceSet = EmptyStoredBalanceSet;

  @Output() storedBalanceSetTabbedViewEvent = new EventEmitter<EventInfo>();

  title = 'Saldos acumulados';

  hint = '';

  selectedTabIndex = 0;

  ledgerList: Identifiable[] = [];

  selectedLedger: Identifiable = null;

  showSubsidiaryAccount = false;

  keywords = '';

  storedBalanceDisplayedColumns: string[] =
    ['ledger', 'sectorCode', 'accountNumber', 'accountName', 'balance'];

  storedBalanceListDS: TableVirtualScrollDataSource<StoredBalance>;


  ngOnChanges() {
    this.setTitle();
    this.clearFilters();
    this.initDataSource();
    this.scrollToTop();
  }


  onClose() {
    this.sendEvent(StoredBalanceSetTabbedViewEventType.CLOSE_MODAL_CLICKED);
  }


  onFilterDataClicked() {
    this.setDisplayedColumns();
    this.scrollToTop();
  }


  onCalculateStoredBalanceSetClicked() {
    const payload = {
      accountsChartUID: this.storedBalanceSet.accountsChart.uid,
      balanceSetUID: this.storedBalanceSet.uid,
      storedBalanceSet: {balancesDate: this.storedBalanceSet.balancesDate},
    };

    this.sendEvent(StoredBalanceSetTabbedViewEventType.CALCULATE_STORED_BALANCE_SET, payload);
  }


  private setTitle() {
    this.hint = `<strong>${this.storedBalanceSet.accountsChart.name} &nbsp; &nbsp; | &nbsp; &nbsp; </strong>`
                + `${this.storedBalanceSet.name}`;
  }


  private clearFilters() {
    this.selectedLedger = null;
    this.keywords = '';
  }


  private initDataSource() {
    this.storedBalanceListDS = new TableVirtualScrollDataSource(this.storedBalanceSet.balances ?? []);
    this.setDisplayedColumns();
  }


  private setDisplayedColumns() {
    if (this.showSubsidiaryAccount) {
      this.storedBalanceDisplayedColumns = ['ledger', 'sectorCode', 'accountNumber', 'accountName',
                                            'subsidiaryAccountNumber', 'subsidiaryAccountName', 'balance'];
    } else {
      this.storedBalanceDisplayedColumns =
        ['ledger', 'sectorCode', 'accountNumber', 'accountName', 'balance'];
    }
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }


  private sendEvent(eventType: StoredBalanceSetTabbedViewEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.storedBalanceSetTabbedViewEvent.emit(event);
  }

}
