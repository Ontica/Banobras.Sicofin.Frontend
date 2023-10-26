/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { AccountsListsDataService } from '@app/data-services';

import { AccountsListData, AccountsListEntry, AccountsListQuery, EmptyAccountsListData } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

import {
  AccountsListsViewerEventType
} from '@app/views/accounts-lists/accounts-lists-viewer/accounts-lists-viewer.component';

import {
  AccountListEntryCreatorEventType
} from '@app/views/accounts-lists/account-list-entry-creator/account-list-entry-creator.component';

import {
  AccountListEntryTabbedViewEventType
} from '@app/views/accounts-lists/account-list-entry-tabbed-view/account-list-entry-tabbed-view.component';


@Component({
  selector: 'emp-fa-accounts-lists-main-page',
  templateUrl: './accounts-lists-main-page.component.html',
})
export class AccountsListsMainPageComponent {

  accountsList: Identifiable = null;

  accountsListQuery: AccountsListQuery = null;

  accountsListData: AccountsListData = Object.assign({}, EmptyAccountsListData);

  selectedAccountListEntry: AccountsListEntry = null;

  isLoading = false;

  queryExecuted = false;

  displayAccountCreator = false;

  displayAccountTabbedView = false;

  displayExportModal = false;

  fileUrl = '';


  constructor(private accountsListsData: AccountsListsDataService,
              private messageBox: MessageBoxService ){}


  onAccountListEntryCreatorEvent(event: EventInfo) {
    switch (event.type as AccountListEntryCreatorEventType) {
      case AccountListEntryCreatorEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayAccountCreator(false);
        return;
      case AccountListEntryCreatorEventType.ENTRY_CREATED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        this.refreshAccountsListData(event.payload.entry as AccountsListEntry);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccountsListsViewerEvent(event: EventInfo) {
    switch (event.type as AccountsListsViewerEventType) {
      case AccountsListsViewerEventType.CREATE_ACCOUNT_BUTTON_CLICKED:
        this.setDisplayAccountCreator(true);
        return;
      case AccountsListsViewerEventType.SEARCH_ACCOUNTS_CLICKED:
        Assertion.assertValue(event.payload.accountsList, 'event.payload.accountsList');
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        Assertion.assertValue(event.payload.query.type, 'event.payload.query.type');
        this.accountsList = event.payload.accountsList as Identifiable;
        this.accountsListQuery = event.payload.query as AccountsListQuery;

        this.clearAccountsListData();
        this.searchAccountsList();
        return;
      case AccountsListsViewerEventType.EXPORT_DATA_BUTTON_CLICKED:
        this.setDisplayExportModal(true);
        return;
      case AccountsListsViewerEventType.SELECT_ACCOUNT_CLICKED:
        Assertion.assertValue(event.payload.entry, ' event.payload.entry');
        this.setSelectedAccountListEntry(event.payload.entry as AccountsListEntry);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccountListEntryTabbedViewEvent(event: EventInfo) {
    switch (event.type as AccountListEntryTabbedViewEventType) {
      case AccountListEntryTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedAccountListEntry(null);
        return;
      case AccountListEntryTabbedViewEventType.ENTRY_UPDATED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        this.refreshAccountsListData(event.payload.entry as AccountsListEntry);
        return;
      case AccountListEntryTabbedViewEventType.ENTRY_DELETED:
        Assertion.assertValue(event.payload.entryUID, 'event.payload.entryUID');
        this.refreshAccountsListData(null);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event: EventInfo) {
    switch (event.type as ExportReportModalEventType) {
      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;
      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        this.exportAccountsList();
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchAccountsList() {
    this.isLoading = true;

    this.accountsListsData.searchAccountsLists(this.accountsListQuery.type, this.accountsListQuery.keywords)
      .firstValue()
      .then(x => this.setAccountsListData(x))
      .finally(() => this.isLoading = false);
  }


  private exportAccountsList() {
    setTimeout(() => {
      this.messageBox.showInDevelopment('Exportar lista de cuentas', {
        eventType: 'EXPORT_ACCOUNTS_LIST', query: this.accountsListQuery,
      });
      this.fileUrl = 'dummyurl';
    }, 500);
  }


  private setAccountsListData(data: AccountsListData) {
    this.accountsListData = data;
    this.queryExecuted = true;
  }


  private refreshAccountsListData(entry: AccountsListEntry) {
    this.setSelectedAccountListEntry(entry);
    this.searchAccountsList();
  }


  private clearAccountsListData() {
    this.setSelectedAccountListEntry(null);
    this.accountsListData = Object.assign({}, EmptyAccountsListData);
    this.queryExecuted = false;
  }


  private setDisplayExportModal(display: boolean) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }


  private setDisplayAccountCreator(display: boolean) {
    this.displayAccountCreator = display;
  }


  private setSelectedAccountListEntry(entry: AccountsListEntry) {
    this.selectedAccountListEntry = entry;
    this.displayAccountTabbedView = !isEmpty(entry);
  }

}
