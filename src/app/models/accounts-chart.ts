/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';


export interface AccountsChartMasterData {
  uid: string;
  name: string;
  accountsPattern: string;
  accountNumberSeparator: string;
  maxAccountLevel: number;
  startDate: string;
  endDate: string;
  accountRoles: AccountRole[];
  accountTypes: Identifiable[];
  currencies: Currency[];
  sectors: Sector[];
}


export enum AccountRole {

  // Summary account (cuenta sumaria)
  Sumaria = 'Sumaria',

  // Posting account (cuenta de detalle)
  Detalle = 'Detalle',

  // Control account (cuenta de control que se maneja a nivel auxiliar)
  Control = 'Control',

  // Sectorized account (cuenta que maneja sector, con o sin auxiliares)
  Sectorizada = 'Sectorizada'

}


export enum DebtorCreditorType {

  // Debtor account (cuenta de naturaleza deudora)
  Deudora = 'Deudora',

  // Creditor account (cuenta de naturaleza acreedora)
  Acreedora = 'Acreedora'

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
  debtorCreditor: DebtorCreditorType;   // naturaleza
  level: number;
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


export interface Currency {
  uid: string;
  name: string;
  code: string;
  abbrev: string;
  symbol: string;
}


export interface Sector {
  uid: string;
  name: string;
  code: string;
}
