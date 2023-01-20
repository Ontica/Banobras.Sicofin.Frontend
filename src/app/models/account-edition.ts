/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { Account, AccountRole, EmptyAccount, SectorRole } from './accounts-chart';


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


export const AccountRoleList: AccountRole[] = [
   AccountRole.Sumaria,
   AccountRole.Detalle,
];



export function getAccountMainRole(role: AccountRole, usesSector: boolean, usesSubledger: boolean): AccountRole {
  if (role === AccountRole.Sumaria) {
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


export function getAccountRole(role: AccountRole): AccountRole {
  return role === AccountRole.Sumaria ? AccountRole.Sumaria : AccountRole.Detalle;
}


export function getAccountRoleDescription(role: AccountRole, usesSector: boolean, usesSubledger: boolean): string {
  if (role === AccountRole.Sumaria) {
    return AccountRole.Sumaria;
  }

  let roleName: string = 'De ' + AccountRole.Detalle.toLowerCase();

  if (usesSector) {
    roleName += ', ' + AccountRole.Sectorizada.toLowerCase();
  }

  if (usesSubledger) {
    roleName += ' con auxiliares';
  } else {
    roleName += ' sin auxiliares';
  }

  return roleName;
}


export enum AccountEditionCommandType {
  CreateAccount  = 'CreateAccount',
  UpdateAccount  = 'UpdateAccount',
  DeleteAccount  = 'DeleteAccount',
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
  // {uid: AccountDataToBeUpdated.AccountType,    name: 'Cambiar tipo de cuenta'},
  // {uid: AccountDataToBeUpdated.DebtorCreditor, name: 'Cambiar naturaleza'},
  {uid: AccountDataToBeUpdated.Currencies,     name: 'Cambiar monedas'},
  {uid: AccountDataToBeUpdated.Sectors,        name: 'Cambiar lista de sectores'},
];


export interface AccountFields {
  accountNumber: string;
  name: string;
  description: string;
  accountTypeUID: string;
  debtorCreditor: string;
  role: AccountRole;
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
  command: AccountEditionCommand;
  commited: boolean;
  actions: string[];
  issues: string[];
  warnings: string[];
  message?: string;
  outcome?: Account;
}


export const EmptyAccountEditionResult: AccountEditionResult = {
  command: EmptyAccountEditionCommand,
  commited: false,
  actions: [],
  issues: [],
  warnings: [],
  message: '',
  outcome: EmptyAccount,
};


export interface AccountItem {
  uid: string;
  fullName: string;
  startDate?: DateString;
  endDate?: DateString;
  role?: string;
}
