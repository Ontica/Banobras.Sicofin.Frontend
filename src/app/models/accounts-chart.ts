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
}


export enum AccountRole {

  // Summary account (cuenta sumaria)
  Sumaria,

  // Posting account (cuenta de detalle)
  Detalle,

  // Control account (cuenta de control que se maneja a nivel auxiliar)
  Control,

  // Sectorized account (cuenta que maneja sector, con o sin auxiliares)
  Sectorizada,

}


export enum SectorRole {

  // Sectorized Posting account (cuenta sectorizada de detalle, sin auxiliares)
  Detalle,

  // Sectorized Control account (cuenta sectorizada con auxiliares)
  Control,

}


export enum DebtorCreditorType {

  // Debtor account (cuenta de naturaleza deudora)
  Deudora,

  // Creditor account (cuenta de naturaleza acreedora)
  Acreedora,

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


export const EmptyAccountDescriptor: AccountDescriptor = {
  uid: 'Empty',
  number: '',
  name: '',
  type: '',
  role: null,
  debtorCreditor: null,
  level: 0,
};


export interface Account extends AccountDescriptor {
  accountsChart: Identifiable;
  areaRules: AreaRule[];
  currencyRules: CurrencyRule[];
  sectorRules: SectorRule[];
  ledgerRules: LedgerRule[];
}


export const EmptyAccount: Account = {
  uid: 'Empty',
  number: '',
  name: '',
  type: '',
  role: null,
  debtorCreditor: null,
  level: 0,
  accountsChart: Empty,
  areaRules: [],
  currencyRules: [],
  sectorRules: [],
  ledgerRules: [],
};


export interface AccountsSearchCommand {
  date?: DateString;
  keywords?: string;
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
