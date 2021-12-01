/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { TrialBalanceViewerEventType } from '../trial-balance-viewer/trial-balance-viewer.component';

@Component({
  selector: 'emp-fa-trial-balance-explorer',
  templateUrl: './trial-balance-explorer.component.html',
})
export class TrialBalanceExplorerComponent {

  @Input() isQuickQuery = false;

  @Output() closeEvent = new EventEmitter<void>();


  onTrialBalanceViewerEvent(event: EventInfo) {
    switch (event.type as TrialBalanceViewerEventType) {
      case TrialBalanceViewerEventType.CLOSE_BUTTON_CLICKED:
        this.closeEvent.emit();
        return;

      case TrialBalanceViewerEventType.SELECT_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        console.log('SELECT_ENTRY_CLICKED', event.payload);
        return;

      case TrialBalanceViewerEventType.UNSELECT_ENTRY:
        console.log('UNSELECT_ENTRY');
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
