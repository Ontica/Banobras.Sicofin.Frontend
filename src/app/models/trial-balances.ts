/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion, DateString, Identifiable } from '@app/core';

import { AccountRole } from './accounts-chart';

import { ExchangeRate } from './exchange-rates';


export const TrialBalanceTypeList: Identifiable[] = [
  {uid: 'BalanzaValorizadaComparativa', name: 'Balanza de comparación entre periodos'},
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
  finalPeriod?: TrialBalanceCommandPeriod;
  fromAccount?: string;
  initialPeriod?: TrialBalanceCommandPeriod;
  ledgers?: string[];
  level?: number;
  sectors?: string[];
  showCascadeBalances: boolean;
  subledgerAccount?: string;
  toAccount?: string;
  trialBalanceType: string;
}


export interface TrialBalanceCommandPeriod {
  exchangeRateDate?: DateString;
  exchangeRateTypeUID?: string;
  fromDate?: DateString;
  toDate?: DateString;
  valuateToCurrrencyUID?: string;

  autoExchangeRatesFromDate?: boolean;
  exchangeRatesList?: ExchangeRate[];
}


export const EmptyTrialBalanceCommandPeriod: TrialBalanceCommandPeriod = {
  fromDate: '',
  toDate: '',
  exchangeRateDate: '',
  exchangeRateTypeUID: '',
  valuateToCurrrencyUID: '',

  autoExchangeRatesFromDate: false,
  exchangeRatesList: [],
};


export function resetExchangeRateValues(period: TrialBalanceCommandPeriod) {
  period.exchangeRateDate = '';
  period.exchangeRateTypeUID = '';
  period.valuateToCurrrencyUID = '';
}


export function mapToValidTrialBalanceCommandPeriod(
period: TrialBalanceCommandPeriod): TrialBalanceCommandPeriod {
  return {
    fromDate: period.fromDate,
    toDate: period.toDate,
    exchangeRateDate: period.exchangeRateDate,
    exchangeRateTypeUID: period.exchangeRateTypeUID,
    valuateToCurrrencyUID: period.valuateToCurrrencyUID,
  };
}


export function getEmptyTrialBalanceCommand(): TrialBalanceCommand {
  return {
    accountsChartUID: '',
    balancesType: '',
    consolidateBalancesToTargetCurrency: false,
    finalPeriod: Object.assign({}, EmptyTrialBalanceCommandPeriod),
    fromAccount: '',
    initialPeriod: Object.assign({}, EmptyTrialBalanceCommandPeriod),
    ledgers: [],
    level: 0,
    sectors: [],
    showCascadeBalances: false,
    subledgerAccount: '',
    toAccount: '',
    trialBalanceType: '',
  };
}


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
  'BalanceTotalConsolidatedByLedger' | 'BalanceTotalConsolidated';


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
  command: getEmptyTrialBalanceCommand(),
  columns: [],
  entries: [],
};
