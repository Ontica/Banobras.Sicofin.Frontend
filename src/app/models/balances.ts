/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { AccountDescriptor } from './accounts-chart';

import { DataTable, DataTableColumn, DataTableQuery, DataTableEntry } from './data-table';


export interface AccountBalance {
  ledger: Identifiable;
  account: AccountDescriptor;
  sector: Identifiable;
  currentBalance: number;
  currency: Identifiable;
}


export enum BalanceTypes {
  SaldosPorCuentaConsultaRapida   = 'SaldosPorCuentaConsultaRapida',
  SaldosPorAuxiliarConsultaRapida = 'SaldosPorAuxiliarConsultaRapida',
}


export enum FileReportVersion {
  V1 = 'V1',
  V2 = 'V2',
}


export const BalanceTypeList: Identifiable[] = [
  {
    uid: BalanceTypes.SaldosPorCuentaConsultaRapida,
    name: 'Saldos por cuenta',
  },
  {
    uid: BalanceTypes.SaldosPorAuxiliarConsultaRapida,
    name: 'Saldos por auxiliar',
  },
];


export interface Balance extends DataTable {
  query: BalancesQuery;
  columns: DataTableColumn[];
  entries: BalanceEntry[];
}


export const EmptyBalance: Balance = {
  query: getEmptyBalancesQuery(),
  columns: [],
  entries: [],
};


export interface BalanceEntry extends DataTableEntry {
  hasAccountStatement?: boolean;
}


export interface BalancesQuery extends DataTableQuery {
  accountsChartUID: string;
  trialBalanceType: BalanceTypes;
  ledgers: string[];
  balancesType?: string;
  fromAccount?: string;
  initialPeriod?: {
    fromDate?: DateString;
    toDate?: DateString;
  };
  subledgerAccount?: string;
  withSubledgerAccount?: boolean;
  withAllAccounts?: boolean;
  exportTo?: FileReportVersion;
}


export function getEmptyBalancesQuery(): BalancesQuery {
  return {
    accountsChartUID: '',
    trialBalanceType: null,
    ledgers: [],
    balancesType: '',
    fromAccount: '',
    initialPeriod: {fromDate: '', toDate: ''},
    subledgerAccount: '',
    withSubledgerAccount: false,
    withAllAccounts: false,
  };
}


export interface BalanceData {
  balance: Balance;
  balanceType: Identifiable;
  queryExecuted: boolean;
}


export const EmptyBalanceData: BalanceData = {
  balance: EmptyBalance,
  balanceType: null,
  queryExecuted: false,
};
