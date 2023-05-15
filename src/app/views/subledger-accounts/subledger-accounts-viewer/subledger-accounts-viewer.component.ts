/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { EmptySubledgerAccountDataTable, SubledgerAccountDataTable } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { DataTableEventType } from '@app/views/reports-controls/data-table/data-table.component';

import { SubledgerAccountsFilterEventType} from './subledger-accounts-filter.component';

export enum SubledgerAccountsViewerEventType {
  CREATE_SUBLEDGER_ACCOUNT_BUTTON_CLICKED = 'SubledgerAccountsViewerComponent.Event.CreateSubledgerAccounButtonClicked',
  SEARCH_SUBLEDGERS_ACCOUNT_CLICKED = 'SubledgerAccountsViewerComponent.Event.SearchSubledgersAccountClicked',
  EXPORT_DATA_BUTTON_CLICKED = 'SubledgerAccountsViewerComponent.Event.ExportDataButtonClicked',
  SELECT_SUBLEDGER_ACCOUNT_CLICKED = 'SubledgerAccountsViewerComponent.Event.SelectSubledgerAccountClicked',
}

@Component({
  selector: 'emp-fa-subledger-accounts-viewer',
  templateUrl: './subledger-accounts-viewer.component.html',
})
export class SubledgerAccountsViewerComponent implements OnChanges {

  @Input() subledgerAccountData: SubledgerAccountDataTable =
    Object.assign({}, EmptySubledgerAccountDataTable);

  @Input() queryExecuted = false;

  @Input() isLoading = false;

  @Output() subledgerAccountsViewerEvent = new EventEmitter<EventInfo>();

  accountChartName = '';

  cardHint = 'Seleccionar los filtros';

  permissions = PERMISSIONS;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.subledgerAccountData) {
      this.setText();
    }
  }


  onCreateSubledgerAccountClicked() {
    sendEvent(this.subledgerAccountsViewerEvent,
      SubledgerAccountsViewerEventType.CREATE_SUBLEDGER_ACCOUNT_BUTTON_CLICKED);
  }


  onSubledgerAccountsFilterEvent(event) {
    switch (event.type as SubledgerAccountsFilterEventType) {

      case SubledgerAccountsFilterEventType.SEARCH_SUBLEDGER_ACCOUNTS_CLICKED:
        Assertion.assertValue(event.payload.accountChartName, 'event.payload.accountChartName');
        Assertion.assertValue(event.payload.subledgerAccountQuery, 'event.payload.subledgerAccountQuery');

        this.accountChartName = event.payload.accountChartName;
        sendEvent(this.subledgerAccountsViewerEvent,
          SubledgerAccountsViewerEventType.SEARCH_SUBLEDGERS_ACCOUNT_CLICKED,
          {subledgerAccountQuery: event.payload.subledgerAccountQuery});
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubledgerAccountsTableEvent(event) {
    switch (event.type as DataTableEventType) {

      case DataTableEventType.COUNT_FILTERED_ENTRIES:
        Assertion.assertValue(event.payload.displayedEntriesMessage, 'event.payload.displayedEntriesMessage');
        this.setText(event.payload.displayedEntriesMessage as string);
        return;

      case DataTableEventType.EXPORT_DATA:
        sendEvent(this.subledgerAccountsViewerEvent,
          SubledgerAccountsViewerEventType.EXPORT_DATA_BUTTON_CLICKED);
        return;

      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        sendEvent(this.subledgerAccountsViewerEvent,
          SubledgerAccountsViewerEventType.SELECT_SUBLEDGER_ACCOUNT_CLICKED,
          {subledgerAccount: event.payload.entry});
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
      this.cardHint = `${this.accountChartName} - ${displayedEntriesMessage}`;
      return;
    }

    this.cardHint =
      `${this.accountChartName} - ${this.subledgerAccountData.entries.length} registros encontrados`;
  }

}
