/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { SubledgerDataService } from '@app/data-services';

import { EmptySubledgerAccount, SubledgerAccount, SubledgerAccountFields } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { SubledgerAccountHeaderEventType } from '../subledger-account-header/subledger-account-header.component';

export enum SubledgerAccountEditorEventType {
  SUBLEDGER_ACCOUNT_UPDATED = 'SubledgerAccountEditorComponent.Event.SubledgerAccountUpdated',
  SUBLEDGER_ACCOUNT_DELETED  = 'SubledgerAccountEditorComponent.Event.SubledgerAccountDeleted',
}

@Component({
  selector: 'emp-fa-subledger-account-editor',
  templateUrl: './subledger-account-editor.component.html',
})
export class SubledgerAccountEditorComponent {

  @Input() subledgerAccount: SubledgerAccount = EmptySubledgerAccount;

  @Output() subledgerAccountEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;

  constructor(private subledgerData: SubledgerDataService,
              private messageBox: MessageBoxService) {}


  get canEditSubledgerAccount(): boolean {
    return true;
  }


  onSubledgerAccountHeaderEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as SubledgerAccountHeaderEventType) {

      case SubledgerAccountHeaderEventType.UPDATE_SUBLEDGER_ACCOUNT:
        Assertion.assertValue(event.payload.subledgerAccount, 'event.payload.subledgerAccount');
        this.updateSubledgerAccount(event.payload.subledgerAccount as SubledgerAccountFields);
        return;

      case SubledgerAccountHeaderEventType.SUSPEND_SUBLEDGER_ACCOUNT:
        this.suspendSubledgerAccount();
        return;

      case SubledgerAccountHeaderEventType.DELETE_SUBLEDGER_ACCOUNT:
        this.deleteSubledgerAccount();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateSubledgerAccount(subledgerAccountFields: SubledgerAccountFields) {
    this.submitted = true;

    this.subledgerData.updateSubledgerAccount(this.subledgerAccount.id, subledgerAccountFields)
      .toPromise()
      .then(x => {
        sendEvent(this.subledgerAccountEditorEvent, SubledgerAccountEditorEventType.SUBLEDGER_ACCOUNT_UPDATED,
          {subledgerAccount: x});
      })
      .finally(() => this.submitted = false);
  }


  private suspendSubledgerAccount() {
    this.messageBox.showInDevelopment('Suspender auxiliar', {
      eventType: 'SUSPEND_SUBLEDGER_ACCOUNT',
      subledgerAccount: this.subledgerAccount,
    });
    // this.submitted = true;
    // setTimeout(() => {
    //   sendEvent(this.subledgerAccountEditorEvent,
    //             SubledgerAccountEditorEventType.SUBLEDGER_ACCOUNT_UPDATED,
    //     {subledgerAccount: {}});
    //   this.submitted = false
    // }, 500);
  }


  private deleteSubledgerAccount() {
    this.messageBox.showInDevelopment('Eliminar auxiliar', {
      eventType: 'DELETE_SUBLEDGER_ACCOUNT',
      subledgerAccount: this.subledgerAccount,
    });
    // this.submitted = true;
    // setTimeout(() => {
    //   sendEvent(this.subledgerAccountEditorEvent, SubledgerAccountEditorEventType.SUBLEDGER_ACCOUN_DELETED,
    //     {subledgerAccount: this.subledgerAccount});
    //   this.submitted = false
    // }, 500);
  }

}
