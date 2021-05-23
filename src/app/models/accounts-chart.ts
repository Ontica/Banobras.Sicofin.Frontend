/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';


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
  ledgers: Ledger[];
}


export enum AccountRole {

  // Summary account (cuenta sumaria)
  Sumaria = 'Sumaria',

  // Posting account (cuenta de detalle)
  Detalle = 'Detalle',

  // Control account (cuenta de control que se maneja a nivel auxiliar)
  Control = 'Control',

  // Sectorized account (cuenta que maneja sector, con o sin auxiliares)
  Sectorizada = 'Sectorizada',

}


export enum SectorRole {

  // Sectorized Posting account (cuenta sectorizada de detalle, sin auxiliares)
  Detalle = 'Detalle',

  // Sectorized Control account (cuenta sectorizada con auxiliares)
  Control = 'Control',

}


export enum DebtorCreditorType {

  // Debtor account (cuenta de naturaleza deudora)
  Deudora = 'Deudora',

  // Creditor account (cuenta de naturaleza acreedora)
  Acreedora = 'Acreedora',

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
  description: string;
  type: string;
  role: AccountRole;
  debtorCreditor: DebtorCreditorType;   // naturaleza
  level: number;
  obsolete: boolean;
}


export const EmptyAccountDescriptor: AccountDescriptor = {
  uid: 'Empty',
  number: '',
  name: '',
  description: '',
  type: '',
  role: null,
  debtorCreditor: null,
  level: 0,
  obsolete: false
};


export interface Account extends AccountDescriptor {
  startDate: DateString;
  endDate: DateString;
  accountsChart: Identifiable;
  areaRules: AreaRule[];
  currencyRules: CurrencyRule[];
  sectorRules: SectorRule[];
  ledgerRules: LedgerRule[];
  history: AccountHistory[];
}


export const EmptyAccount: Account = {
  uid: 'Empty',
  number: '',
  name: '',
  description: '',
  type: '',
  role: null,
  debtorCreditor: null,
  level: 0,
  obsolete: false,
  startDate: '',
  endDate: '',
  accountsChart: Empty,
  areaRules: [],
  currencyRules: [],
  sectorRules: [],
  ledgerRules: [],
  history: [],
};


export interface AccountsSearchCommand {
  date?: DateString;
  keywords?: string;
  ledger?: string;
  fromAccount?: string;
  toAccount?: string;
  level?: number;
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

export interface AccountHistory {
  uID: string;
  number: string;
  name: string;
  description: string;
  type: string;
  role: AccountRole;
  debtorCreditor: DebtorCreditorType;
  startDate: string;
  endDate: string;
}

export interface Currency {
  uid: string;
  name: string;
  fullName: string;
  code: string;
  abbrev: string;
  symbol: string;
}


export interface Sector {
  uid: string;
  name: string;
  fullName: string;
  code: string;
}


export interface AreaRule {
  uID: string;
  areaCodePattern: string;
  startDate: DateString;
  endDate: DateString;
}


export interface CurrencyRule {
  uid: string;
  currency: Currency;
  startDate: DateString;
  endDate: DateString;
}


export interface LedgerRule {
  uid: string;
  ledger: Identifiable;
  startDate: DateString;
  endDate: DateString;
}


export interface SectorRule {
  uid: string;
  sector: Sector;
  sectorRole: SectorRole;
  startDate: DateString;
  endDate: DateString;
}


export interface Ledger {
  uID: string;
  name: string;
  fullName: string;
  number: string;
  subnumber: string;
  subsidiaryAccountsPrefix: string;
  accountsChart: Identifiable;
  baseCurrency: Identifiable;
}


export function getLevelsListFromPattern(accountsPattern: string,
                                         accountNumberSeparator: string,
                                         maxAccountLevel: number) {
  if (!accountsPattern || !accountNumberSeparator || !maxAccountLevel) {
    return [];
  }

  return Array.from({length: maxAccountLevel}, (value, key) => key + 1)
              .map(level => ({
                uid: level,
                name: `Nivel ${level}: ${getAccountPatternFromLevel(accountsPattern,
                                                                    accountNumberSeparator,
                                                                    level)}`,
              }));
}


function getAccountPatternFromLevel(accountsPattern: string,
                                    accountNumberSeparator: string,
                                    level: number){
  return accountsPattern.split(accountNumberSeparator, level).join(accountNumberSeparator);
}
