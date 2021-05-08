/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';


export enum AccountRole {

  // Summary account (cuenta sumaria)
  Summary = 'Summary',

  // Posting account (cuenta de detalle)
  Posting = 'Posting',

  // Control account (cuenta de control que se maneja a nivel auxiliar)
  Control = 'Control',

  // Sectorized account (cuenta que maneja sector, con o sin auxiliares)
  Sectorized = 'Sectorized'

}


export enum DebtorCreditorType {

  // Debtor account (cuenta de naturaleza deudora)
  Debtor = 'Debtor',

  // Creditor account (cuenta de naturaleza acreedora)
  Creditor = 'Creditor'
}


export function getAccountRoleNameFromAccountRole(accountRole: AccountRole) {
  switch (accountRole) {
    case AccountRole.Summary:
      return 'Sumaria';
    case AccountRole.Posting:
      return 'Detalle';
    case AccountRole.Control:
      return 'Control';
    case AccountRole.Sectorized:
      return 'Sectorizada';
    default:
      return accountRole;
      // throw Assertion.assertNoReachThisCode(`Unhandled name for account role '${accountRole}'.`);
  }
}


export function getTypeNameFromDebtorCreditorType(debtorCreditorType: DebtorCreditorType) {
  switch (debtorCreditorType) {
    case DebtorCreditorType.Debtor:
      return 'Deudora';
    case DebtorCreditorType.Creditor:
      return 'Acreedora';
    default:
      return debtorCreditorType;
      // throw Assertion.assertNoReachThisCode(`Unhandled name for debtor creditor type '${debtorCreditorType}'.`);
  }
}


export interface AccountsChart {
  uid: string;
  name: string;
  accountsPattern: string;
  accounts: AccountDescriptor[];
}


export const EmptyAccountsChart: AccountsChart = {
  uid: 'Empty',
  name: '',
  accountsPattern: '',
  accounts: [],
};


export interface AccountDescriptor {
  uid: string;
  number: string;
  name: string;
  type: string;
  role: AccountRole;
  debtorCreditor: DebtorCreditorType;
}


export interface AccountsSearchCommand {
  date: DateString;
  keywords?: string;
  fromAccount: string;
  toAccount: string;
  level: number;
  types?: string[];
  roles?: AccountRole[];
  sectors?: string[];
  currencies?: string[];
}


export const EmptyAccountsSearchCommand: AccountsSearchCommand = {
  date: '',
  keywords: '',
  fromAccount: '',
  toAccount: '',
  level: null,
  types: [],
  roles: [],
  sectors: [],
  currencies: [],
};
