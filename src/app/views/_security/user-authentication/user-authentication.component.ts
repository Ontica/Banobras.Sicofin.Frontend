/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { APP_CONFIG } from '@app/main-layout';

export enum UserAuthenticationEventType {
  CHANGE_PASSWORD_REQUIRED = 'UserAuthenticationComponent.Event.ChangePasswordRequired',
}

export enum AuthenticationModes {
  Login          = 'Login',
  ChangePassword = 'ChangePassword',
}

@Component({
  selector: 'emp-ng-user-authentication',
  templateUrl: './user-authentication.component.html',
  styleUrls: ['./user-authentication.component.scss'],
})
export class UserAuthenticationComponent {

  appLayoutData = APP_CONFIG.data;

  currentAuthenticationMode: AuthenticationModes = AuthenticationModes.Login;

  AuthenticationModes = AuthenticationModes;


  onLoginEvent() {
    this.currentAuthenticationMode = AuthenticationModes.ChangePassword;
  }


  onChangePasswordEvent() {
    this.currentAuthenticationMode = AuthenticationModes.Login;
  }

}
