/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableCommand, DataTableEntry } from './data-table';

import { ExchangeRate } from './exchange-rates';


export enum TrialBalanceType {
  AnaliticoDeCuentas                = 'AnaliticoDeCuentas',
  Balanza                           = 'Balanza',
  BalanzaValorizadaComparativa      = 'BalanzaValorizadaComparativa',
  BalanzaValorizadaEnDolares        = 'BalanzaValorizadaEnDolares',
  SaldosPorCuenta                   = 'SaldosPorCuenta',
  SaldosPorAuxiliar                 = 'SaldosPorAuxiliar',
  BalanzaConContabilidadesEnCascada = 'BalanzaConContabilidadesEnCascada',
  BalanzaConsolidadaPorMoneda       = 'BalanzaConsolidadaPorMoneda'
}


export const TrialBalanceTypeList: Identifiable[] = [
  {uid: TrialBalanceType.AnaliticoDeCuentas,                name: 'Analítico de cuentas'},
  {uid: TrialBalanceType.BalanzaConContabilidadesEnCascada, name: 'Balanza con contabilidades en cascada'},
  {uid: TrialBalanceType.BalanzaValorizadaComparativa,      name: 'Balanza de comparación entre períodos'},
  {uid: TrialBalanceType.Balanza,                           name: 'Balanza tradicional'},
  {uid: TrialBalanceType.BalanzaConsolidadaPorMoneda,       name: 'Balanza consolidada en moneda origen'},
  {uid: TrialBalanceType.BalanzaValorizadaEnDolares,        name: 'Balanza valorizada en dólares'},
  {uid: TrialBalanceType.SaldosPorAuxiliar,                 name: 'Saldos por auxiliar'},
  {uid: TrialBalanceType.SaldosPorCuenta,                   name: 'Saldos por cuenta'},
];


export enum BalancesType {
  AllAccounts = 'AllAccounts',
  WithCurrentBalance = 'WithCurrentBalance',
  WithCurrentBalanceOrMovements = 'WithCurrentBalanceOrMovements',
  WithMovements = 'WithMovements'
}


export const BalancesTypeList: Identifiable[] = [
  {uid: 'WithCurrentBalanceOrMovements', name: 'Cuentas con saldo actual o movimientos'},
  {uid: 'WithCurrentBalance', name: 'Cuentas con saldo actual'},
  {uid: 'WithMovements', name: 'Cuentas con movimientos'},
  {uid: 'AllAccounts', name: 'Todas las cuentas'}
];


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


export interface TrialBalance extends DataTable {
  command: TrialBalanceCommand;
  columns: DataTableColumn[];
  entries: TrialBalanceEntry[];
}


export interface TrialBalanceCommand extends DataTableCommand {
  accountsChartUID: string;
  balancesType?: string;
  consolidateBalancesToTargetCurrency?: boolean;
  finalPeriod?: TrialBalanceCommandPeriod;
  fromAccount?: string;
  initialPeriod?: TrialBalanceCommandPeriod;
  ledgers?: string[];
  level?: number;
  sectors?: string[];
  showCascadeBalances?: boolean;
  subledgerAccount?: string;
  toAccount?: string;
  trialBalanceType: TrialBalanceType;
  useDefaultValuation?: boolean;
  useValuation?: boolean;
  withAverageBalance?: boolean;
  withSectorization?: boolean;
  withSubledgerAccount?: boolean;
}


export interface TrialBalanceEntry extends DataTableEntry {
  uid: string;
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
    withAverageBalance: false,
    withSectorization: false,
    withSubledgerAccount: false,
  };
}


export const EmptyTrialBalance: TrialBalance = {
  command: getEmptyTrialBalanceCommand(),
  columns: [],
  entries: [],
};
