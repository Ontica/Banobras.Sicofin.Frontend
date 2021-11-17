/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { SubledgerDataService } from '@app/data-services';

import { EmptySearchSubledgerAccountCommand, EmptySubledgerAccountDataTable, SearchSubledgerAccountCommand,
         SubledgerAccountDataTable } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

import {
  SubledgerAccountCreatorEventType
} from '@app/views/subledger-accounts/subledger-account-creator/subledger-account-creator.component';

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

  isLoading = false;
  commandExecuted = false;

  displaySubledgerAccountCreator = false;
  displayExportModal = false;

  constructor(private subledgerData: SubledgerDataService,
              private messageBox: MessageBoxService){}


  onSubledgerAccountCreatorEvent(event: EventInfo) {
    switch (event.type as SubledgerAccountCreatorEventType) {
      case SubledgerAccountCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displaySubledgerAccountCreator = false;
        return;
      case SubledgerAccountCreatorEventType.SUBLEDGER_ACCOUNT_CREATED:
        Assertion.assertValue(event.payload.subledgerAccount, 'event.payload.subledgerAccount');
        console.log(event.payload.subledgerAccount);
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
        console.log(this.subledgerAccountCommand);
        this.searchSubledgerAccounts(event.payload.subledgerAccountCommand as SearchSubledgerAccountCommand);
        return;
      case SubledgerAccountsViewerEventType.EXPORT_DATA_BUTTON_CLICKED:
        this.setDisplayExportModal(true);
        return;
      case SubledgerAccountsViewerEventType.SELECT_SUBLEDGER_ACCOUNT_CLICKED:
        Assertion.assertValue(event.payload.subledgerAccount, 'event.payload.subledgerAccount');
        console.log(event.payload.subledgerAccount);
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


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.exportData = '';
  }

}
