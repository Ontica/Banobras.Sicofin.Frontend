/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { AccountsListsDataService} from '@app/data-services';

import { AccountsListEntry, AccountsListType } from '@app/models';

import {
  ConciliacionDerivadosEntryHeaderEventType
} from '../account-list-entry-edition/conciliacion-derivados-entry-header.component';

import {
  DepreciacionActivoFijoEntryHeaderEventType
} from '../account-list-entry-edition/depreciacion-activo-fijo-entry-header.component';

export enum AccountListEntryEditorEventType {
  ENTRY_UPDATED = 'AccountListEntryEditorComponent.Event.EntryUpdated',
  ENTRY_DELETED = 'AccountListEntryEditorComponent.Event.EntryDeleted',
}

@Component({
  selector: 'emp-fa-account-list-entry-editor',
  templateUrl: './account-list-entry-editor.component.html',
})
export class AccountListEntryEditorComponent {

  @Input() accountsList: Identifiable = null;

  @Input() accountListEntry: AccountsListEntry = null;

  @Output() accountListEntryEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;

  AccountsListType = AccountsListType;


  constructor(private accountsListsData: AccountsListsDataService) { }


  get isSaved(): boolean {
    return !isEmpty(this.accountListEntry);
  }


  onConciliacionDerivadosEntryHeaderEvent(event: EventInfo) {
    switch (event.type as ConciliacionDerivadosEntryHeaderEventType) {

      case ConciliacionDerivadosEntryHeaderEventType.UPDATE_ENTRY:
        Assertion.assertValue(event.payload.entryUID, 'event.payload.entryUID');
        Assertion.assertValue(event.payload.entryFields, 'event.payload.entryFields');
        this.updateAccountListEntry(AccountsListType.ConciliacionDerivados,
                                    event.payload.entryUID,
                                    event.payload.entryFields as AccountsListEntry);
        return;

      case ConciliacionDerivadosEntryHeaderEventType.DELETE_ENTRY:
        Assertion.assertValue(event.payload.entryUID, 'event.payload.entryUID');
        Assertion.assertValue(event.payload.entryFields, 'event.payload.entryFields');
        this.deleteAccountListEntry(AccountsListType.ConciliacionDerivados,
                                    event.payload.entryUID,
                                    event.payload.entryFields as AccountsListEntry);
          return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDepreciacionActivoFijoEntryHeaderEvent(event: EventInfo) {
    switch (event.type as DepreciacionActivoFijoEntryHeaderEventType) {

      case DepreciacionActivoFijoEntryHeaderEventType.UPDATE_ENTRY:
        Assertion.assertValue(event.payload.entryUID, 'event.payload.entryUID');
        Assertion.assertValue(event.payload.entryFields, 'event.payload.entryFields');
        this.updateAccountListEntry(AccountsListType.DepreciacionActivoFijo,
                                    event.payload.entryUID,
                                    event.payload.entryFields as AccountsListEntry);
        return;

      case DepreciacionActivoFijoEntryHeaderEventType.DELETE_ENTRY:
        Assertion.assertValue(event.payload.entryUID, 'event.payload.entryUID');
        Assertion.assertValue(event.payload.entryFields, 'event.payload.entryFields');
        this.deleteAccountListEntry(AccountsListType.DepreciacionActivoFijo,
                                    event.payload.entryUID,
                                    event.payload.entryFields as AccountsListEntry);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateAccountListEntry(type: AccountsListType, entryUID: string, entryFields: AccountsListEntry) {
    this.submitted = true;

    this.accountsListsData.updateAccountListEntry(type, entryUID, entryFields)
      .firstValue()
      .then(x => this.resolveAccountListEntryUpdated(x))
      .finally(() => this.submitted = false);
  }


  private deleteAccountListEntry(type: AccountsListType, entryUID: string, entryFields: AccountsListEntry) {
    this.submitted = true;

    this.accountsListsData.deleteAccountListEntry(type, entryUID, entryFields)
      .firstValue()
      .then(x => this.resolveAccountListEntryDeleted(entryUID))
      .finally(() => this.submitted = false);
  }


  private resolveAccountListEntryUpdated(entry: AccountsListEntry) {
    sendEvent(this.accountListEntryEditorEvent, AccountListEntryEditorEventType.ENTRY_UPDATED, { entry });
  }


  private resolveAccountListEntryDeleted(entryUID: string) {
    sendEvent(this.accountListEntryEditorEvent, AccountListEntryEditorEventType.ENTRY_DELETED, { entryUID });
  }

}
