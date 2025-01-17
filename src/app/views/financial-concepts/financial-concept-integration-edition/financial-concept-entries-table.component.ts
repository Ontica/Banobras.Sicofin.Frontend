/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { sendEvent } from '@app/shared/utils';

import { FinancialConceptEntryDescriptor, FinancialConceptEntryType,
         getFinancialConceptEntryTypeName } from '@app/models';


export enum FinancialConceptEntriesTableEventType {
  UPDATE_BUTTON_CLICKED = 'FinancialConceptEntriesTableComponent.Event.UpdateButtonClicked',
  REMOVE_BUTTON_CLICKED = 'FinancialConceptEntriesTableComponent.Event.RemoveButtonClicked',
}

@Component({
  selector: 'emp-fa-financial-concept-entries-table',
  templateUrl: './financial-concept-entries-table.component.html',
})
export class FinancialConceptEntriesTableComponent implements OnChanges {

  @Input() financialConceptEntryList: FinancialConceptEntryDescriptor[] = [];

  @Input() canEdit = false;

  @Output() financialConceptEntriesTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['itemCode', 'itemName', 'typeName', 'groupName', 'subledgerAccount',
                                       'sectorCode', 'operator'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<FinancialConceptEntryDescriptor>;

  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.financialConceptEntryList) {
      this.dataSource = new MatTableDataSource(this.financialConceptEntryList);
      this.resetColumns();
    }
  }


  onUpdateButtonClicked(financialConceptEntry: FinancialConceptEntryDescriptor) {
    if (this.canEdit && window.getSelection().toString().length <= 0) {
      sendEvent(this.financialConceptEntriesTableEvent,
        FinancialConceptEntriesTableEventType.UPDATE_BUTTON_CLICKED, {financialConceptEntry});
    }
  }


  onRemoveButtonClicked(financialConceptEntry: FinancialConceptEntryDescriptor) {
    const message = this.getConfirmMessage(financialConceptEntry);

    this.messageBox.confirm(message, 'Eliminar la regla de la integración', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.financialConceptEntriesTableEvent,
            FinancialConceptEntriesTableEventType.REMOVE_BUTTON_CLICKED, {financialConceptEntry});
        }
      });
  }


  getFinancialConceptEntryTypeName(type: FinancialConceptEntryType): string {
    return getFinancialConceptEntryTypeName(type);
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(financialConceptEntry: FinancialConceptEntryDescriptor): string {
    let message =  `
      <table style='margin: 0;'>
      <tr><td class='nowrap'>Tipo: </td>
      <td><strong>${this.getFinancialConceptEntryTypeName(financialConceptEntry.type)}</strong></td></tr>
      <tr><td class='nowrap'>${this.isAccount(financialConceptEntry.type) ? 'Cuenta' : 'Clave'}:</td>
      <td><strong>${!!financialConceptEntry.itemCode ? financialConceptEntry.itemCode : '-'}</strong></td></tr>
      <tr><td class='nowrap'>Descripción: </td>
      <td><strong>${!!financialConceptEntry.itemName ? financialConceptEntry.itemName : '-'}</strong></td></tr>`;

    if (this.isAccount(financialConceptEntry.type)) {
      message += `
        <tr><td class='nowrap'>Auxiliar: </td>
        <td><strong>${!!financialConceptEntry.subledgerAccount.trim() ? financialConceptEntry.subledgerAccount : '-'}</strong></td></tr>`
    }
    message += `
      </table>
      <br>¿Elimino la regla de la integración?`;

    return message;
  }


  private isAccount(type: FinancialConceptEntryType) {
    return type === FinancialConceptEntryType.Account;
  }

}
