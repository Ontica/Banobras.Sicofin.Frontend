/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { AccountRole, SectorRole } from './accounts-chart';


export interface ImportAccountsCommand {
  accountsChartUID: string;
  applicationDate: DateString;
  dryRun: boolean;
}


export interface ImportAccountsResult {
  operation: string;
  count: number;
  errors: number;
  itemsList: string[];
  errorsList: string[];
}


export const EmptyImportAccountsCommand: ImportAccountsCommand = {
  accountsChartUID: '',
  applicationDate: '',
  dryRun: true,
};


export const AccountRoleList: string[] = [
   AccountRole.Sumaria,
   AccountRole.Detalle,
];



export function getAccountRole(mainRole: string, usesSector: boolean, usesSubledger: boolean): AccountRole {
  if (mainRole === AccountRole.Sumaria) {
    return AccountRole.Sumaria;
  }

  if (usesSector) {
    return AccountRole.Sectorizada;
  }

  if (usesSubledger) {
    return AccountRole.Control;
  }

  return AccountRole.Detalle;
}


export enum AccountEditionCommandType {
  CreateAccount  = 'CreateAccount',
  UpdateAccount  = 'UpdateAccount',
  FixAccountName = 'FixAccountName',
}


export function getAccountEditionTypeName(accountEditionTypeUID: AccountEditionCommandType) {
  switch (accountEditionTypeUID) {
    case AccountEditionCommandType.CreateAccount:
      return 'Agregar cuenta'
    case AccountEditionCommandType.FixAccountName:
      return 'Corregir descripción'
    case AccountEditionCommandType.UpdateAccount:
      return 'Actualizar cuenta'
    default:
      return accountEditionTypeUID;
  }
}


export enum AccountDataToBeUpdated {
  Name           = 'Name',
  MainRole       = 'MainRole',
  AccountType    = 'AccountType',
  DebtorCreditor = 'DebtorCreditor',
  Currencies     = 'Currencies',
  Sectors        = 'Sectors',
  SubledgerRole  = 'SubledgerRole',
}


export const AccountDataToBeUpdatedList: Identifiable[] = [
  {uid: AccountDataToBeUpdated.Name,           name: 'Cambiar descripción'},
  {uid: AccountDataToBeUpdated.MainRole,       name: 'Cambiar rol'},
  {uid: AccountDataToBeUpdated.SubledgerRole,  name: 'Cambiar auxiliar'},
  {uid: AccountDataToBeUpdated.AccountType,    name: 'Cambiar tipo de cuenta'},
  {uid: AccountDataToBeUpdated.DebtorCreditor, name: 'Cambiar naturaleza'},
  {uid: AccountDataToBeUpdated.Currencies,     name: 'Cambiar monedas'},
  {uid: AccountDataToBeUpdated.Sectors,        name: 'Cambiar lista de sectores'},
];


export interface AccountFields {
  accountNumber: string;
  name: string;
  description: string;
  accountTypeUID: string;
  debtorCreditor: string;
  role: string;
}


export interface AccountEditionCommand {
  dryRun: boolean;
  commandType: AccountEditionCommandType,
  accountsChartUID: string;
  applicationDate: DateString;
  accountUID?: string;
  dataToBeUpdated?: AccountDataToBeUpdated[];
  accountFields?: AccountFields;
  currencies?: string[];
  sectorRules?: SectorRoleField[];
}


export interface SectorRoleField {
  code: string;
  role: SectorRole;
}


export const EmptyAccountEditionCommand: AccountEditionCommand = {
  dryRun: true,
  commandType: AccountEditionCommandType.CreateAccount,
  accountsChartUID: '',
  applicationDate: null,
};


export interface AccountEditionResult {
  count: number;
  errors: number;
  errorsList: string[];
  itemsList: string[];
  operation: string;

  // actions: string[];
  // issues: string[];
  // command: AccountEditionCommand;
  // outcome: Account;
  // warnings: string[];
}


export const EmptyAccountEditionResult: AccountEditionResult = {
  count: 0,
  errors: 0,
  errorsList: [],
  itemsList: [],
  operation: '',

  // actions: [],
  // issues: [],
  // command: EmptyAccountEditionCommand,
  // outcome: EmptyAccount,
  // warnings: [],
};


export interface AccountItem {
  uid: string;
  fullName: string;
  startDate?: DateString;
  endDate?: DateString;
  role?: string;
}
