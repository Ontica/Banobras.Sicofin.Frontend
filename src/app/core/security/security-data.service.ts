/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Cryptography } from './cryptography';

import { EventInfo } from '../data-types/command';

import { Assertion } from '../general/assertion';

import { HttpHandler } from '../http/http-handler';

import { SessionToken, PrincipalData } from './security-types';


interface ExternalSessionToken {
  readonly access_token: string;
  readonly expires_in: number;
  readonly refresh_token: string;
  readonly token_type: string;
}


@Injectable()
export class SecurityDataService {

  constructor(private httpHandler: HttpHandler) { }

  changePassword(event: EventInfo): Promise<boolean> {
    Assertion.assertValue(event, 'event');

    return this.httpHandler.post<boolean>('v3/security/change-password', event)
                           .toPromise();
  }


  closeSession(): Promise<void> {
    return this.httpHandler.post<void>('v3/security/logout')
               .toPromise();
  }


  async createSession(userID: string, userPassword: string): Promise<SessionToken> {
    const body = {
      userID,
      password: ''
    };

    const token = await this.httpHandler.post<string>('v3/security/login-token', body)
                                        .toPromise();

    body.password = Cryptography.createHash(userPassword);
    body.password = Cryptography.createHash(body.password + token);

    return this.httpHandler.post<ExternalSessionToken>('v3/security/login', body)
      .toPromise()
      .then(x => this.mapToSessionToken(x));
  }


  getPrincipal(): Promise<PrincipalData> {
    return this.httpHandler.get<PrincipalData>('v3/security/principal')
      .toPromise();
  }


  private mapToSessionToken(source: ExternalSessionToken): SessionToken {
    return {
      accessToken: source.access_token,
      expiresIn: source.expires_in,
      refreshToken: source.refresh_token,
      tokenType: source.token_type
    };
  }

}
