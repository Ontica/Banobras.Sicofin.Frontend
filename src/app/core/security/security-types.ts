/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export interface Identity {
  readonly username: string;
  readonly email: string;
  readonly fullname: string;
  readonly name: string;
}


export interface SessionToken {
  readonly accessToken: string;
  readonly expiresIn: number;
  readonly refreshToken: string;
  readonly tokenType: string;
}


export interface PrincipalData {
  readonly identity: Identity;
  permissions: string[];
  changePasswordRequired: boolean;
}


export const FakeSessionToken: SessionToken = {
  accessToken: 'FakeAccessToken',
  expiresIn: 9999999,
  refreshToken: 'FakeRefreshToken',
  tokenType: 'FakeTokenType',
};


export function getFakePrincipalData(user: string): PrincipalData {
  const fakePrincipalData: PrincipalData = {
    identity: {
      username: user,
      email: user,
      fullname: user,
      name: user,
    },
    permissions: [],
    changePasswordRequired: false,
  };

  return fakePrincipalData;
}
