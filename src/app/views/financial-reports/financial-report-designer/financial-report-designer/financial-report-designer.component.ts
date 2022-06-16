/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges,
         ViewChild } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FinancialReportsEditionDataService } from '@app/data-services';

import { sendEvent } from '@app/shared/utils';

import { EmptyFinancialReportDesign, FinancialReportDesign, FinancialReportRow, EmptyFinancialReportRow,
         FinancialReportCell, EmptyFinancialReportCell, FinancialReportEditionCommand,
         FinancialReportDesignType} from '@app/models';

import { FixedCellEditorEventType } from '../financial-report-edition/fixed-cell-editor.component';

import { FixedRowEditorEventType } from '../financial-report-edition/fixed-row-editor.component';

import { FinancialReportDesignerControlsEventType } from './financial-report-designer-controls.component';

import { FinancialReportDesignerGridEventType } from './financial-report-designer-grid.component';


export enum FinancialReportDesignerEventType {
  REPORT_UPDATED = 'FinancialReportDesignerComponent.Event.ReportUpdated',
}


@Component({
  selector: 'emp-fa-financial-report-designer',
  templateUrl: './financial-report-designer.component.html',
})
export class FinancialReportDesignerComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() financialReportDesign: FinancialReportDesign =  Object.assign({}, EmptyFinancialReportDesign);

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  @Output() financialReportDesignerEvent = new EventEmitter<EventInfo>();

  submitted = false;

  saveSelection = false;

  filter = '';

  displayFixedRowEditor = false;

  selectedRow: FinancialReportRow =  Object.assign({}, EmptyFinancialReportRow);

  rowToEdit: FinancialReportRow =  Object.assign({}, EmptyFinancialReportRow);

  displayFixedCellEditor = false;

  selectedCell: FinancialReportCell =  Object.assign({}, EmptyFinancialReportCell);


  constructor(private financialReportsEditionData: FinancialReportsEditionDataService,
              private messageBox: MessageBoxService) {}


  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (this.queryExecuted && !this.displayFixedRowEditor && !this.displayFixedCellEditor) {
      this.clearSelectedData();
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.financialReportDesign) {
      this.validateClearSelectedData();
    }
  }


  onFinancialReportDesignerControlsEvent(event: EventInfo) {
   switch (event.type as FinancialReportDesignerControlsEventType) {

      case FinancialReportDesignerControlsEventType.FILTER_CHANGED:
        this.filter = event.payload.filter ?? '';
        return;

      case FinancialReportDesignerControlsEventType.EXECUTE_BUTTON_CLICKED:
        this.messageBox.showInDevelopment('Ejecutar reporte');
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFinancialReportDesignerGridEvent(event: EventInfo) {
    switch (event.type as FinancialReportDesignerGridEventType) {

      case FinancialReportDesignerGridEventType.SELECT_ITEM:
        Assertion.assertValue(event.payload.type, 'event.payload.type');
        Assertion.assertValue(event.payload.item, 'event.payload.item');

        if (event.payload.type === FinancialReportDesignType.FixedRows) {
          this.selectedRow = event.payload.item as FinancialReportRow;
          this.rowToEdit =  Object.assign({}, EmptyFinancialReportRow);
        }

        if (event.payload.type === FinancialReportDesignType.FixedCells) {
          this.selectedCell = event.payload.item as FinancialReportCell;
        }

        return;

      case FinancialReportDesignerGridEventType.INSERT_ROW:
        Assertion.assertValue(event.payload.row, 'event.payload.row');
        if (this.selectedRow.uid !== event.payload.row.uid) {
          this.selectedRow = event.payload.row as FinancialReportRow;
        }
        this.rowToEdit =  Object.assign({}, EmptyFinancialReportRow);
        this.displayFixedRowEditor = true;
        return;

      case FinancialReportDesignerGridEventType.UPDATE_ROW:
        Assertion.assertValue(event.payload.row, 'event.payload.row');
        if (this.selectedRow.uid !== event.payload.row.uid) {
          this.selectedRow = event.payload.row as FinancialReportRow;
        }
        this.rowToEdit = event.payload.row as FinancialReportRow;
        this.displayFixedRowEditor = true;
        return;

      case FinancialReportDesignerGridEventType.REMOVE_ROW:
        Assertion.assertValue(event.payload.financialReportTypeUID, 'event.payload.financialReportTypeUID');
        Assertion.assertValue(event.payload.rowUID, 'event.payload.rowUID');
        this.deleteRow(event.payload.financialReportTypeUID as string,
                       event.payload.rowUID as string);
        return;

      case FinancialReportDesignerGridEventType.EDIT_CELL:
        Assertion.assertValue(event.payload.cell, 'event.payload.cell');
        if (this.selectedCell.row !== event.payload.cell.row &&
            this.selectedCell.column !== event.payload.cell.column) {
          this.selectedCell = event.payload.cell as FinancialReportCell;
        }
        this.displayFixedCellEditor = true;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFixedRowEditorEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as FixedRowEditorEventType) {

      case FixedRowEditorEventType.CLOSE_MODAL_CLICKED:
        this.displayFixedRowEditor = false;
        return;

      case FixedRowEditorEventType.INSERT_ROW:
        Assertion.assertValue(event.payload.financialReportTypeUID, 'event.payload.financialReportTypeUID');
        Assertion.assertValue(event.payload.command, 'event.payload.command');

        this.insertRow(event.payload.financialReportTypeUID as string,
                       event.payload.command as FinancialReportEditionCommand);
        return;

      case FixedRowEditorEventType.UPDATE_ROW:
        Assertion.assertValue(event.payload.financialReportTypeUID, 'event.payload.financialReportTypeUID');
        Assertion.assertValue(event.payload.rowUID, 'event.payload.rowUID');
        Assertion.assertValue(event.payload.command, 'event.payload.command');

        this.updateRow(event.payload.financialReportTypeUID as string,
                       event.payload.rowUID as string,
                       event.payload.command as FinancialReportEditionCommand);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFixedCellEditorEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as FixedCellEditorEventType) {

      case FixedCellEditorEventType.CLOSE_MODAL_CLICKED:
        this.displayFixedCellEditor = false;
        return;

      case FixedCellEditorEventType.INSERT_CELL:
        Assertion.assertValue(event.payload.financialReportTypeUID, 'event.payload.financialReportTypeUID');
        Assertion.assertValue(event.payload.command, 'event.payload.command');

        this.insertCell(event.payload.financialReportTypeUID as string,
                        event.payload.command as FinancialReportEditionCommand);
        return;

      case FixedCellEditorEventType.UPDATE_CELL:
        Assertion.assertValue(event.payload.financialReportTypeUID, 'event.payload.financialReportTypeUID');
        Assertion.assertValue(event.payload.cellUID, 'event.payload.cellUID');
        Assertion.assertValue(event.payload.command, 'event.payload.command');

        this.updateCell(event.payload.financialReportTypeUID as string,
                        event.payload.cellUID as string,
                        event.payload.command as FinancialReportEditionCommand);
        return;

      case FixedCellEditorEventType.REMOVE_CELL:
        Assertion.assertValue(event.payload.financialReportTypeUID, 'event.payload.financialReportTypeUID');
        Assertion.assertValue(event.payload.cellUID, 'event.payload.cellUID');
        this.deleteCell(event.payload.financialReportTypeUID as string,
                        event.payload.cellUID as string);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private insertRow(financialReportTypeUID: string,
                    command: FinancialReportEditionCommand) {
    this.submitted = true;

    this.financialReportsEditionData.insertRow(financialReportTypeUID, command)
      .toPromise()
      .then(x => {
        this.messageBox.show('Se agregó el renglón al reporte.', 'Agregar renglón');
        this.setAndEmitFixedRowDataUpdated(x);
      })
      .finally(() => this.submitted = false);
  }


  private updateRow(financialReportTypeUID: string,
                    rowUID: string,
                    command: FinancialReportEditionCommand) {
    this.submitted = true;

    this.financialReportsEditionData.updateRow(financialReportTypeUID, rowUID, command)
      .toPromise()
      .then(x => {
        this.messageBox.show('Se actualizó el renglón del reporte.', 'Editar renglón');
        this.setAndEmitFixedRowDataUpdated(x);
      })
      .finally(() => this.submitted = false);
  }


  private deleteRow(financialReportTypeUID: string,
                    rowUID: string) {
    this.submitted = true;

    this.financialReportsEditionData.deleteRow(financialReportTypeUID, rowUID)
      .toPromise()
      .then(() => {
        this.messageBox.show('Se eliminó el renglón del reporte.', 'Eliminar renglón');
        this.setAndEmitFixedRowDataUpdated(EmptyFinancialReportRow);
      })
      .finally(() => this.submitted = false);
  }


  private insertCell(financialReportTypeUID: string,
                     command: FinancialReportEditionCommand) {
    this.submitted = true;

    this.financialReportsEditionData.insertCell(financialReportTypeUID, command)
      .toPromise()
      .then(x => {
        this.messageBox.show('Se agregó la celda al reporte.', 'Agregar celda');
        this.setAndEmitFixedCellDataUpdated(x);
      })
      .finally(() => this.submitted = false);
  }


  private updateCell(financialReportTypeUID: string,
                     cellUID: string,
                     command: FinancialReportEditionCommand) {
    this.submitted = true;

    this.financialReportsEditionData.updateCell(financialReportTypeUID, cellUID, command)
      .toPromise()
      .then(x => {
        this.messageBox.show('Se actualizó la celda del reporte.', 'Editar celda');
        this.setAndEmitFixedCellDataUpdated(x);
      })
      .finally(() => this.submitted = false);
  }


  private deleteCell(financialReportTypeUID: string,
                     cellUID: string) {
    this.submitted = true;

    this.financialReportsEditionData.deleteCell(financialReportTypeUID, cellUID)
      .toPromise()
      .then(() => {
        this.messageBox.show('Se eliminó la celda del reporte.', 'Eliminar celda');
        this.setAndEmitFixedCellDataUpdated(EmptyFinancialReportCell);
      })
      .finally(() => this.submitted = false);
  }


  private setAndEmitFixedRowDataUpdated(row: FinancialReportRow) {
    this.selectedRow = row;
    this.saveSelection = !isEmpty(row);
    this.closeEditors();
    sendEvent(this.financialReportDesignerEvent, FinancialReportDesignerEventType.REPORT_UPDATED);
  }


  private setAndEmitFixedCellDataUpdated(cell: FinancialReportCell) {
    this.selectedCell = cell;
    this.saveSelection = !isEmpty(cell);
    this.closeEditors();
    sendEvent(this.financialReportDesignerEvent, FinancialReportDesignerEventType.REPORT_UPDATED);
  }


  private closeEditors() {
    this.displayFixedRowEditor = false;
    this.displayFixedCellEditor = false;
  }


  private validateClearSelectedData() {
    if (this.saveSelection) {
      if (!isEmpty(this.financialReportDesign.config.reportType)) {
        this.saveSelection = false;
      }
      return;
    }
    this.clearSelectedData();
  }


  private clearSelectedData() {
    this.selectedRow = Object.assign({}, EmptyFinancialReportRow);
    this.selectedCell =  Object.assign({}, EmptyFinancialReportCell);
  }

}
