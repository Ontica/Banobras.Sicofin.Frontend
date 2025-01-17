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

import { MessageBoxService } from '@app/shared/services';

import { sendEvent } from '@app/shared/utils';

import { EmptyFinancialReportDesign, FinancialReportDesign, FinancialReportColumn, FinancialReportRow,
         EmptyFinancialReportRow, DataTableColumnType, FinancialReportCell, EmptyFinancialReportCell,
         FinancialReportDesignType, EmptyFinancialReportColumn } from '@app/models';

import { ItemMenuEventType } from '../financial-report-edition/item-menu.component';


export enum FinancialReportDesignerGridEventType {
  SELECT_ITEM   = 'FinancialReportDesignerGridComponent.Event.SelectItem',
  INSERT_ROW    = 'FinancialReportDesignerGridComponent.Event.InsertRow',
  UPDATE_ROW    = 'FinancialReportDesignerGridComponent.Event.UpdateRow',
  REMOVE_ROW    = 'FinancialReportDesignerGridComponent.Event.RemoveRow',
  INSERT_COLUMN = 'FinancialReportDesignerGridComponent.Event.InsertColumn',
  UPDATE_COLUMN = 'FinancialReportDesignerGridComponent.Event.UpdateColumn',
  REMOVE_COLUMN = 'FinancialReportDesignerGridComponent.Event.RemoveColumn',
  EDIT_CELL     = 'FinancialReportDesignerGridComponent.Event.EditCell',
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

  @Input() selectedColumn: FinancialReportColumn = EmptyFinancialReportColumn;

  @Input() selectedCell: FinancialReportCell = EmptyFinancialReportCell;

  @Input() canEdit = false;

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


  get canEditRows(): boolean {
    return this.canEdit && this.isFixedRows;
  }


  get canEditColumns(): boolean {
    return this.canEdit && false;
  }


  get canEditCells(): boolean {
    return this.canEdit && this.isFixedCells;
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
    if (row.row === this.selectedRow.row) {
      return;
    }

    sendEvent(this.financialReportDesignerGridEvent, FinancialReportDesignerGridEventType.SELECT_ITEM,
      {item: row, type: FinancialReportDesignType.FixedRows});
  }


  onCellSelectClicked(row: number, column: string, cell: FinancialReportCell) {
    if (this.canEditCells) {
      if(!cell) {
        cell = Object.assign({}, EmptyFinancialReportCell, {row, column});
      }

      if (this.isSameCell(this.selectedCell, cell)) {
        sendEvent(this.financialReportDesignerGridEvent,
          FinancialReportDesignerGridEventType.EDIT_CELL, {cell});
      } else {
        sendEvent(this.financialReportDesignerGridEvent, FinancialReportDesignerGridEventType.SELECT_ITEM,
          {item: cell, type: FinancialReportDesignType.FixedCells});
      }
    }
  }


  onColumnClicked(col: string, colIndex: number) {
    if (colIndex === 0) {
      return;
    }

    const column = this.columns.find(c => c.column === col) ?? {column: col};

    sendEvent(this.financialReportDesignerGridEvent, FinancialReportDesignerGridEventType.SELECT_ITEM,
      {item: column, type: FinancialReportDesignType.FixedColumns});
  }


