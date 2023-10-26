/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { AccountsListEntry, AccountsListType, ConciliacionDerivadosEntry, DepreciacionActivoFijoEntry,
         SwapsCoberturaEntry } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import {
  AccountListEntryEditorEventType
} from '../account-list-entry-editor/account-list-entry-editor.component';

export enum AccountListEntryTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'AccountListEntryTabbedViewComponent.Event.CloseButtonClicked',
  ENTRY_UPDATED        = 'AccountListEntryTabbedViewComponent.Event.EntryUpdated',
  ENTRY_DELETED        = 'AccountListEntryTabbedViewComponent.Event.EntryDeleted',
}

@Component({
  selector: 'emp-fa-account-list-entry-tabbed-view',
  templateUrl: './account-list-entry-tabbed-view.component.html',
})
export class AccountListEntryTabbedViewComponent implements OnChanges {

  @Input() accountsList: Identifiable = null;

  @Input() accountListEntry: AccountsListEntry = null;

  @Output() accountListEntryTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  get conciliacionDerivadosEntry(): ConciliacionDerivadosEntry {
    return this.accountListEntry as ConciliacionDerivadosEntry;
  }


  get swapsCoberturaEntry(): SwapsCoberturaEntry {
    return this.accountListEntry as SwapsCoberturaEntry;
  }


  get depreciacionActivoFijoEntry(): DepreciacionActivoFijoEntry {
    return this.accountListEntry as DepreciacionActivoFijoEntry;
  }


  onClose() {
    sendEvent(this.accountListEntryTabbedViewEvent, AccountListEntryTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onAccountListEntryEditorEvent(event: EventInfo) {
    switch (event.type as AccountListEntryEditorEventType) {

      case AccountListEntryEditorEventType.ENTRY_UPDATED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        sendEvent(this.accountListEntryTabbedViewEvent,
          AccountListEntryTabbedViewEventType.ENTRY_UPDATED, event.payload);
        return;

      case AccountListEntryEditorEventType.ENTRY_DELETED:
        Assertion.assertValue(event.payload.entryUID, 'event.payload.entryUID');
        sendEvent(this.accountListEntryTabbedViewEvent,
          AccountListEntryTabbedViewEventType.ENTRY_DELETED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    this.hint = this.accountsList.name;

    switch (this.accountsList.uid) {
      case AccountsListType.ConciliacionDerivados:
        this.title = `${this.conciliacionDerivadosEntry.accountNumber}: ` +
          `${this.conciliacionDerivadosEntry.accountName}`;
        break;

      case AccountsListType.SwapsCobertura:
        this.title = `${this.swapsCoberturaEntry.subledgerAccountNumber}: ` +
          `${this.swapsCoberturaEntry.subledgerAccountName}`;

        this.hint += `<span class="tag tag-small nowrap">${this.swapsCoberturaEntry.classification}</span>`;
        break;

      case AccountsListType.DepreciacionActivoFijo:
        this.title = `${this.depreciacionActivoFijoEntry.auxiliarHistorico}: ` +
          `${this.depreciacionActivoFijoEntry.auxiliarHistoricoNombre}`;

        this.hint += `<span class="tag tag-small nowrap">` +
          `(${this.depreciacionActivoFijoEntry.numeroDelegacion}) ` +
          `${this.depreciacionActivoFijoEntry.delegacion}</span>`;
        break;

      default:
        break;
    }
  }

}
