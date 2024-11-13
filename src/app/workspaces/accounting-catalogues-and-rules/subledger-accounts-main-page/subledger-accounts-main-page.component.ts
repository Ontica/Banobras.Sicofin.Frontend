/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { SubledgerDataService } from '@app/data-services';

import { EmptySubledgerAccount, EmptySubledgerAccountQuery, EmptySubledgerAccountDataTable,
         SubledgerAccountDescriptor, SubledgerAccountQuery, SubledgerAccountDataTable,
         SubledgerAccount, mapSubledgerAccountDescriptorFromSubledgerAccount} from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ArrayLibrary } from '@app/shared/utils';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';

import {
  SubledgerAccountCreatorEventType
} from '@app/views/subledger-accounts/subledger-account-creator/subledger-account-creator.component';

import {
  SubledgerAccountTabbedViewEventType
} from '@app/views/subledger-accounts/subledger-account-tabbed-view/subledger-account-tabbed-view.component';

import {
  SubledgerAccountsViewerEventType
} from '@app/views/subledger-accounts/subledger-accounts-viewer/subledger-accounts-viewer.component';

@Component({
  selector: 'emp-fa-subledger-accounts-main-page',
  templateUrl: './subledger-accounts-main-page.component.html',
})
export class SubledgerAccountsMainPageComponent {
  subledgerAccountQuery: SubledgerAccountQuery =
    Object.assign({}, EmptySubledgerAccountQuery);
  subledgerAccountData: SubledgerAccountDataTable = Object.assign({}, EmptySubledgerAccountDataTable);
  exportData = '';
  selectedSubledgerAccount: SubledgerAccount = EmptySubledgerAccount;

  isLoading = false;
  isLoadingSubledgerAccount = false;
  queryExecuted = false;

  displaySubledgerAccountCreator = false;
  displayExportModal = false;
  displaySubledgerAccountTabbed = false;

  constructor(private subledgerData: SubledgerDataService,
              private messageBox: MessageBoxService){}


  onSubledgerAccountCreatorEvent(event: EventInfo) {
    switch (event.type as SubledgerAccountCreatorEventType) {
      case SubledgerAccountCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displaySubledgerAccountCreator = false;
        return;
      case SubledgerAccountCreatorEventType.SUBLEDGER_ACCOUNT_CREATED:
        Assertion.assertValue(event.payload.subledgerAccount, 'event.payload.subledgerAccount');
        this.insertSubledgerAccountToEntries(event.payload.subledgerAccount);
        this.queryExecuted = true;
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubledgerAccountsViewerEvent(event: EventInfo) {
    switch (event.type as SubledgerAccountsViewerEventType) {
      case SubledgerAccountsViewerEventType.CREATE_SUBLEDGER_ACCOUNT_BUTTON_CLICKED:
        this.displaySubledgerAccountCreator = true;
        return;
      case SubledgerAccountsViewerEventType.SEARCH_SUBLEDGERS_ACCOUNT_CLICKED:
        Assertion.assertValue(event.payload.subledgerAccountQuery, 'event.payload.subledgerAccountQuery');
        this.subledgerAccountQuery = event.payload.subledgerAccountQuery;
        this.setSelectedSubledgerAccount(EmptySubledgerAccount);
        this.searchSubledgerAccounts(event.payload.subledgerAccountQuery as SubledgerAccountQuery);
        return;
      case SubledgerAccountsViewerEventType.EXPORT_DATA_BUTTON_CLICKED:
        this.setDisplayExportModal(true);
        return;
      case SubledgerAccountsViewerEventType.SELECT_SUBLEDGER_ACCOUNT_CLICKED:
        Assertion.assertValue(event.payload.subledgerAccount, 'event.payload.subledgerAccount');
        Assertion.assertValue(event.payload.subledgerAccount.id, 'event.payload.subledgerAccount.id');
        this.getSubledgerAccount(event.payload.subledgerAccount.id);
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
        this.exportSubledgerAccounts(this.subledgerAccountQuery);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubledgerAccountTabbedViewEvent(event: EventInfo) {
    switch (event.type as SubledgerAccountTabbedViewEventType) {
      case SubledgerAccountTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedSubledgerAccount(EmptySubledgerAccount);
        return;
      case SubledgerAccountTabbedViewEventType.SUBLEDGER_ACCOUNT_UPDATED:
        Assertion.assertValue(event.payload.subledgerAccount, 'event.payload.subledgerAccount');
        this.insertSubledgerAccountToEntries(event.payload.subledgerAccount);
        return;
      case SubledgerAccountTabbedViewEventType.SUBLEDGER_ACCOUNT_DELETED:
        Assertion.assertValue(event.payload.subledgerAccount, 'event.payload.subledgerAccount');
        this.removeSubledgerAccountFromEntries(event.payload.subledgerAccount);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchSubledgerAccounts(query: SubledgerAccountQuery) {
    this.subledgerAccountData = Object.assign({}, EmptySubledgerAccountDataTable);
    this.isLoading = true;
    this.queryExecuted = false;

    this.subledgerData.searchSubledgerAccounts(query)
      .firstValue()
      .then(x =>
        this.subledgerAccountData = Object.assign({}, this.subledgerAccountData, {query, entries: x})
      )
      .finally(() => {
        this.isLoading = false;
        this.queryExecuted = true;
      });
  }


  private exportSubledgerAccounts(query: SubledgerAccountQuery) {
    setTimeout(() => {
      this.messageBox.showInDevelopment('Exportar auxiliares', {
        eventType: 'EXPORT_SUBLEDGERS_ACCOUNT', query,
      });
      this.exportData = '';
    }, 500);
  }


  private getSubledgerAccount(idSubledgerAccount: number) {
    this.isLoadingSubledgerAccount = true;

    this.subledgerData.getSubledgerAccount(idSubledgerAccount)
      .firstValue()
      .then(x => this.setSelectedSubledgerAccount(x))
      .finally(() => this.isLoadingSubledgerAccount = false);
  }


  private insertSubledgerAccountToEntries(subledgerAccountSelected: SubledgerAccount) {
    const subledgerAccountToInsert =
      mapSubledgerAccountDescriptorFromSubledgerAccount(subledgerAccountSelected);

    const subledgerAccountEntriesNew =
      ArrayLibrary.insertItemTop(this.subledgerAccountData.entries, subledgerAccountToInsert, 'id');
    this.setSubledgerAccountEntries(subledgerAccountEntriesNew);
    this.setSelectedSubledgerAccount(subledgerAccountSelected);
  }


  private removeSubledgerAccountFromEntries(subledgerAccountDeleted: SubledgerAccount) {
    const subledgerAccountEntriesNew =
      this.subledgerAccountData.entries.filter(x => x.id !== subledgerAccountDeleted.id);
    this.setSubledgerAccountEntries(subledgerAccountEntriesNew);
    this.setSelectedSubledgerAccount(EmptySubledgerAccount);
  }


  private setSelectedSubledgerAccount(subledgerAccount: SubledgerAccount) {
    // The subledgerAccount applies to all account charts, so set query.accountsChartUID as the default.
    subledgerAccount.accountsChartUID = this.subledgerAccountQuery.accountsChartUID;

    this.selectedSubledgerAccount = subledgerAccount;
    this.displaySubledgerAccountTabbed = !!this.selectedSubledgerAccount.id;
  }


  private setSubledgerAccountEntries(entries: SubledgerAccountDescriptor[]) {
    this.subledgerAccountData = Object.assign({}, this.subledgerAccountData, {entries});
  }


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.exportData = '';
  }

}
