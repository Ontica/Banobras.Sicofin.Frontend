/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,
         ViewChild } from '@angular/core';

import { EventInfo } from '@app/core';

import { EmptyDataTable, DataTableColumn, DataTable, DataTableEntry, DataTableColumnType,
         SummaryItemTypeList, GroupItemTypeList, TotalItemTypeList, EntryItemTypeList,
         ClickeableItemTypeList } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { DataTableControlsEventType } from './data-table-controls.component';

export enum DataTableEventType {
  COUNT_FILTERED_ENTRIES = 'DataTableComponent.Event.CountFilteredEntries',
  ENTRY_CLICKED          = 'DataTableComponent.Event.EntryClicked',
  EXPORT_DATA            = 'DataTableComponent.Event.ExportData',
}

@Component({
  selector: 'emp-fa-data-table',
  templateUrl: './data-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() dataTable: DataTable = EmptyDataTable;

  @Input() selectedEntry: DataTableEntry = null;

  @Input() executed = true;

  @Input() controlsAligned = false;

  @Input() showExportButton = true;

  @Input() clickableEntry = false;

  @Input() canClickRow = true;

  @Input() formatFieldName = 'format';

  @Input() countOnlyEntries = false;

  @Input() notQueryExecutedText = 'No se ha invocado la consulta.';

  @Output() dataTableEvent = new EventEmitter<EventInfo>();

  columns: DataTableColumn[] = [];

  displayedColumns: string[] = [];

  dataSource: TableVirtualScrollDataSource<DataTableEntry>;

  filter = '';

  dataTableColumnType = DataTableColumnType;

  summaryItemTypeList = SummaryItemTypeList;

  groupItemTypeList = GroupItemTypeList;

  totalItemTypeList = TotalItemTypeList;

  entryItemTypeList = EntryItemTypeList;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataTable) {
      this.filter = '';
      this.initDataSource();
      this.scrollToTop();
    }
  }


  get entriesTotal() {
    return this.countOnlyEntries ?
      this.dataTable.entries.filter(x => EntryItemTypeList.includes(x.itemType)).length :
      this.dataTable.entries.length;
  }


  get filteredEntriesTotal() {
    return this.countOnlyEntries ?
      this.dataSource.filteredData.filter(x => EntryItemTypeList.includes(x.itemType)).length :
      this.dataSource.filteredData.length;
  }


  isClickableEntry(entry: DataTableEntry) {
    return this.canClickRow && (
      !!entry.clickableEntry ||
      (this.clickableEntry && ClickeableItemTypeList.includes(entry.itemType))
    );
  }


  onDataTableControlsEvent(event: EventInfo) {
    switch (event.type as DataTableControlsEventType) {

      case DataTableControlsEventType.FILTER_CHANGED:
        this.filter = event.payload.filter as string;
        this.applyFilter(this.filter);
        return;

      case DataTableControlsEventType.EXPORT_BUTTON_CLICKED:
        sendEvent(this.dataTableEvent, DataTableEventType.EXPORT_DATA);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onRowClicked(entry: DataTableEntry) {
    if (this.isClickableEntry(entry)) {
      this.emitDataEntryClicked(entry);
    }
  }


  onItemLinkClicked(entry: DataTableEntry) {
    this.emitDataEntryClicked(entry);
  }


  private initDataSource() {
    this.columns = this.getValidatedColumns();
    this.displayedColumns = this.columns.map(column => column.field);

    this.dataSource = new TableVirtualScrollDataSource(this.dataTable.entries);
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }


  private getValidatedColumns(): DataTableColumn[] {
    const columns = this.dataTable.columns.filter((value, index, self) =>
      index === self.findIndex((t) => (!!value.field && t.field === value.field)));

    return columns;
  }


  private getFilterPredicate() {
    return (row: DataTableEntry, filters: string) => (
      this.columns.filter(x => x.type !== DataTableColumnType.decimal && typeof row[x.field] === 'string' &&
                               row[x.field].toLowerCase().includes(filters)).length > 0
    );
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }


  private applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
    this.scrollToTop();
    this.emitCountFilteredEntries();
  }


  private emitCountFilteredEntries() {
    const entriesTotal = this.entriesTotal;
    const filteredEntriesTotal = this.filteredEntriesTotal;

    const payload = {
      entriesTotal,
      filteredEntriesTotal,
      displayedEntriesMessage: this.displayedEntriesMessage(entriesTotal, filteredEntriesTotal),
    };

    sendEvent(this.dataTableEvent, DataTableEventType.COUNT_FILTERED_ENTRIES, payload);
  }


  private displayedEntriesMessage(entriesTotal: number, filteredEntriesTotal: number) {
    if (filteredEntriesTotal !== entriesTotal) {
      return `${filteredEntriesTotal} de ${entriesTotal} registros mostrados`;
    }

    return `${entriesTotal} registros encontrados`;
  }


  private emitDataEntryClicked(entry: DataTableEntry) {
    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.dataTableEvent, DataTableEventType.ENTRY_CLICKED, { entry });
    }
  }

}
