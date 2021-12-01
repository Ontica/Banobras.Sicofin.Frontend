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
         SummaryItemTypeList, GroupItemTypeList, TotalItemTypeList } from '@app/models';

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

  @Input() commandExecuted = true;

  @Input() controlsAligned = false;

  @Input() showExportButton = true;

  @Input() clickableEntry = false;

  @Input() formatFieldName = 'format';

  @Input() selectedEntry: DataTableEntry = null;

  @Output() dataTableEvent = new EventEmitter<EventInfo>();

  columns: DataTableColumn[] = [];

  displayedColumns: string[] = [];

  dataSource: TableVirtualScrollDataSource<DataTableEntry>;

  filter = '';

  dataTableColumnType = DataTableColumnType;

  summaryItemTypeList = SummaryItemTypeList;

  groupItemTypeList = GroupItemTypeList;

  totalItemTypeList = TotalItemTypeList;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataTable) {
      this.filter = '';
      this.initDataSource();
      this.scrollToTop();
    }
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
    if (this.clickableEntry) {
      this.emitDataEntryClicked(entry);
    }
  }


  onItemLinkClicked(entry: DataTableEntry) {
    this.emitDataEntryClicked(entry);
  }


  private initDataSource() {
    this.columns = this.dataTable.columns;
    this.displayedColumns = this.columns.map(column => column.field);

    this.dataSource = new TableVirtualScrollDataSource(this.dataTable.entries);
    this.dataSource.filterPredicate = this.getFilterPredicate();
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
    sendEvent(this.dataTableEvent, DataTableEventType.COUNT_FILTERED_ENTRIES,
      this.dataSource.filteredData.length);
  }


  private emitDataEntryClicked(entry: DataTableEntry) {
    sendEvent(this.dataTableEvent, DataTableEventType.ENTRY_CLICKED, { entry });
  }

}
