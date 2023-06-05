/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { EmptyStoredBalanceSet, StoredBalance, StoredBalanceSet } from '@app/models';

import { EventInfo, Identifiable } from '@app/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

export enum StoredBalanceSetTabbedViewEventType {
  CLOSE_MODAL_CLICKED = 'StoredBalanceSetTabbedViewComponent.Event.CloseModalClicked',
  CALCULATE_STORED_BALANCE_SET = 'StoredBalanceSetTabbedViewComponent.Event.CalculateStoredBalanceSetClicked',
  EXPORT_STORED_BALANCE_SET = 'StoredBalanceSetTabbedViewComponent.Event.ExportStoredBalanceSetClicked',
}

interface FilterDef {
  field: string;
  value: string;
  secondaryField?: string;
}

@Component({
  selector: 'emp-fa-stored-balance-set-tabbed-view',
  templateUrl: './stored-balance-set-tabbed-view.component.html',
})
export class StoredBalanceSetTabbedViewComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() storedBalanceSet: StoredBalanceSet = EmptyStoredBalanceSet;

  @Input() ledgerList: Identifiable[] = [];

  @Output() storedBalanceSetTabbedViewEvent = new EventEmitter<EventInfo>();

  title = 'Saldos acumulados';

  hint = '';

  selectedTabIndex = 0;

  selectedLedger: Identifiable = null;

  showSubledgerAccount = false;

  keywords = '';

  storedBalanceDisplayedColumns: string[] =
    ['ledger', 'sectorCode', 'accountNumber', 'accountName', 'balance'];

  storedBalanceListDS: TableVirtualScrollDataSource<StoredBalance>;

  displayedItemsText = '';


  ngOnChanges(changes: SimpleChanges) {
    if (changes.storedBalanceSet) {
      this.setTitle();
      this.clearFilters();
      this.initDataSource();
      this.setDisplayedItemsText();
      this.scrollToTop();
    }
  }


  onClose() {
    sendEvent(this.storedBalanceSetTabbedViewEvent, StoredBalanceSetTabbedViewEventType.CLOSE_MODAL_CLICKED);
  }


  onFilterDataClicked() {
    this.setDisplayedColumns();
    this.applyFilter();
    this.setDisplayedItemsText();
    this.scrollToTop();
  }


  onExportButtonClicked() {
    sendEvent(this.storedBalanceSetTabbedViewEvent,
      StoredBalanceSetTabbedViewEventType.EXPORT_STORED_BALANCE_SET);
  }


  onCalculateStoredBalanceSetClicked() {
    const payload = {
      accountsChartUID: this.storedBalanceSet.accountsChart.uid,
      balanceSetUID: this.storedBalanceSet.uid,
    };

    sendEvent(this.storedBalanceSetTabbedViewEvent,
      StoredBalanceSetTabbedViewEventType.CALCULATE_STORED_BALANCE_SET, payload);
  }


  private setTitle() {
    this.hint = `<strong>${this.storedBalanceSet.accountsChart.name} &nbsp; &nbsp; | &nbsp; &nbsp; </strong>`
                + `${this.storedBalanceSet.name}`;
  }


  private setDisplayedItemsText() {
    if (this.storedBalanceListDS.filteredData.length === this.storedBalanceListDS.data.length ) {
      this.displayedItemsText = FormatLibrary.numberWithCommas(this.storedBalanceListDS.data.length) +
        ' registros encontrados';
    } else {
      this.displayedItemsText = FormatLibrary.numberWithCommas(this.storedBalanceListDS.filteredData.length) +
        ' de ' + FormatLibrary.numberWithCommas(this.storedBalanceListDS.data.length) +
        ' registros mostrados';
    }
  }


  private clearFilters() {
    this.selectedLedger = null;
    this.keywords = '';
  }


  private initDataSource() {
    this.setDisplayedColumns();
    this.storedBalanceListDS = new TableVirtualScrollDataSource(this.storedBalanceSet.balances ?? []);
    this.storedBalanceListDS.filterPredicate = this.getFilterPredicate();
  }


  private setDisplayedColumns() {
    if (this.showSubledgerAccount) {
      this.storedBalanceDisplayedColumns = ['ledger', 'sectorCode', 'accountNumber', 'accountName',
                                            'subledgerAccountNumber', 'subledgerAccountName', 'balance'];
    } else {
      this.storedBalanceDisplayedColumns =
        ['ledger', 'sectorCode', 'accountNumber', 'accountName', 'balance'];
    }
  }


  private getFilterPredicate() {
    return (row: StoredBalance, filtersJson: string) => {
      const matchFilter = [];
      const filters = JSON.parse(filtersJson) as FilterDef[];

      filters.forEach(filter => {
        switch (filter.field) {
          case 'ledger':
            const fieldValue = row[filter.field][filter.secondaryField] ?? '';
            matchFilter.push(fieldValue.toLowerCase().includes(filter.value.toLowerCase()));
            break;

          case 'keywords':
            const match = this.storedBalanceDisplayedColumns.filter(column =>
              !['balance', 'ledger'].includes(column) && row[column] &&
              row[column].toLowerCase().includes(filter.value.toLowerCase())).length > 0;
            matchFilter.push(match);
            break;
        }
      });

      return matchFilter.every(Boolean);
    };
  }


  private applyFilter() {
    const filtersList: FilterDef[] = [
      {
        field: 'ledger',
        value: this.selectedLedger?.uid ?? '',
        secondaryField: 'uid',
      },
      {
        field: 'keywords',
        value: this.keywords ?? '',
      }
    ];

    this.storedBalanceListDS.filter = JSON.stringify(filtersList);
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
