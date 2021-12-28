/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { AccountDescriptor } from './accounts-chart';

import { DataTable, DataTableColumn, DataTableCommand, DataTableEntry } from './data-table';

import { TrialBalanceType } from './trial-balances';


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


export const BalanceTypeList: TrialBalanceType[] = [
  {
    uid: BalanceTypes.SaldosPorCuentaConsultaRapida,
    name: 'Saldos por cuenta',
    hasAccountStatement: true
  },
  {
    uid: BalanceTypes.SaldosPorAuxiliarConsultaRapida,
    name: 'Saldos por auxiliar',
    hasAccountStatement: true
  },
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
  trialBalanceType: BalanceTypes;
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
