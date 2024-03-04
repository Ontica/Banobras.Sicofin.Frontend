/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { APP_CONFIG, CHANGE_PASSWORD_PATH, DEFAULT_ROUTE, DEFAULT_PATH, getAllPermissions, ROUTES_LIST,
         UNAUTHORIZED_PATH } from '@app/main-layout';

import { ACCESS_PROBLEM_MESSAGE, INVALID_CREDENTIALS_MESSAGE,
         NOT_ACTIVE_CREDENTIALS_MESSAGE } from '../errors/error-messages';

import { Assertion } from '../general/assertion';

import { SessionService } from '../general/session.service';

import { SecurityDataService } from './security-data.service';

import { resolve } from '../data-types';

import { Principal } from './principal';

import { FakeSessionToken, PrincipalData, SessionToken, getFakePrincipalData } from './security-types';


enum LoginErrorType {
  InvalidUserCredentials = 'SecurityException.InvalidUserCredentials',
  NotActiveUser          = 'SecurityException.NotActiveUser',
  UserPasswordExpired    = 'SecurityException.UserPasswordExpired',
  MustChangePassword     = 'SecurityException.MustChangePassword',
};


export enum LoginErrorActionType {
  ChangePassword = 'ChangePassword',
  None           = 'None',
}

export interface LoginErrorAction {
  actionType: LoginErrorActionType;
  message: string;
}


@Injectable()
export class AuthenticationService {

  constructor(private session: SessionService,
              private securityService: SecurityDataService) { }


  async login(userID: string, userPassword: string): Promise<string> {
    Assertion.assertValue(userID, 'userID');
    Assertion.assertValue(userPassword, 'userPassword');

    const sessionToken = await this.createSession(userID, userPassword)
      .then(x => {
        this.session.setSessionToken(x);
        return x;
      })
      .catch((e) => this.handleAuthenticationError(e));

    const principal = this.getPrincipal(userID);

    return Promise.all([sessionToken, principal])
      .then(([x, y]) => {
        this.setSession(x, y);
        return this.session.getPrincipal().defaultRoute;
      })
      .catch((e) => this.handleAuthenticationError(e));
  }


  logout(): Promise<boolean> {
    if (!this.session.getPrincipal().isAuthenticated) {
      this.session.clearSession();
      return Promise.resolve(false);
    }

    return this.closeSession()
      .then(() => Promise.resolve(true))
      .finally(() => this.session.clearSession());
  }


  clearSession() {
    // TODO: clear presentation state
    this.session.clearSession();
  }


  private createSession(userID: string, userPassword: string): Promise<SessionToken> {
    return APP_CONFIG.security.fakeLogin ? resolve(FakeSessionToken) :
      this.securityService.createSession(userID, userPassword);
  }


  private getPrincipal(userID: string): Promise<PrincipalData> {
    return APP_CONFIG.security.fakeLogin ? resolve(getFakePrincipalData(userID)) :
      this.securityService.getPrincipal();
  }


  private setSession(sessionToken: SessionToken, principalData: PrincipalData){
    if (!APP_CONFIG.security.enablePermissions) {
      principalData.permissions = getAllPermissions();
    }

    const defaultRoute = this.getDefaultRoute(principalData.permissions,
                                              principalData.changePasswordRequired);

    const principal = new Principal(sessionToken,
                                    principalData.identity,
                                    principalData.permissions,
                                    defaultRoute);

    this.session.setPrincipal(principal);
  }


  private handleAuthenticationError(error): Promise<any> {
    if (error.status === 401) {

      if ([LoginErrorType.MustChangePassword,
           LoginErrorType.UserPasswordExpired].includes(error.error.code)) {

        return Promise.reject(this.getLoginErrorAction(LoginErrorActionType.ChangePassword,
          NOT_ACTIVE_CREDENTIALS_MESSAGE));

      }

      return Promise.reject(this.getLoginErrorAction(LoginErrorActionType.None,
        INVALID_CREDENTIALS_MESSAGE));

    } else {

      return Promise.reject(this.getLoginErrorAction(LoginErrorActionType.None,
        `${ACCESS_PROBLEM_MESSAGE}: ${error.status} ${error.statusText} ${error.message}`));

    }
  }


  private getLoginErrorAction(actionType: LoginErrorActionType, message: string) {
    const loginErrorAction: LoginErrorAction = {
      actionType,
      message
    };

    return loginErrorAction;
  }


  private getDefaultRoute(permissions: string[], changePasswordRequired: boolean): string {
    if (changePasswordRequired) {
      return CHANGE_PASSWORD_PATH;
    }

    if (permissions.includes(DEFAULT_ROUTE.permission)) {
      return DEFAULT_PATH;
    }

    const routesValid = this.getValitRoutes(permissions);

    if (routesValid.length > 0) {
      for (const route of ROUTES_LIST) {
        if (route.permission === routesValid[0]) {
          return route.parent + '/' + route.path;
        }
      }
    }

    return UNAUTHORIZED_PATH;
  }


  private getValitRoutes(permissions): string[] {
    return permissions ? permissions.filter(x => x.startsWith('route-')) : [];
  }


  private closeSession(): Promise<void> {
    return APP_CONFIG.security.fakeLogin ? resolve(null) : this.securityService.closeSession();
  }

}
