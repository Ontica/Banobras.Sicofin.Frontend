/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { SubledgerDataService } from '@app/data-services';

import { SubledgerAccountFields } from '@app/models';

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

  constructor(private subledgerData: SubledgerDataService) {}


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
        this.createSubledgerAccount(event.payload.subledgerAccount as SubledgerAccountFields);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createSubledgerAccount(subledgerAccountFields: SubledgerAccountFields) {
    this.submitted = true;

    this.subledgerData.createSubledgerAccount(subledgerAccountFields)
      .firstValue()
      .then(x => {
        sendEvent(this.subledgerAccountCreatorEvent,
          SubledgerAccountCreatorEventType.SUBLEDGER_ACCOUNT_CREATED, {subledgerAccount: x});
        this.onClose();
      })
      .finally(() => this.submitted = false);
  }

}
