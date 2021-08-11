/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion } from '../general/assertion';

import { SessionService } from '../general/session.service';

import { Principal } from './principal';

import { SecurityDataService } from './security-data.service';

import { PrincipalData, SessionToken } from './security-types';


@Injectable()
export class AuthenticationService {

  constructor(private session: SessionService,
              private securityService: SecurityDataService) { }


  async login(userID: string, userPassword: string): Promise<void> {
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
      .then(([x, y]) => this.setSession(x, y))
      .catch((e) => this.handleAuthenticationError(e));
  }


  logout(): Promise<boolean> {
    const principal = this.session.getPrincipal();

    if (!principal.isAuthenticated) {
      return Promise.resolve(false);
    }

    return this.securityService.closeSession()
      .then(() => Promise.resolve(true))
      .finally(() => this.session.clearSession());
  }


  private setSession(sessionToken: SessionToken, principalData: PrincipalData ){
    const principal = new Principal(sessionToken,
                                    principalData.identity,
                                    principalData.claims,
                                    principalData.roles,
                                    principalData.permissions);
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

}
