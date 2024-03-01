/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { Assertion, EventInfo } from '@app/core';

import { APP_CONFIG } from '@app/main-layout';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { UpdateCredentialsFields } from '@app/models';

import { ChangePasswordFormEventType } from './change-password-form.component';


@Component({
  selector: 'emp-ng-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.scss']
})
export class UserChangePasswordComponent {

  appLayoutData = APP_CONFIG.data;

  submitted = false;


  constructor(private router: Router,
              private messageBox: MessageBoxService) {

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
    this.messageBox.show('La contraseña fue actualizada correctamente.', 'Cambiar contraseña');
    this.router.navigateByUrl('seguridad/login');
  }

}