  onRowMenuEvent(event: EventInfo) {
   switch (event.type as ItemMenuEventType) {
      case ItemMenuEventType.INSERT_ITEM_CLICKED:
        sendEvent(this.financialReportDesignerGridEvent, FinancialReportDesignerGridEventType.INSERT_ROW,
          {row: this.selectedRow});
        return;
      case ItemMenuEventType.UPDATE_ITEM_CLICKED:
        sendEvent(this.financialReportDesignerGridEvent, FinancialReportDesignerGridEventType.UPDATE_ROW,
          {row: this.selectedRow})
        return;
      case ItemMenuEventType.REMOVE_ITEM_CLICKED:
        this.showConfirmMessage('row');
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onColumnMenuEvent(event: EventInfo) {
    switch (event.type as ItemMenuEventType) {
      case ItemMenuEventType.INSERT_ITEM_CLICKED:
        sendEvent(this.financialReportDesignerGridEvent, FinancialReportDesignerGridEventType.INSERT_COLUMN,
          {column: this.selectedColumn});
        return;
      case ItemMenuEventType.UPDATE_ITEM_CLICKED:
        sendEvent(this.financialReportDesignerGridEvent, FinancialReportDesignerGridEventType.UPDATE_COLUMN,
          {column: this.selectedColumn})
        return;
      case ItemMenuEventType.REMOVE_ITEM_CLICKED:
        this.showConfirmMessage('column');
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onColumnHeaderClicked(column: FinancialReportColumn) {
    if (this.canEditColumns) {
      this.messageBox.showInDevelopment(`Editar encabezado de columna - ${column.title}`, {column});
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
    this.columns = this.financialReportDesign.columns.filter(x => x.show);

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
      this.validateColumnsEmpties();
      this.displayedColumnsHeader = [...[' '], ...this.columns.map(column => column.column)];
      this.displayedColumns = [...['number'], ...this.columns.map(column => column.field)];
    }

    this.dataSource = new TableVirtualScrollDataSource(this.rows);
    this.dataSource.filterPredicate = this.getFilterPredicate();
  }


  private validateColumnsEmpties() {
    let hasEmptyColumns = false;
    const columns = this.columns.map(column => column.column);
    const columnsChecked = [];

    columns.forEach(col => {
      if (!!col && !columnsChecked.includes(col)) {
        columnsChecked.push(col)
      } else {
        hasEmptyColumns = true;
        columnsChecked.push(this.nextLetterInAlphabet(columnsChecked[columnsChecked.length - 1]));
      }
    })

    if(hasEmptyColumns) {
      this.columns.forEach((x,i)=> x.column = columnsChecked[i]);
    }
  }


  // TODO: 1) validate for more of 27 columns.... 2) assess if move this method to another generic class
  private nextLetterInAlphabet(letter) {
    if (letter == 'z') {
      return 'a';
    } else if (letter == 'Z') {
      return 'A';
    } else {
      return String.fromCharCode(letter.charCodeAt(0) + 1);
    }
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
    const reportColumn: FinancialReportColumn = Object.assign({}, EmptyFinancialReportColumn, {
      column: column,
      title: column,
      field: this.getFieldNameForFixedCells(column),
      type: DataTableColumnType.text,
    });

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

  //#region CONFIRM DELETE: (TODO: refactor confirm message methods)
  private showConfirmMessage(type: 'row' | 'column') {
    if (!this.isSelectionValid(type)) {
      this.messageBox.showError('No es posible eliminar el elemento');
      return;
    }

    this.messageBox.confirm(this.getConfirmMessage(type), this.getTitle(type), 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          this.emitDeleteEventType(type);
        }
      });
  }


  private isSelectionValid(type: 'row' | 'column'): boolean {
    if (type === 'row') {
      return !isEmpty(this.selectedRow);
    }
    if (type === 'column') {
      return !!this.selectedColumn.column;
    }
    return false;
  }


  private getTitle(type: 'row' | 'column'): string {
    if (type === 'row') {
      const isConcept = !this.isEmptyConcept();
      return `Eliminar ${isConcept ? 'el concepto' : 'la etiqueta'} del reporte`
    } else {
      return `Eliminar columna del reporte`
    }
  }


  private getConfirmMessage(type: 'row' | 'column'): string {
    let item;
    let name;
    let position;
    let item2;

    if (type === 'row') {
      const isConcept = !this.isEmptyConcept();
      item = isConcept ? 'Concepto' : 'Etiqueta';
      name = isConcept ? this.selectedRow.conceptCode + ': ' + this.selectedRow.concept : this.selectedRow.concept;
      position = this.selectedRow.row;
      item2 = isConcept ? 'el concepto' : 'la etiqueta';
    } else {
      item = 'Columna';
      name = this.selectedColumn.title;
      position = this.selectedColumn.column;
      item2 = 'la columna';
    }

    return `
      <table class='confirm-data'>
        <tr><td>${item}: </td><td><strong>${name}</strong></td></tr>
        <tr><td>Posición: </td><td><strong>${position}</strong></td></tr>
      </table>
      <br>¿Elimino ${item2} del reporte?`;
  }


  private emitDeleteEventType(type: 'row' | 'column') {
    if (type === 'row') {
      const payload = {
        financialReportTypeUID: this.financialReportDesign.config.reportType.uid,
        rowUID: this.selectedRow.uid,
      }
      sendEvent(this.financialReportDesignerGridEvent,
        FinancialReportDesignerGridEventType.REMOVE_ROW, payload);
    }

    if (type === 'column') {
      const payload = {
        reportTypeUID: this.financialReportDesign.config.reportType.uid,
        columnUID: this.selectedColumn.column,
      }
      sendEvent(this.financialReportDesignerGridEvent,
        FinancialReportDesignerGridEventType.REMOVE_COLUMN, payload);
    }
  }


  private isEmptyConcept() {
    return isEmpty({uid: this.selectedRow.financialConceptUID});
  }
  //#endregion

}
