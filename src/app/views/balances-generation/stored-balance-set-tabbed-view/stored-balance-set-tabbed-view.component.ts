/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { EventInfo, Identifiable, isEmpty } from '@app/core';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { BalancesStoreDataService } from '@app/data-services';

import { EmptyStoredBalanceSet, StoredBalance, StoredBalanceSet } from '@app/models';

export enum StoredBalanceSetTabbedViewEventType {
  CLOSE_MODAL_CLICKED          = 'StoredBalanceSetTabbedViewComponent.Event.CloseModalClicked',
  CALCULATE_STORED_BALANCE_SET = 'StoredBalanceSetTabbedViewComponent.Event.CalculateStoredBalanceSetClicked',
  DELETE_STORED_BALANCE_SET    = 'StoredBalanceSetTabbedViewComponent.Event.DeleteStoredBalanceSetClicked',
  EXPORT_STORED_BALANCE_SET    = 'StoredBalanceSetTabbedViewComponent.Event.ExportStoredBalanceSetClicked',
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

  dataSource: TableVirtualScrollDataSource<StoredBalance>;

  displayedItemsText = '';

  isLoading = false;

  isDataLoaded = false;


  constructor(private balancesStoreData: BalancesStoreDataService,
              private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.storedBalanceSet) {
      this.setTitle();
      this.initQueryData();
      this.initDataTable();
    }
  }


  onClose() {
    sendEvent(this.storedBalanceSetTabbedViewEvent, StoredBalanceSetTabbedViewEventType.CLOSE_MODAL_CLICKED);
  }


  onFilterDataClicked() {
    if (this.storedBalanceSet.calculated && !this.isDataLoaded) {
      this.getStoredBalanceSet();
    } else {
      this.filterDataTable();
    }
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


  onDeleteStoreBalanceSetClicked() {
    this.confirmDeleteStoreBalanceSet();
  }


  private getStoredBalanceSet() {
    if (isEmpty(this.storedBalanceSet.accountsChart) || !this.storedBalanceSet.uid) {
      return;
    }

    this.isLoading = true;

    this.balancesStoreData.getStoredBalanceSet(this.storedBalanceSet.accountsChart.uid,
                                               this.storedBalanceSet.uid)
      .firstValue()
      .then(x => this.resolveGetStoredBalanceSet(x))
      .finally(() => this.isLoading = false);
  }


  private initQueryData() {
    this.selectedLedger = null;
    this.keywords = '';
  }


  private initDataTable() {
    this.isDataLoaded = false;
    this.setDisplayedColumns();
    this.dataSource = new TableVirtualScrollDataSource([]);
    this.initFilterPredicate();
    this.setDisplayedItemsText();
    this.scrollToTop();
  }


  private resetDataTable() {
    this.dataSource = new TableVirtualScrollDataSource(this.storedBalanceSet.balances ?? []);
    this.initFilterPredicate();
    this.filterDataTable();
  }


  private initFilterPredicate() {
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }


  private filterDataTable() {
    this.applyFilter();
    this.setDisplayedColumns();
    this.setDisplayedItemsText();
    this.scrollToTop();
  }


  private resolveGetStoredBalanceSet(storedBalanceSet: StoredBalanceSet) {
    this.isDataLoaded = true;
    this.storedBalanceSet = storedBalanceSet;
    this.resetDataTable();
  }


  private setTitle() {
    this.title = `Saldos acumulados <span class="tag tag-success tag-small">` +
      `${this.storedBalanceSet.calculated ? 'Generados' : 'No generados'}</span>`;
    this.hint = `<strong>${this.storedBalanceSet.accountsChart.name}&nbsp; &nbsp; | &nbsp; &nbsp;</strong>` +
      `${this.storedBalanceSet.name}`;
  }


  private setDisplayedItemsText() {
    if (!this.isDataLoaded || !this.storedBalanceSet.calculated) {
      this.displayedItemsText = '';
      return;
    }

    if (this.dataSource.filteredData.length === this.dataSource.data.length ) {
      this.displayedItemsText = FormatLibrary.numberWithCommas(this.dataSource.data.length) +
        ' registros encontrados';
    } else {
      this.displayedItemsText = FormatLibrary.numberWithCommas(this.dataSource.filteredData.length) +
        ' de ' + FormatLibrary.numberWithCommas(this.dataSource.data.length) +
        ' registros mostrados';
    }
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

    this.dataSource.filter = JSON.stringify(filtersList);
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }


  private confirmDeleteStoreBalanceSet() {
    const message = `Esta operación eliminará el grupo de saldos ` +
      `<strong>${this.storedBalanceSet.accountsChart.name} | ${this.storedBalanceSet.name}</strong>` +
      `<br><br>¿Elimino el grupo de saldos?`;;

    this.messageBox.confirm(message, 'Eliminar grupo de saldos', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          this.emitDeleteStoreBalanceSet();
        }
      });
  }


  private emitDeleteStoreBalanceSet() {
    const payload = {
      accountsChartUID: this.storedBalanceSet.accountsChart.uid,
      balanceSetUID: this.storedBalanceSet.uid,
    };

    sendEvent(this.storedBalanceSetTabbedViewEvent,
      StoredBalanceSetTabbedViewEventType.DELETE_STORED_BALANCE_SET, payload);
  }

}
