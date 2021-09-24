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

import { EmptyFinancialReportDesign, FinancialReportDesign, FinancialReportColumn, FinancialReportRow,
         FinancialReportColumnType } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { FinancialReportDesignerControlsEventType } from './financial-report-designer-controls.component';

export enum FinancialReportDesignerEventType {}

const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


@Component({
  selector: 'emp-fa-financial-report-designer',
  templateUrl: './financial-report-designer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialReportDesignerComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() financialReportDesign: FinancialReportDesign = EmptyFinancialReportDesign;

  @Output() financialReportDesignerEvent = new EventEmitter<EventInfo>();

  rows: any[];

  columns: FinancialReportColumn[] = [];

  displayedColumnsHeader: string[] = [];

  displayedColumns: string[] = [];

  dataSource: TableVirtualScrollDataSource<FinancialReportRow>;

  columnType = FinancialReportColumnType;

  filter = '';

  readonly = true;

  constructor(private messageBox: MessageBoxService) {}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.financialReportDesign) {
      this.setDataTable();
    }
  }


  onFinancialReportDesignerControlsEvent(event: EventInfo) {
   switch (event.type as FinancialReportDesignerControlsEventType) {

      case FinancialReportDesignerControlsEventType.FILTER_CHANGED:
        this.filter = event.payload.filter as string;
        this.applyFilter(this.filter);
        return;

      case FinancialReportDesignerControlsEventType.DISCARD_CHANGES_CLICKED:
        this.setDataTable();
        return;

      case FinancialReportDesignerControlsEventType.SAVE_BUTTON_CLICKED:
        this.messageBox.showInDevelopment('Guardar reporte', this.dataSource.data);
        return;

      case FinancialReportDesignerControlsEventType.EXECUTE_BUTTON_CLICKED:
        this.messageBox.showInDevelopment('Ejecutar reporte');
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setDataTable() {
    if (this.financialReportDesign.columns.length > 0 && this.financialReportDesign.rows.length > 0) {
      this.rows = this.financialReportDesign.rows.map(x => ({...x}));
      this.columns = this.financialReportDesign.columns;
    } else {
      this.rows = [];
      this.columns = [];
    }

    this.initDataSource();
    this.scrollToTop();
  }


  private initDataSource() {
    this.displayedColumnsHeader = this.columns.length === 0 ? [] :
      [...[' '], ...ALPHABET.slice(0, this.columns.length)];
    this.displayedColumns = [...['number'], ...this.columns.map(column => column.field)];
    this.dataSource = new TableVirtualScrollDataSource(this.rows);
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }


  private getFilterPredicate() {
    return (row: FinancialReportRow, filters: string) => (
      this.columns.filter(x => x.type !== FinancialReportColumnType.decimal && row[x.field] &&
                               row[x.field].toString().toLowerCase().includes(filters)).length > 0
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
  }

}
