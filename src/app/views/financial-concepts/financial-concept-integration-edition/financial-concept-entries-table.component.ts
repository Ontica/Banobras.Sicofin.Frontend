/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { FinancialConceptEntry, FinancialConceptEntryType,
         getFinancialConceptEntryTypeName } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

export enum FinancialConceptEntriesTableEventType {
  REMOVE_BUTTON_CLICKED = 'FinancialConceptEntriesTableComponent.Event.RemoveButtonClicked',
}

@Component({
  selector: 'emp-fa-financial-concept-entries-table',
  templateUrl: './financial-concept-entries-table.component.html',
})
export class FinancialConceptEntriesTableComponent implements OnChanges {

  @Input() financialConceptEntryList: FinancialConceptEntry[] = [];

  @Input() canEdit = false;

  @Input() isLoading = false;

  @Output() financialConceptEntriesTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['itemCode', 'itemName', 'subledgerAccount', 'sectorCode', 'operator'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<FinancialConceptEntry>;

  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.financialConceptEntryList) {
      this.dataSource = new MatTableDataSource(this.financialConceptEntryList);
      this.resetColumns();
    }
  }


  onRemoveButtonClicked(event, financialConceptEntry: FinancialConceptEntry) {
    event.stopPropagation();

    const message = this.getConfirmMessage(financialConceptEntry);

    this.messageBox.confirm(message, 'Eliminar elemento de la integración', 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.financialConceptEntriesTableEvent,
            FinancialConceptEntriesTableEventType.REMOVE_BUTTON_CLICKED, {financialConceptEntry});
        }
      });
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(financialConceptEntry: FinancialConceptEntry): string {
    let message =  `
      <table style='margin: 0;'>
      <tr><td class='nowrap'>Tipo: </td>
      <td><strong>${getFinancialConceptEntryTypeName(financialConceptEntry.type)}</strong></td></tr>
      <tr><td class='nowrap'>${this.isAccount(financialConceptEntry.type) ? 'Cuenta' : 'Clave'}:</td>
      <td><strong>${financialConceptEntry.itemCode}</strong></td></tr>
      <tr><td class='nowrap'>Descripción: </td>
      <td><strong>${financialConceptEntry.itemName}</strong></td></tr>`;

    if (this.isAccount(financialConceptEntry.type)) {
      message += `
        <tr><td class='nowrap'>Auxiliar: </td>
        <td><strong>${!!financialConceptEntry.subledgerAccount.trim() ? financialConceptEntry.subledgerAccount : '-'}</strong></td></tr>`
    }
    message += `
      </table>
      <br>¿Elimino el elemento de la integración?`;

    return message;
  }


  private isAccount(type: FinancialConceptEntryType) {
    return type === FinancialConceptEntryType.Account;
  }

}
