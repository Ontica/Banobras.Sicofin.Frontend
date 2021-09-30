/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { EmptyImportVouchersResult, ImportVouchersResult, ImportVouchersTotals } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';


export enum VouchersImporterDetailsTableEventType {
  CHECK_CLICKED = 'VouchersImporterDetailsTableComponent.Event.CheckClicked',
}

@Component({
  selector: 'emp-fa-vouchers-importer-details-table',
  templateUrl: './vouchers-importer-details-table.component.html',
})
export class VouchersImporterDetailsTableComponent implements OnChanges {

  @Input() importVouchersResult: ImportVouchersResult = EmptyImportVouchersResult;

  @Input() commandExecuted = false;

  @Input() canSelect = false;

  @Output() vouchersImporterDetailsTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['description', 'vouchersCount', 'errorsCount', 'warningsCount'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<ImportVouchersTotals>;

  selection = new SelectionModel<ImportVouchersTotals>(true, []);

  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.importVouchersResult?.voucherTotals || []);
    this.resetColumns();
    this.selectAllRows();
  }


  onCheckClicked(row: ImportVouchersTotals) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    } else {
      this.selection.select(row);
    }

    sendEvent(this.vouchersImporterDetailsTableEvent,
      VouchersImporterDetailsTableEventType.CHECK_CLICKED, {selection: this.selection.selected});
  }


  onShowErrorsClicked(row: ImportVouchersTotals) {
    const errorsList = this.importVouchersResult.errors.filter(x => x.uid === row.uid);
    if (errorsList.length > 0) {
      let message = `<strong>${row.description}:</strong> <br><br> `;
      message += '<ul class="info-list">' + errorsList.map(x => '<li>' + x.name + '</li>').join('') + '</ul>';
      this.messageBox.show(message, 'Errores detectados');
    }
  }


  onShowWarningsClicked(row: ImportVouchersTotals) {
    const warningsList = this.importVouchersResult.warnings.filter(x => x.uid === row.uid);
    if (warningsList.length > 0) {
      let message = `<strong>${row.description}:</strong> <br><br> `;
      message += '<ul class="info-list">' +
        warningsList.map(x => '<li>' + x.name + '</li>').join('') + '</ul>';
      this.messageBox.show(message, 'Advertencias detectadas');
    }
  }


  private resetColumns() {
    this.displayedColumns = [];

    if (this.canSelect) {
      this.displayedColumns = ['action'];
    }

    this.displayedColumns = [...this.displayedColumns, ...this.displayedColumnsDefault];
  }


  private selectAllRows() {
    if (this.canSelect && !this.importVouchersResult.hasErrors) {
      this.importVouchersResult.voucherTotals.forEach(x => this.selection.select(x));

      setTimeout(() => {
        sendEvent(this.vouchersImporterDetailsTableEvent, VouchersImporterDetailsTableEventType.CHECK_CLICKED,
          {selection: this.selection.selected});
      });
    }
  }

}
