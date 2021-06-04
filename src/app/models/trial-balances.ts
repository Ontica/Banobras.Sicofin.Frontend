/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion, Identifiable } from '@app/core';

import { AccountRole } from './accounts-chart';


export const TrialBalanceTypeList: Identifiable[] = [
  {uid: 'Traditional', name: 'Balanza tradicional'},
  {uid: 'BalancesByAccount', name: 'Saldo por cuenta'},
  {uid: 'BalancesBySubledgerAccount', name: 'Saldo por auxiliar'},
];


export function getTrialBalanceTypeNameFromUid(trialBalanceTypeUid: string): string {
  const trialBalanceType = TrialBalanceTypeList.filter(x => x.uid === trialBalanceTypeUid);
  if (trialBalanceType && trialBalanceType.length > 0) {
    return trialBalanceType[0].name;
  }

  throw Assertion.assertNoReachThisCode(`Unhandled trial balance type for uid '${trialBalanceTypeUid}'.`);
}


export const BalancesType: Identifiable[] = [
  {uid: 'AllAccounts', name: 'Todas las cuentas'},
  {uid: 'WithCurrentBalance', name: 'Cuentas con saldo actual'},
  {uid: 'WithCurrenBalanceOrMovements', name: 'Cuentas con saldo actual o movimientos'},
  {uid: 'WithMovements', name: 'Cuentas con movimientos'}
];


export interface TrialBalanceCommand {
  trialBalanceType: string;
  accountsChartUID: string;
  fromDate: string;
  toDate: string;
  consolidated: boolean;
  ledgers?: string[];
  sectors?: string[];
  fromAccount?: string;
  toAccount?: string;
  level?: number;
  balancesType?: string;
  subledgerAccount?: string;
  exchangeRateDate?: string;
  exchangeRateTypeUID?: string;
  valuateToCurrrencyUID?: string;
}


export const EmptyTrialBalanceCommand: TrialBalanceCommand = {
  trialBalanceType: '',
  accountsChartUID: '',
  fromDate: '',
  toDate: '',
  consolidated: false,
  ledgers: [],
  sectors: [],
  fromAccount: '',
  toAccount: '',
  level: 0,
  balancesType: '',
  subledgerAccount: '',
  exchangeRateDate: '',
  exchangeRateTypeUID: '',
  valuateToCurrrencyUID: '',
};


export interface TrialBalance {
  command: TrialBalanceCommand;
  entries: TrialBalanceEntry[];
}


export interface TrialBalanceEntry {
  itemType: string;
  ledgerUID: string;
  currencyUID: string;
  ledgerAccountId: number;
  accountNumber: string;
  accountName: string;
  accountRole: AccountRole;
  accountLevel: number;
  sectorCode: string;
  initialBalance: number;
  debit: number;
  credit: number;
  currentBalance: number;
}


export const EmptyTrialBalance: TrialBalance = {
  command: EmptyTrialBalanceCommand,
  entries: [],
};
