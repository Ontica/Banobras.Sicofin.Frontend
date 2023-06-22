/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { EventInfo } from '@app/core';

import { EmptyImportVouchersResult, ImportVouchersResult, ImportVouchersTotals } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';


export enum VouchersImporterDetailsTableEventType {
  CHECK_CLICKED = 'VouchersImporterDetailsTableComponent.Event.CheckClicked',
}

export enum ImporterDetailsSelectionType {
  NONE = 'NONE',
  UNIQUE = 'UNIQUE',
  MULTI = 'MULTI',
}

@Component({
  selector: 'emp-fa-vouchers-importer-details-table',
  templateUrl: './importer-details-table.component.html',
})
export class VouchersImporterDetailsTableComponent implements OnChanges {

  @Input() importVouchersResult: ImportVouchersResult = EmptyImportVouchersResult;

  @Input() commandExecuted = false;

  @Input() selectionType: ImporterDetailsSelectionType = ImporterDetailsSelectionType.NONE;

  @Input() descriptionColumnText = 'Parte';

  @Input() showItemsStatus = true;

  @Input() showProcessedCount = true;

  @Output() vouchersImporterDetailsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = [];

  dataSource: MatTableDataSource<ImportVouchersTotals>;

  selection = new SelectionModel<ImportVouchersTotals>(true, []);

  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.importVouchersResult || changes.selectionType) {
      this.dataSource = new MatTableDataSource(this.importVouchersResult?.voucherTotals || []);
      this.resetColumns();
      this.resetSelection();
    }
  }


  get selectionRequired(){
    return ImporterDetailsSelectionType.NONE !== this.selectionType;
  }


  get isMultiSelection(){
    return ImporterDetailsSelectionType.MULTI === this.selectionType;
  }

  get isUniqueSelection(){
    return ImporterDetailsSelectionType.UNIQUE === this.selectionType;
  }


  onRowSelectionClicked(row: ImportVouchersTotals) {
    this.selection.toggle(row);

    sendEvent(this.vouchersImporterDetailsTableEvent,
      VouchersImporterDetailsTableEventType.CHECK_CLICKED, {selection: this.selection.selected});
  }


  onShowErrorsClicked(row: ImportVouchersTotals) {
    const errorsList = this.importVouchersResult.errors.filter(x => x.uid === row.uid).map(x => x.name);
    this.showMessage('Errores detectados', row.description, errorsList);
  }


  onShowWarningsClicked(row: ImportVouchersTotals) {
    const warningsList = this.importVouchersResult.warnings.filter(x => x.uid === row.uid).map(x => x.name);
    this.showMessage('Advertencias detectadas', row.description, warningsList);
  }


  private resetColumns() {
    this.displayedColumns = [];

    if (this.selectionRequired) {
      this.displayedColumns = ['action'];
    }

    this.displayedColumns = [...this.displayedColumns, ...['description', 'vouchersCount']];

    if (this.showProcessedCount) {
      this.displayedColumns = [...this.displayedColumns, ...['processedCount']];
    }

    if (this.showItemsStatus) {
      this.displayedColumns = [...this.displayedColumns, ...['errorsCount', 'warningsCount']];
    }
  }


  private resetSelection() {
    this.selection.clear();

    if (this.isUniqueSelection) {
      this.selection = new SelectionModel<ImportVouchersTotals>(false, []);
      return;
    }

    if (this.isMultiSelection) {
      this.selection = new SelectionModel<ImportVouchersTotals>(true, []);
      this.selectAllRows();
    }
  }


  private selectAllRows() {

    if (this.selectionRequired && !this.importVouchersResult.hasErrors) {
      this.importVouchersResult.voucherTotals.forEach(x => this.selection.select(x));

      setTimeout(() => {
        sendEvent(this.vouchersImporterDetailsTableEvent, VouchersImporterDetailsTableEventType.CHECK_CLICKED,
          {selection: this.selection.selected});
      });
    }
  }


  private showMessage(title: string, description: string, messageList: string[]) {
    if (messageList.length > 0) {
      let message = `<strong>${description}:</strong> <br><br> `;
      message += '<ul class="info-list">' +
        messageList.map(x => '<li>' + x + '</li>').join('') + '</ul>';
      this.messageBox.show(message, title);
    }
  }

}
