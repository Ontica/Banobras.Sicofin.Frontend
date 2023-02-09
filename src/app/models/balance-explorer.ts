/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { AccountDescriptor } from './accounts-chart';

import { DataTable, DataTableColumn, DataTableQuery, DataTableEntry } from './data-table';

import { ReportType, ReportTypeFlags } from './reporting';


export interface AccountBalance {
  ledger: Identifiable;
  account: AccountDescriptor;
  sector: Identifiable;
  currentBalance: number;
  currency: Identifiable;
}


export enum BalanceExplorerTypes {
  SaldosPorCuentaConsultaRapida   = 'SaldosPorCuentaConsultaRapida',
  SaldosPorAuxiliarConsultaRapida = 'SaldosPorAuxiliarConsultaRapida',
}


export enum FileReportVersion {
  V1 = 'V1',
  V2 = 'V2',
}


export interface BalanceExplorerResult extends DataTable {
  query: BalanceExplorerQuery;
  columns: DataTableColumn[];
  entries: BalanceExplorerEntry[];
}


export const EmptyBalance: BalanceExplorerResult = {
  query: emptyBalanceExplorerQuery(),
  columns: [],
  entries: [],
};


export interface BalanceExplorerEntry extends DataTableEntry {
  hasAccountStatement?: boolean;
}


export interface BalanceExplorerQuery extends DataTableQuery {
  accountsChartUID: string;
  trialBalanceType: BalanceExplorerTypes;
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


export function emptyBalanceExplorerQuery(): BalanceExplorerQuery {
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


export interface BalanceExplorerData {
  balance: BalanceExplorerResult;
  balanceType: ReportType<ReportTypeFlags>;
  queryExecuted: boolean;
}


export const EmptyBalanceExplorerData: BalanceExplorerData = {
  balance: EmptyBalance,
  balanceType: null,
  queryExecuted: false,
};
