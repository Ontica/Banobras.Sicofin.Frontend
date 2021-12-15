/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { SubledgerDataService } from '@app/data-services';

import { EmptySubledgerAccount, EmptySearchSubledgerAccountCommand, EmptySubledgerAccountDataTable,
         SubledgerAccountDescriptor, SearchSubledgerAccountCommand, SubledgerAccountDataTable,
         SubledgerAccount, mapSubledgerAccountDescriptorFromSubledgerAccount} from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ArrayLibrary } from '@app/shared/utils';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

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
  subledgerAccountCommand: SearchSubledgerAccountCommand =
    Object.assign({}, EmptySearchSubledgerAccountCommand);
  subledgerAccountData: SubledgerAccountDataTable = Object.assign({}, EmptySubledgerAccountDataTable);
  exportData = '';
  selectedSubledgerAccount: SubledgerAccount = EmptySubledgerAccount;

  isLoading = false;
  isLoadingSubledgerAccount = false;
  commandExecuted = false;

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
        this.commandExecuted = true;
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
        Assertion.assertValue(event.payload.subledgerAccountCommand, 'event.payload.subledgerAccountCommand');
        this.subledgerAccountCommand = event.payload.subledgerAccountCommand;
        this.searchSubledgerAccounts(event.payload.subledgerAccountCommand as SearchSubledgerAccountCommand);
        return;
      case SubledgerAccountsViewerEventType.EXPORT_DATA_BUTTON_CLICKED:
        this.setDisplayExportModal(true);
        return;
      case SubledgerAccountsViewerEventType.SELECT_SUBLEDGER_ACCOUNT_CLICKED:
        Assertion.assertValue(event.payload.subledgerAccount, 'event.payload.subledgerAccount');
        Assertion.assertValue(event.payload.subledgerAccount.id, 'event.payload.subledgerAccount.id');

        this.gettSubledgerAccount(event.payload.subledgerAccount.id);
        return;
      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event) {
    switch (event.type as ExportReportModalEventType) {
      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;
      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        this.exportSubledgerAccounts(this.subledgerAccountCommand);
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


  private searchSubledgerAccounts(command: SearchSubledgerAccountCommand) {
    this.subledgerAccountData = Object.assign({}, EmptySubledgerAccountDataTable);
    this.isLoading = true;
    this.commandExecuted = false;

    this.subledgerData.searchSubledgerAccounts(command)
      .toPromise()
      .then(x => {
        this.subledgerAccountData = Object.assign({}, this.subledgerAccountData, {command, entries: x});
      })
      .finally(() => {
        this.isLoading = false;
        this.commandExecuted = true;
      });
  }


  private exportSubledgerAccounts(subledgerAccountCommand: SearchSubledgerAccountCommand) {
    setTimeout(() => {
      this.messageBox.showInDevelopment('Exportar auxiliares', {
        eventType: 'EXPORT_SUBLEDGERS_ACCOUNT',
        subledgerAccountCommand,
      });
      this.exportData = '';
    }, 500);
  }


  private gettSubledgerAccount(idSubledgerAccount: number) {
    this.isLoadingSubledgerAccount = true;

    this.subledgerData.getSubledgerAccount(idSubledgerAccount)
      .toPromise()
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
