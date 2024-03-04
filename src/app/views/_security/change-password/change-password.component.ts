/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { APP_CONFIG } from '@app/main-layout';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { UpdateCredentialsFields } from '@app/models';

import { ChangePasswordFormEventType } from './change-password-form.component';

export enum ChangePasswordEventType {
  CHANGE_PASSWORD = 'ChangePasswordComponent.Event.ChangePassword',
}

@Component({
  selector: 'emp-ng-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  @Output() changePasswordEvent = new EventEmitter<EventInfo>();

  appLayoutData = APP_CONFIG.data;

  submitted = false;


  constructor(private messageBox: MessageBoxService) {

  }


  onChangePasswordFormEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as ChangePasswordFormEventType) {
      case ChangePasswordFormEventType.CHANGE_PASSWORD:
        Assertion.assertValue(event.payload.credentialsFields, 'event.payload.credentialsFields');
        this.updateCredentials(event.payload.credentialsFields as UpdateCredentialsFields);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateCredentials(fields: UpdateCredentialsFields) {
    this.submitted = true;

    setTimeout(() => {
      this.resolveUpdateCredentials();
      this.submitted = false;
    }, 600);
  }


  private resolveUpdateCredentials() {
    this.messageBox.showInDevelopment('Cambiar contraseña');
    sendEvent(this.changePasswordEvent, ChangePasswordEventType.CHANGE_PASSWORD);
  }

}
