/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion } from '../general/assertion';

import { ApplicationSettingsService } from './application-settings.service';

import { ApplicationSettings } from './application-settings';

import { Principal } from '../security/principal';

import { KeyValue } from '../data-types/key-value';

import { Identity, SessionToken } from '../security/security-types';

import { LocalStorageService } from './local-storage.service';

import { ROUTES_LIST } from '@app/main-layout';


@Injectable()
export class SessionService {

  private principal: Principal = Principal.empty;

  private data: KeyValue[] = [];

  constructor(private appSettingsService: ApplicationSettingsService,
              private localStorage: LocalStorageService) {
    this.tryToRetrieveStoredPrincipalData();
  }


  getSettings(): Promise<ApplicationSettings> {
    return this.appSettingsService.getApplicationSettings();
  }


  getSessionToken(): SessionToken {
    return this.localStorage.get<SessionToken>('sessionToken');
  }


  setSessionToken(sessionToken: SessionToken) {
    this.localStorage.set<SessionToken>('sessionToken', sessionToken);
  }


  getPrincipal(): Principal {
    return this.principal;
  }


  setPrincipal(principal: Principal) {
    Assertion.assertValue(principal, 'principal');

    this.principal = principal;
    this.setPrincipalToLocalStorage();
  }


  clearSession() {
    this.principal = Principal.empty;
    this.localStorage.removeAll();
  }


  getData<T>(key: string): T {
    Assertion.assertValue(key, 'key');

    const index = this.data.findIndex((x) => x.key === key);

    if (index !== -1) {
      return this.data[index].value as T;
    } else {
      throw new Error(`'${key}' value is not defined in application session data.`);
    }
  }


  setData<T>(key: string, value: T): void {
    Assertion.assertValue(key, 'key');
    Assertion.assertValue(value, 'value');

    const index = this.data.findIndex((x) => x.key === key);

    if (index !== -1) {
      this.data[index] = { key, value };
    } else {
      this.data.push({ key, value });
    }
  }


  hasPermission(permission: string): boolean {
    return this.principal.permissions &&
      this.principal.permissions.filter(x =>  x === permission).length > 0;
  }


  getFirstValidRouteInModule(permission: string): string {
    const route = ROUTES_LIST.find(x => x.permission === permission);
    const routesInModule = ROUTES_LIST.filter(x => route.parent === x.parent);
    const validRouteInModule = routesInModule.find(x => this.principal.permissions.includes(x.permission));

    if (!!validRouteInModule) {
      return validRouteInModule.parent +  '/' + validRouteInModule.path;
    }

    return null;
  }


  private tryToRetrieveStoredPrincipalData() {
    try {
      this.setPrincipalFromLocalStorage();
    } catch (e) {
      this.clearSession();
      console.log(e);
    }
  }


  private setPrincipalFromLocalStorage() {
    const sessionToken = this.getSessionToken();
    Assertion.assertValue(sessionToken.accessToken, 'sessionToken.accessToken');

    if (!!sessionToken && !!sessionToken.accessToken) {
      const identity =  this.localStorage.get<Identity>('identity') ?? null;
      const permissions = this.localStorage.get<string[]>('permissions') ?? null;
      const defaultRoute = this.localStorage.get<string>('defaultRoute') ?? null;

      Assertion.assert(typeof identity.name === 'string', 'corrupted identity, must be a string.');
      Assertion.assert(permissions instanceof Array, 'corrupted permissions, must be an array of strings.');
      Assertion.assert(typeof defaultRoute === 'string', 'corrupted defaultRoute, must be a string.');

      this.principal = new Principal(sessionToken, identity, permissions, defaultRoute);
    }
  }


  private setPrincipalToLocalStorage() {
    this.localStorage.set<SessionToken>('sessionToken', this.principal.sessionToken);
    this.localStorage.set<Identity>('identity', this.principal.identity);
    this.localStorage.set<string[]>('permissions', this.principal.permissions);
    this.localStorage.set<string>('defaultRoute', this.principal.defaultRoute);
  }

}
