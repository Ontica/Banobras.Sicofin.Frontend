/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { EmptyImportVouchersResult, ImportVouchersResult, ImportVouchersTotals } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';


export enum ImporterDetailsTableEventType {
  CHECK_CLICKED = 'ImporterDetailsTableComponent.Event.CheckClicked',
}

@Component({
  selector: 'emp-fa-importer-details-table',
  templateUrl: './importer-details-table.component.html',
})
export class ImporterDetailsTableComponent implements OnChanges {

  @Input() importVouchersResult: ImportVouchersResult = EmptyImportVouchersResult;

  @Input() commandExecuted = false;

  @Input() canSelect = false;

  @Input() descriptionColumnText = 'Parte';

  @Input() showItemsStatus = true;

  @Input() showProcessedCount = true;

  @Output() importerDetailsTableEvent = new EventEmitter<EventInfo>();

  displayedColumns = [];

  dataSource: MatTableDataSource<ImportVouchersTotals>;

  selection = new SelectionModel<ImportVouchersTotals>(true, []);

  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.importVouchersResult || changes.canSelect) {
      this.dataSource = new MatTableDataSource(this.importVouchersResult?.voucherTotals || []);
      this.resetColumns();
      this.selectAllRows();
    }
  }


  onCheckClicked(row: ImportVouchersTotals) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
    } else {
      this.selection.select(row);
    }

    sendEvent(this.importerDetailsTableEvent,
      ImporterDetailsTableEventType.CHECK_CLICKED, {selection: this.selection.selected});
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

    if (this.canSelect) {
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


  private selectAllRows() {
    if (this.canSelect && !this.importVouchersResult.hasErrors) {
      this.importVouchersResult.voucherTotals.forEach(x => this.selection.select(x));

      setTimeout(() => {
        sendEvent(this.importerDetailsTableEvent, ImporterDetailsTableEventType.CHECK_CLICKED,
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
