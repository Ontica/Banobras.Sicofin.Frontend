/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableCommand, DataTableEntry } from '.';

import { AccountDescriptor } from './accounts-chart';


export interface AccountBalance {
  ledger: Identifiable;
  account: AccountDescriptor;
  sector: Identifiable;
  currentBalance: number;
  currency: Identifiable;
}


export enum BalanceType {
  SaldosPorCuenta   = 'SaldosPorCuenta',
  SaldosPorAuxiliar = 'SaldosPorAuxiliar',
}


export const BalanceTypeList: Identifiable[] = [
  { uid: BalanceType.SaldosPorCuenta,   name: 'Saldos por cuenta' },
  { uid: BalanceType.SaldosPorAuxiliar, name: 'Saldos por auxiliar' },
];


export interface Balance extends DataTable {
  command: BalanceCommand;
  columns: DataTableColumn[];
  entries: BalanceEntry[];
}


export interface BalanceEntry extends DataTableEntry {
  uid: string;
}


export interface BalanceCommand extends DataTableCommand {
  accountsChartUID: string;
  trialBalanceType: BalanceType;
  balancesType?: string;
  fromAccount?: string;
  initialPeriod?: {
    fromDate?: DateString;
    toDate?: DateString;
  };
  subledgerAccount?: string;
  withSubledgerAccount?: boolean;
}


export function getEmptyBalanceCommand(): BalanceCommand {
  return {
    accountsChartUID: '',
    trialBalanceType: null,
    balancesType: '',
    fromAccount: '',
    initialPeriod: {fromDate: '', toDate: ''},
    subledgerAccount: '',
    withSubledgerAccount: false,
  };
}
