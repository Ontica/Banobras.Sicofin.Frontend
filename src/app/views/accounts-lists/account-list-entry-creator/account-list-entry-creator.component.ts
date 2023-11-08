/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { AccountsListEntry, AccountsListEntryFields, AccountsListType } from '@app/models';

import { AccountsListsDataService } from '@app/data-services';

import { sendEvent } from '@app/shared/utils';

import {
  ConciliacionDerivadosEntryHeaderEventType
} from '../account-list-entry-edition/conciliacion-derivados-entry-header.component';

import {
  DepreciacionActivoFijoEntryHeaderEventType
} from '../account-list-entry-edition/depreciacion-activo-fijo-entry-header.component';

import {
  PrestamosInterbancariosEntryHeaderEventType
} from '../account-list-entry-edition/prestamos-interbancarios-entry-header.component';

import {
  SwapsCoberturaEntryHeaderEventType
} from '../account-list-entry-edition/swaps-cobertura-entry-header.component';


export enum AccountListEntryCreatorEventType {
  CLOSE_MODAL_CLICKED = 'AccountListEntryCreatorComponent.Event.CloseModalClicked',
  ENTRY_CREATED       = 'AccountListEntryCreatorComponent.Event.EntryCreated',
}

@Component({
  selector: 'emp-fa-account-list-entry-creator',
  templateUrl: './account-list-entry-creator.component.html',
})
export class AccountListEntryCreatorComponent {

  @Input() accountsList: Identifiable = null;

  @Output() accountListEntryCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;

  accountsListEntryFields: AccountsListEntryFields;

  isFormValid = false;

  AccountsListType = AccountsListType;


  constructor(private accountsListsData: AccountsListsDataService) { }


  onClose() {
    sendEvent(this.accountListEntryCreatorEvent, AccountListEntryCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onConciliacionDerivadosEntryHeaderEvent(event: EventInfo) {
    switch (event.type as ConciliacionDerivadosEntryHeaderEventType) {

      case ConciliacionDerivadosEntryHeaderEventType.CREATE_ENTRY:
        Assertion.assertValue(event.payload.entryFields, 'event.payload.entryFields');
        this.addAccountListEntry(AccountsListType.ConciliacionDerivados,
                                 event.payload.entryFields as AccountsListEntry);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDepreciacionActivoFijoEntryHeaderEvent(event: EventInfo) {
    switch (event.type as DepreciacionActivoFijoEntryHeaderEventType) {

      case DepreciacionActivoFijoEntryHeaderEventType.CREATE_ENTRY:
        Assertion.assertValue(event.payload.entryFields, 'event.payload.entryFields');
        this.addAccountListEntry(AccountsListType.DepreciacionActivoFijo,
                                 event.payload.entryFields as AccountsListEntry);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onPrestamosInterbancariosEntryHeaderEvent(event: EventInfo) {
    switch (event.type as PrestamosInterbancariosEntryHeaderEventType) {

      case PrestamosInterbancariosEntryHeaderEventType.CREATE_ENTRY:
        Assertion.assertValue(event.payload.entryFields, 'event.payload.entryFields');
        this.addAccountListEntry(AccountsListType.PrestamosInterbancarios,
                                 event.payload.entryFields as AccountsListEntry);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSwapsCoberturaEntryHeaderEvent(event: EventInfo) {
    switch (event.type as SwapsCoberturaEntryHeaderEventType) {

      case SwapsCoberturaEntryHeaderEventType.CREATE_ENTRY:
        Assertion.assertValue(event.payload.entryFields, 'event.payload.entryFields');
        this.addAccountListEntry(AccountsListType.SwapsCobertura,
                                 event.payload.entryFields as AccountsListEntry);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private addAccountListEntry(type: AccountsListType, entryFields: AccountsListEntry) {
    this.submitted = true;

    this.accountsListsData.addAccountListEntry(type, entryFields)
      .firstValue()
      .then(x => this.resolveAccountListEntryCreated(x))
      .finally(() => this.submitted = false);
  }


  private resolveAccountListEntryCreated(entry: AccountsListEntry) {
    sendEvent(this.accountListEntryCreatorEvent, AccountListEntryCreatorEventType.ENTRY_CREATED, { entry });
    this.onClose();
  }

}
