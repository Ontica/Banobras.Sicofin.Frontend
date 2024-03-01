/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { AccessControlDataService } from '@app/data-services';

import { UpdateCredentialsFields} from '@app/models';

import {
  ChangePasswordFormEventType
} from '@app/views/_security/user-change-password/change-password-form.component';

@Component({
  selector: 'emp-ng-change-password-modal',
  templateUrl: './change-password-modal.component.html',
})
export class ChangePasswordModalComponent  {

  @Output() closeEvent = new EventEmitter<void>();

  submitted = false;


  constructor(private accessControlData: AccessControlDataService,
              private messageBox: MessageBoxService) {

  }


  onClose() {
    this.closeEvent.emit();
  }


  onChangePasswordFormEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as ChangePasswordFormEventType) {
      case ChangePasswordFormEventType.CHANGE_PASSWORD:
        Assertion.assertValue(event.payload.credentialsFields, 'event.payload.credentialsFields');
        this.updateCredentialsToSubject(event.payload.credentialsFields as UpdateCredentialsFields);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateCredentialsToSubject(fields: UpdateCredentialsFields) {
    this.submitted = true;

    this.accessControlData.updateCredentialsToSubject(fields)
      .firstValue()
      .then(x => {
        this.messageBox.show('La contraseña fue actualizada correctamente.', 'Cambiar contraseña');
        this.onClose();
      })
      .finally(() => this.submitted = false);
  }

}
