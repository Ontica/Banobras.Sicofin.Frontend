/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { ConceptIntegrationEntry } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

export enum ConceptIntegrationEntriesTableEventType {
  UPDATE_BUTTON_CLICKED = 'ConceptIntegrationEntriesTableComponent.Event.UpdateButtonClicked',
  REMOVE_BUTTON_CLICKED = 'ConceptIntegrationEntriesTableComponent.Event.RemoveButtonClicked',
}

@Component({
  selector: 'emp-fa-concept-integration-entries-table',
  templateUrl: './concept-integration-entries-table.component.html',
})
export class ConceptIntegrationEntriesTableComponent implements OnChanges {

  @Input() conceptIntegrationEntryList: ConceptIntegrationEntry[] = [];

  @Input() canEdit = false;

  @Input() isLoading = false;

  @Output() conceptIntegrationEntriesTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['itemCode', 'itemName', 'subledgerAccount', 'sectorCode', 'operator'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<ConceptIntegrationEntry>;

  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.conceptIntegrationEntryList) {
      this.dataSource = new MatTableDataSource(this.conceptIntegrationEntryList);
      this.resetColumns();
    }
  }


  onUpdateButtonClicked(conceptIntegrationEntry: ConceptIntegrationEntry) {
    if (this.canEdit && window.getSelection().toString().length <= 0) {
      sendEvent(this.conceptIntegrationEntriesTableEvent,
        ConceptIntegrationEntriesTableEventType.UPDATE_BUTTON_CLICKED, {conceptIntegrationEntry});
    }
  }


  onRemoveButtonClicked(event, conceptIntegrationEntry: ConceptIntegrationEntry) {
    event.stopPropagation();

    const message = this.getConfirmMessage(conceptIntegrationEntry);

    this.messageBox.confirm(message, 'Eliminar integración', 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.conceptIntegrationEntriesTableEvent,
            ConceptIntegrationEntriesTableEventType.REMOVE_BUTTON_CLICKED, {conceptIntegrationEntry});
        }
      });
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canEdit) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(conceptIntegrationEntry: ConceptIntegrationEntry): string {
    return `
      <table style='margin: 0;'>
        <tr><td class='nowrap'>Clave / Cuenta: </td><td><strong>
          ${conceptIntegrationEntry.itemCode}
        </strong></td></tr>

        <tr><td class='nowrap'>Descripción: </td><td><strong>
          ${conceptIntegrationEntry.itemName}
        </strong></td></tr>

        <tr><td class='nowrap'>Auxiliar: </td><td><strong>
          ${!!conceptIntegrationEntry.subledgerAccount.trim() ?
            conceptIntegrationEntry.subledgerAccount : '-'}
        </strong></td></tr>
      </table>

     <br>¿Elimino la integración?`;
  }

}
