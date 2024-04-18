/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { AccountsListData, AccountsListEntry, EmptyAccountsListData } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

import { AccountsListsFilterEventType} from './accounts-lists-filter.component';

export enum AccountsListsViewerEventType {
  CREATE_ACCOUNT_BUTTON_CLICKED = 'AccountsListsViewerComponent.Event.CreateAccounButtonClicked',
  SEARCH_ACCOUNTS_CLICKED       = 'AccountsListsViewerComponent.Event.SearchAccountsClicked',
  EXPORT_DATA_BUTTON_CLICKED    = 'AccountsListsViewerComponent.Event.ExportDataButtonClicked',
  SELECT_ACCOUNT_CLICKED        = 'AccountsListsViewerComponent.Event.SelectAccountClicked',
}

@Component({
  selector: 'emp-fa-accounts-lists-viewer',
  templateUrl: './accounts-lists-viewer.component.html',
})
export class AccountsListsViewerComponent implements OnChanges {

  @Input() accountsListData: AccountsListData = Object.assign({}, EmptyAccountsListData);

  @Input() selectedAccountsListEntry: AccountsListEntry = null;

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  @Output() accountsListsViewerEvent = new EventEmitter<EventInfo>();

  accountsListName = '';

  cardHint = 'Seleccionar los filtros';


  ngOnChanges(changes: SimpleChanges) {
    if (changes.accountsListData) {
      this.setText();
    }
  }


  onCreateAccountClicked() {
    if (this.queryExecuted) {
      sendEvent(this.accountsListsViewerEvent, AccountsListsViewerEventType.CREATE_ACCOUNT_BUTTON_CLICKED);
    }
  }


  onAccountsListsFilterEvent(event: EventInfo) {
    switch (event.type as AccountsListsFilterEventType) {

      case AccountsListsFilterEventType.SEARCH_CLICKED:
        Assertion.assertValue(event.payload.accountsList.name, 'event.payload.accountsList.name');
        this.accountsListName = event.payload.accountsList.name;
        sendEvent(this.accountsListsViewerEvent, AccountsListsViewerEventType.SEARCH_ACCOUNTS_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccountsListsTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {

      case DataTableEventType.COUNT_FILTERED_ENTRIES:
        Assertion.assertValue(event.payload.displayedEntriesMessage, 'event.payload.displayedEntriesMessage');
        this.setText(event.payload.displayedEntriesMessage as string);
        return;

      case DataTableEventType.EXPORT_DATA:
        sendEvent(this.accountsListsViewerEvent,
          AccountsListsViewerEventType.EXPORT_DATA_BUTTON_CLICKED);
        return;

      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        sendEvent(this.accountsListsViewerEvent, AccountsListsViewerEventType.SELECT_ACCOUNT_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    if (displayedEntriesMessage) {
      this.cardHint = `${this.accountsListName} - ${displayedEntriesMessage}`;
      return;
    }

    this.cardHint =
      `${this.accountsListName} - ${this.accountsListData.entries.length} registros encontrados`;
  }

}
