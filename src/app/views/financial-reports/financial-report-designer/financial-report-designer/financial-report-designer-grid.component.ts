/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,
         ViewChild } from '@angular/core';

import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

import { EventInfo, isEmpty } from '@app/core';

import { EmptyFinancialReportDesign, FinancialReportDesign, FinancialReportColumn, FinancialReportRow,
         EmptyFinancialReportRow, DataTableColumnType, FinancialReportCell, EmptyFinancialReportCell,
         FinancialReportDesignType } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { RowMenuEventType } from '../financial-report-edition/row-menu.component';


export enum FinancialReportDesignerGridEventType {
  SELECT_ITEM         = 'FinancialReportDesignerGridComponent.Event.SelectItem',
  INSERT_ROW          = 'FinancialReportDesignerGridComponent.Event.InsertRow',
  UPDATE_ROW          = 'FinancialReportDesignerGridComponent.Event.UpdateRow',
  REMOVE_ROW          = 'FinancialReportDesignerGridComponent.Event.RemoveRow',
  EDIT_CELL           = 'FinancialReportDesignerGridComponent.Event.EditCell',
}


@Component({
  selector: 'emp-fa-financial-report-designer-grid',
  templateUrl: './financial-report-designer-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialReportDesignerGridComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() financialReportDesign: FinancialReportDesign = EmptyFinancialReportDesign;

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  @Input() filter = '';

  @Input() selectedRow: FinancialReportRow = EmptyFinancialReportRow;

  @Input() selectedCell: FinancialReportCell = EmptyFinancialReportCell;

  @Output() financialReportDesignerGridEvent = new EventEmitter<EventInfo>();

  rows: any[];

  columns: FinancialReportColumn[] = [];

  displayedColumnsHeader: string[] = [];

  displayedColumns: string[] = [];

  dataSource: TableVirtualScrollDataSource<FinancialReportRow>;

  COLUMN_TYPE = DataTableColumnType;


  constructor(private messageBox: MessageBoxService) {}


  get isFixedRows() {
    return this.financialReportDesign.config.designType === FinancialReportDesignType.FixedRows;
  }


  get isFixedCells() {
    return this.financialReportDesign.config.designType === FinancialReportDesignType.FixedCells;
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.financialReportDesign) {
      this.configDesignerGrid();
    }

    if (changes.filter) {
      this.applyFilter(this.filter);
    }
  }


  onSelectRowClicked(row: FinancialReportRow) {
    if (!this.isFixedRows || row.row === this.selectedRow.row) {
      return;
    }

    sendEvent(this.financialReportDesignerGridEvent, FinancialReportDesignerGridEventType.SELECT_ITEM,
      {item: row, type: this.financialReportDesign.config.designType});
  }


  onRowMenuEvent(event: EventInfo) {
   switch (event.type as RowMenuEventType) {

      case RowMenuEventType.INSERT_ITEM_CLICKED:
        sendEvent(this.financialReportDesignerGridEvent, FinancialReportDesignerGridEventType.INSERT_ROW,
          {row: this.selectedRow});
        return;

      case RowMenuEventType.UPDATE_ITEM_CLICKED:
        sendEvent(this.financialReportDesignerGridEvent, FinancialReportDesignerGridEventType.UPDATE_ROW,
          {row: this.selectedRow})
        return;

      case RowMenuEventType.REMOVE_ITEM_CLICKED:
        this.showConfirmMessage();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCellSelectClicked(row: number, column: string, cell: FinancialReportCell) {
    if (this.isFixedCells) {
      if(!cell) {
        cell = Object.assign({}, EmptyFinancialReportCell, {row, column});
      }

      if (this.isSameCell(this.selectedCell, cell)) {
        sendEvent(this.financialReportDesignerGridEvent,
          FinancialReportDesignerGridEventType.EDIT_CELL, {cell});
      } else {
        sendEvent(this.financialReportDesignerGridEvent, FinancialReportDesignerGridEventType.SELECT_ITEM,
          {item: cell, type: this.financialReportDesign.config.designType});
      }
    }
  }


  private configDesignerGrid() {
    this.buildDesigneGrid();
    this.setDataSource();
    this.scrollToTop();
  }


  private buildDesigneGrid() {
    if (this.queryExecuted) {
      if (this.isFixedRows) {
        this.buildFixedRowsGrid();
      }

      if (this.isFixedCells) {
        this.buildFixedCellsGrid();
        this.setCellsDataToGrid();
      }
    } else {
      this.columns = [];
      this.rows = [];
    }
  }


  private buildFixedRowsGrid() {
    this.columns = this.financialReportDesign.columns;

    if (this.financialReportDesign.rows.length > 0) {
      this.rows = this.financialReportDesign.rows.map(x => ({...x}));
    } else {
      this.rows = this.columns.length > 0 ? [this.getEmptyRowForFixedRowGrid()] : [];
    }
  }


  private buildFixedCellsGrid() {
    let gridColumns: FinancialReportColumn[] = [];
    let gridRows: FinancialReportRow[] = [];

    this.financialReportDesign.config.grid.columns.forEach(x => {
      const column: FinancialReportColumn = this.getEmptyColumnForFixedCellGrid(x)
      gridColumns.push(column);
    });

    for (let index = this.financialReportDesign.config.grid.startRow;
         index <= this.financialReportDesign.config.grid.endRow;
         index++) {
      const row: FinancialReportRow = this.getEmptyRowForFixedCellGrid(index);
      gridRows.push(row);
    }

    this.columns = gridColumns;
    this.rows = gridRows;
  }


  private setCellsDataToGrid() {
    this.financialReportDesign.cells.forEach(x => {
      const rowIndex = x.row - 1;
      const columnIndex = this.getColumnIndex(x.column);
      const columnField = this.getFieldNameForFixedCells(x.column);
      if (rowIndex >= 0 && columnIndex >= 0) {
        this.rows[rowIndex][columnField] = x;
      }
    });
  }


  private setDataSource() {
    if (this.columns.length === 0) {
      this.displayedColumnsHeader = [];
      this.displayedColumns = [];
    } else {
      this.displayedColumnsHeader = [...[' '], ...this.columns.map(column => column.column)];
      this.displayedColumns = [...['number'], ...this.columns.map(column => column.field)];
    }

    this.dataSource = new TableVirtualScrollDataSource(this.rows);
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }


  private getEmptyRowForFixedRowGrid(): FinancialReportRow {
    return Object.assign({}, EmptyFinancialReportRow, {row: 1})
  }


  private isSameCell(selectedCell: FinancialReportCell, newCell: FinancialReportCell,): boolean {
    return selectedCell.row === newCell.row && selectedCell.column === newCell.column;
  }


  private getEmptyColumnForFixedCellGrid(column: string): FinancialReportColumn  {
    const reportColumn: FinancialReportColumn = {
      column: column,
      title: column,
      field: this.getFieldNameForFixedCells(column),
      type: DataTableColumnType.text,
    };

    return reportColumn;
  }


  private getEmptyRowForFixedCellGrid(row: number): FinancialReportRow {
    const reportRow: FinancialReportRow = {
      uid: '',
      row,
    };

    return reportRow;
  }


  private getFieldNameForFixedCells(column: string) {
    return 'field' + column;
  }


  private getColumnIndex(column: string): number {
    return this.financialReportDesign.config.grid.columns.indexOf(column);
  }


  private getFilterPredicate() {
    return (row: FinancialReportRow, filters: string) => (
      this.columns.filter(x => x.type !== this.COLUMN_TYPE.decimal && row[x.field] &&
                               row[x.field].toString().toLowerCase().includes(filters)).length > 0
    );
  }


  private applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
    this.scrollToTop();
  }


  private showConfirmMessage() {
    if (isEmpty(this.selectedRow)) {
      this.messageBox.showError('No es posible eliminar el elemento');
      return;
    }

    const isConcept = !this.isEmptyConcept();
    const title =  `Eliminar ${isConcept ? 'el concepto' : 'la etiqueta'} del reporte`;
    const message = this.getConfirmMessage();

    this.messageBox.confirm(message, title, 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {
          const payload = {
            financialReportTypeUID: this.financialReportDesign.config.reportType.uid,
            rowUID: this.selectedRow.uid,
          }
          sendEvent(this.financialReportDesignerGridEvent,
            FinancialReportDesignerGridEventType.REMOVE_ROW, payload);
        }
      });
  }


  private getConfirmMessage(): string {
    const isConcept = !this.isEmptyConcept();

    return `
      <table style='margin: 0;'>

        <tr><td class='nowrap'>${isConcept ? 'Concepto' : 'Etiqueta'}: </td><td><strong>
          ${isConcept ?
            this.selectedRow.conceptCode + ': ' + this.selectedRow.concept :
            this.selectedRow.concept}
        </strong></td></tr>

        <tr><td class='nowrap'>Posición: </td><td><strong>
          ${this.selectedRow.row}
        </strong></td></tr>
      </table>

     <br>¿Elimino ${isConcept ? 'el concepto' : 'la etiqueta'} del reporte?`;
  }


  private isEmptyConcept() {
    return isEmpty({uid: this.selectedRow.financialConceptUID});
  }

}
