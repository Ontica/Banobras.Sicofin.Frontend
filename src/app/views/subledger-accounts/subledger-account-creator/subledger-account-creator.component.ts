/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { SubledgerAccountHeaderEventType } from '../subledger-account-header/subledger-account-header.component';

export enum SubledgerAccountCreatorEventType {
  CLOSE_MODAL_CLICKED = 'SubledgerAccountCreatorComponent.Event.CloseModalClicked',
  SUBLEDGER_ACCOUNT_CREATED = 'SubledgerAccountCreatorComponent.Event.SubledgerAccountCreated',
}

@Component({
  selector: 'emp-fa-subledger-account-creator',
  templateUrl: './subledger-account-creator.component.html',
})
export class SubledgerAccountCreatorComponent {

  @Input() accountsChartUID = '';

  @Input() ledgerUID = '';

  @Output() subledgerAccountCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;

  constructor(private messageBox: MessageBoxService) {}


  onClose() {
    sendEvent(this.subledgerAccountCreatorEvent, SubledgerAccountCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onSubledgerAccountHeaderEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as SubledgerAccountHeaderEventType) {

      case SubledgerAccountHeaderEventType.CREATE_SUBLEDGER_ACCOUNT:
        Assertion.assertValue(event.payload.subledgerAccount, 'event.payload.subledgerAccount');
        this.createSubledgerAccount(event.payload.subledgerAccount);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createSubledgerAccount(subledgerAccountFields: any) {
    this.messageBox.showInDevelopment('Agregar auxiliar', {
      eventType: 'CREATE_SUBLEDGER_ACCOUNT',
      subledgerAccount: subledgerAccountFields,
    });
  }

}
