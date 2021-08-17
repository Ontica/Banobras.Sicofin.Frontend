/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion, DateString, Identifiable } from '@app/core';

import { AccountRole } from './accounts-chart';

import { ExchangeRate } from './exchange-rates';


export enum TrialBalanceType {
  AnaliticoDeCuentas           = 'AnaliticoDeCuentas',
  Balanza                      = 'Balanza',
  BalanzaValorizadaComparativa = 'BalanzaValorizadaComparativa',
  SaldosPorCuenta              = 'SaldosPorCuenta',
  SaldosPorAuxiliar            = 'SaldosPorAuxiliar',
  SaldosPorCuentaYMayor        = 'SaldosPorCuentaYMayor',
}


export const TrialBalanceTypeList: Identifiable[] = [
  {uid: TrialBalanceType.AnaliticoDeCuentas,           name: 'Analítico de cuentas'},
  {uid: TrialBalanceType.SaldosPorCuentaYMayor,        name: 'Balanza con contabilidades en cascada'},
  {uid: TrialBalanceType.BalanzaValorizadaComparativa, name: 'Balanza de comparación entre periodos'},
  {uid: TrialBalanceType.Balanza,                      name: 'Balanza tradicional'},
  {uid: TrialBalanceType.SaldosPorAuxiliar,            name: 'Saldos por auxiliar'},
  {uid: TrialBalanceType.SaldosPorCuenta,              name: 'Saldos por cuenta'},
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
  trialBalanceType: TrialBalanceType;
  useDefaultValuation?: boolean;
  useValuation?: boolean;
  withSubledgerAccount?: boolean;
}


export interface TrialBalanceCommandPeriod {
  exchangeRateDate?: DateString;
  exchangeRateTypeUID?: string;
  fromDate?: DateString;
  toDate?: DateString;
  valuateToCurrrencyUID?: string;
  exchangeRatesList?: ExchangeRate[];
}


export const EmptyTrialBalanceCommandPeriod: TrialBalanceCommandPeriod = {
  exchangeRateDate: '',
  exchangeRateTypeUID: '',
  fromDate: '',
  toDate: '',
  valuateToCurrrencyUID: '',
  exchangeRatesList: [],
};


export function resetExchangeRateValues(period: TrialBalanceCommandPeriod) {
  period.exchangeRateDate = '';
  period.exchangeRateTypeUID = '';
  period.valuateToCurrrencyUID = '';
}


export function mapToValidTrialBalanceCommandPeriod(
period: TrialBalanceCommandPeriod, useDefaultValuation: boolean): TrialBalanceCommandPeriod {
  const trialBalanceCommandPeriod: TrialBalanceCommandPeriod = {
    fromDate: period.fromDate,
    toDate: period.toDate
  };

  if (!useDefaultValuation) {
    trialBalanceCommandPeriod.exchangeRateDate =  period.exchangeRateDate;
    trialBalanceCommandPeriod.exchangeRateTypeUID =  period.exchangeRateTypeUID;
    trialBalanceCommandPeriod.valuateToCurrrencyUID =  period.valuateToCurrrencyUID;
  }

  return trialBalanceCommandPeriod;
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
    trialBalanceType: null,
    useDefaultValuation: true,
    useValuation: false,
    withSubledgerAccount: false,
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
