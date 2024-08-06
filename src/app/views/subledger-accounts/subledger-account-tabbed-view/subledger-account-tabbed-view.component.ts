/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { EmptySubledgerAccount, SubledgerAccount } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import {
  SubledgerAccountEditorEventType
} from '../subledger-account-editor/subledger-account-editor.component';


export enum SubledgerAccountTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'SubledgerAccountTabbedViewComponent.Event.CloseButtonClicked',
  SUBLEDGER_ACCOUNT_UPDATED = 'SubledgerAccountTabbedViewComponent.Event.SubledgerAccountUpdated',
  SUBLEDGER_ACCOUNT_DELETED = 'SubledgerAccountTabbedViewComponent.Event.SubledgerAccountDeleted',
}

@Component({
  selector: 'emp-fa-subledger-account-tabbed-view',
  templateUrl: './subledger-account-tabbed-view.component.html',
})
export class SubledgerAccountTabbedViewComponent implements OnChanges {

  @Input() subledgerAccount: SubledgerAccount = EmptySubledgerAccount;

  @Output() subledgerAccountTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  onClose() {
    sendEvent(this.subledgerAccountTabbedViewEvent, SubledgerAccountTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onSubledgerAccountEditorEvent(event: EventInfo) {
    switch (event.type as SubledgerAccountEditorEventType) {

      case SubledgerAccountEditorEventType.SUBLEDGER_ACCOUNT_UPDATED:
        Assertion.assertValue(event.payload.subledgerAccount, 'event.payload.subledgerAccount');
        sendEvent(this.subledgerAccountTabbedViewEvent,
          SubledgerAccountTabbedViewEventType.SUBLEDGER_ACCOUNT_UPDATED, event.payload);
        return;

      case SubledgerAccountEditorEventType.SUBLEDGER_ACCOUNT_DELETED:
        Assertion.assertValue(event.payload.subledgerAccount, 'event.payload.subledgerAccount');
        sendEvent(this.subledgerAccountTabbedViewEvent,
          SubledgerAccountTabbedViewEventType.SUBLEDGER_ACCOUNT_DELETED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    this.title = `${this.subledgerAccount.number}: ${this.subledgerAccount.name}`;
    this.hint = this.subledgerAccount.ledger.name;

    if (this.subledgerAccount.suspended) {
      this.hint += '<span class="tag tag-error tag-small"">Suspendido</span>';
    }
  }

}
