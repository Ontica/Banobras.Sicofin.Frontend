/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { TrialBalanceViewerEventType } from '../trial-balance-viewer/trial-balance-viewer.component';

@Component({
  selector: 'emp-fa-trial-balance-explorer',
  templateUrl: './trial-balance-explorer.component.html',
})
export class TrialBalanceExplorerComponent {

  @Input() isQuickQuery = false;

  displayAccountStatementViewer = false;

  command = null;

  entrySelected = null;


  onTrialBalanceViewerEvent(event: EventInfo) {
    switch (event.type as TrialBalanceViewerEventType) {
      case TrialBalanceViewerEventType.SELECT_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');

        this.command = event.payload.command;
        this.entrySelected = event.payload.entry;
        this.displayAccountStatementViewer = true;

        return;

      case TrialBalanceViewerEventType.UNSELECT_ENTRY:
        this.onCloseAccountStatementViewer();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseAccountStatementViewer() {
    this.displayAccountStatementViewer = false;
    this.command = null;
    this.entrySelected = null;
  }

}
