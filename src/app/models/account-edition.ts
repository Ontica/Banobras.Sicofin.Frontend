/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { Account, EmptyAccount, SectorRole } from './accounts-chart';

export enum AccountEditionCommandType {
  CreateAccount = 'CreateAccount',
  UpdateAccount = 'UpdateAccount',
  RemoveAccount = 'RemoveAccount',
  AddCurrencies = 'AddCurrencies',
  AddSectors    = 'AddSectors',
  RemoveCurrencies = 'RemoveCurrencies',
  RemoveSectors = 'RemoveSectors',
}


export const AccountEditionTypeList: Identifiable[] = [
  {uid: AccountEditionCommandType.UpdateAccount,    name: 'Actualizar la cuenta'},
  {uid: AccountEditionCommandType.AddCurrencies,    name: 'Agregar monedas'},
  {uid: AccountEditionCommandType.RemoveCurrencies, name: 'Eliminar monedas'},
  {uid: AccountEditionCommandType.AddSectors,       name: 'Agregar sectores'},
  {uid: AccountEditionCommandType.RemoveSectors,    name: 'Eliminar sectores'},
  {uid: AccountEditionCommandType.RemoveAccount,    name: 'Eliminar la cuenta'},
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
  commandType: AccountEditionCommandType,
  dryRun: boolean;
  applicationDate: DateString;
  accountsChartUID: string;
  accountUID?: string;
  accountFields?: AccountFields;
  currencies?: string[];
  sectors?: SectorField[];
}


export interface SectorField {
  uid: string;
  role: SectorRole;
}


export const EmptyAccountEditionCommand: AccountEditionCommand = {
  commandType: AccountEditionCommandType.CreateAccount,
  dryRun: true,
  applicationDate: null,
  accountsChartUID: '',
};


export interface AccountEditionResult {
  actions: string[];
  issues: string[];
  account: Account;
  command: AccountEditionCommand;
}


export const EmptyAccountEditionResult: AccountEditionResult = {
  actions: [],
  issues: [],
  account: EmptyAccount,
  command: EmptyAccountEditionCommand,
};
