/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion, Identifiable } from '@app/core';

import { AccountRole } from './accounts-chart';


export const TrialBalanceTypeList: Identifiable[] = [
  {uid: 'AnaliticoDeCuentas', name: 'Analítico de cuentas'},
  {uid: 'Balanza', name: 'Balanza tradicional'},
  {uid: 'BalanzaConAuxiliares', name: 'Balanza tradicional con auxiliares'},
  {uid: 'SaldosPorCuentaYMayor', name: 'Balanza consolidada con cuentas en cascada'},
  {uid: 'SaldosPorCuenta', name: 'Saldos por cuenta y auxiliar'},
  {uid: 'SaldosPorAuxiliar', name: 'Saldos por auxiliar'},
];


export function getTrialBalanceTypeNameFromUid(trialBalanceTypeUid: string): string {
  const trialBalanceType = TrialBalanceTypeList.filter(x => x.uid === trialBalanceTypeUid);
  if (trialBalanceType && trialBalanceType.length > 0) {
    return trialBalanceType[0].name;
  }

  throw Assertion.assertNoReachThisCode(`Unhandled trial balance type for uid '${trialBalanceTypeUid}'.`);
}


export enum BalancesType {
  AllAccounts = 'AllAccounts',
  WithCurrentBalance = 'WithCurrentBalance',
  WithCurrentBalanceOrMovements = 'WithCurrentBalanceOrMovements',
  WithMovements = 'WithMovements'
}


export const BalancesTypeList: Identifiable[] = [
  {uid: 'AllAccounts', name: 'Todas las cuentas'},
  {uid: 'WithCurrentBalance', name: 'Cuentas con saldo actual'},
  {uid: 'WithCurrentBalanceOrMovements', name: 'Cuentas con saldo actual o movimientos'},
  {uid: 'WithMovements', name: 'Cuentas con movimientos'}
];


export interface TrialBalanceCommand {
  accountsChartUID: string;
  balancesType?: string;
  consolidateBalancesToTargetCurrency?: boolean;
  showCascadeBalances: boolean;
  exchangeRateDate?: string;
  exchangeRateTypeUID?: string;
  fromAccount?: string;
  fromDate: string;
  ledgers?: string[];
  level?: number;
  sectors?: string[];
  subledgerAccount?: string;
  toAccount?: string;
  toDate: string;
  trialBalanceType: string;
  valuateToCurrrencyUID?: string;
}


export const EmptyTrialBalanceCommand: TrialBalanceCommand = {
  accountsChartUID: '',
  balancesType: '',
  consolidateBalancesToTargetCurrency: false,
  showCascadeBalances: false,
  exchangeRateDate: '',
  exchangeRateTypeUID: '',
  fromAccount: '',
  fromDate: '',
  ledgers: [],
  level: 0,
  sectors: [],
  subledgerAccount: '',
  toAccount: '',
  toDate: '',
  trialBalanceType: '',
  valuateToCurrrencyUID: '',
};


export interface DataTableColumn {
  field: string;
  title: string;
  type: string;
}


export interface TrialBalance {
  command: TrialBalanceCommand;
  columns: DataTableColumn[];
  entries: TrialBalanceEntry[];
}


export type TrialBalanceItemType = 'BalanceEntry' | 'BalanceSummary' | 'BalanceTotalGroupDebtor' |
  'BalanceTotalGroupCreditor' | 'BalanceTotalDebtor' | 'BalanceTotalCreditor' | 'BalanceTotalCurrency' |
  'BalanceTotalConsolidated';


export interface TrialBalanceEntry {
  itemType: TrialBalanceItemType;
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
  columns: [],
  entries: [],
};
