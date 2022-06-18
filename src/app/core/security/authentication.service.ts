/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { APP_CONFIG, DEFAULT_ROUTE, DEFAULT_URL, getAllPermissions, ROUTES_LIST,
         UNAUTHORIZED_ROUTE } from '@app/main-layout';

import { Assertion } from '../general/assertion';

import { SessionService } from '../general/session.service';

import { Principal } from './principal';

import { SecurityDataService } from './security-data.service';

import { PrincipalData, SessionToken } from './security-types';


@Injectable()
export class AuthenticationService {

  constructor(private session: SessionService,
              private securityService: SecurityDataService) { }


  async login(userID: string, userPassword: string): Promise<string> {
    Assertion.assertValue(userID, 'userID');
    Assertion.assertValue(userPassword, 'userPassword');

    const sessionToken = await this.securityService.createSession(userID, userPassword)
      .then(x => {
        this.session.setSessionToken(x);
        return x;
      })
      .catch((e) => this.handleAuthenticationError(e));

    const principal = this.securityService.getPrincipal();

    return Promise.all([sessionToken, principal])
      .then(([x, y]) => {
        this.setSession(x, y);
        return this.session.getPrincipal().defaultRoute;
      })
      .catch((e) => this.handleAuthenticationError(e));
  }


  logout(): Promise<boolean> {
    const principal = this.session.getPrincipal();

    if (!principal.isAuthenticated) {
      this.session.clearSession();
      return Promise.resolve(false);
    }

    return this.securityService.closeSession()
      .then(() => Promise.resolve(true))
      .finally(() => this.session.clearSession());
  }


  private setSession(sessionToken: SessionToken, principalData: PrincipalData){
    if (!APP_CONFIG.layout.enablePermissions) {
      principalData.permissions = getAllPermissions();
    }

    const defaultRoute =  this.getDefaultRoute(principalData.permissions);

    const principal = new Principal(sessionToken,
                                    principalData.identity,
                                    principalData.permissions,
                                    defaultRoute);
    this.session.setPrincipal(principal);
  }


  private handleAuthenticationError(error): Promise<never> {
    if (error.status === 401) {
      return Promise.reject(new Error('El nombre de usuario o contraseña no coinciden con los registrados. ' +
                                      'Favor de intentar nuevamente.'));
    } else {
      return Promise.reject(new Error(`Tuve un problema al intentar acceder al sistema: ` +
        `${error.status} ${error.statusText} ${error.message}`));
    }
  }


  private getDefaultRoute(permissions: string[]): string {
    if (permissions.includes(DEFAULT_ROUTE.permission)) {
      return DEFAULT_URL;
    }

    const routesValid = this.getValitRoutes(permissions);

    if (routesValid.length === 0) {
      return UNAUTHORIZED_ROUTE;
    }

    for (const route of ROUTES_LIST) {
      if (route.permission === routesValid[0]) {
        return route.parent + '/' + route.path;
      }
    }

    return UNAUTHORIZED_ROUTE;
  }


  private getValitRoutes(permissions): string[] {
    return permissions ? permissions.filter(x => x.startsWith('route-')) : [];
  }

}
