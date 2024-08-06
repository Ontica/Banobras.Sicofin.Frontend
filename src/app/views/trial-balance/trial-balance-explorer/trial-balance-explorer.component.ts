/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { TrialBalanceViewerEventType } from '../trial-balance-viewer/trial-balance-viewer.component';

import { EmptySubledgerAccount, SubledgerAccount } from '@app/models';

export type TrialBalanceQueryType = 'TrialBalance' | 'Balance' | 'SubledgerAccount';


@Component({
  selector: 'emp-fa-trial-balance-explorer',
  templateUrl: './trial-balance-explorer.component.html',
})
export class TrialBalanceExplorerComponent {

  @Input() queryType: TrialBalanceQueryType = 'TrialBalance';

  @Input() subledgerAccount: SubledgerAccount = EmptySubledgerAccount;

  displayAccountStatementViewer = false;

  query = null;

  selectedEntry = null;


  get showFluid(): boolean {
    return ['Balance'].includes(this.queryType);
  }


  get showExplorer(): boolean {
    return ['Balance', 'TrialBalance'].includes(this.queryType);
  }


  onTrialBalanceViewerEvent(event: EventInfo) {
    switch (event.type as TrialBalanceViewerEventType) {
      case TrialBalanceViewerEventType.SELECT_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');

        this.query = event.payload.query;
        this.selectedEntry = event.payload.entry;
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
    this.query = null;
    this.selectedEntry = null;
  }

}
