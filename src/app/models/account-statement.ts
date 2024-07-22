/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { BalanceExplorerQuery, BalanceExplorerEntry } from './balance-explorer';

import { DataTable, DataTableColumn, DataTableEntry, DataTableQuery } from './_data-table';

import { getEmptyTrialBalanceQuery, TrialBalanceQuery, TrialBalanceEntry } from './trial-balances';


export interface AccountStatement extends DataTable {
  query: AccountStatementQuery;
  columns: DataTableColumn[];
  entries: AccountStatementEntry[];
  title: string;
}


export enum AccountStatementOrder {
  ascending      = 'Ascending',
  descending     = 'Descending',
  accountingDate = 'AccountingDate',
  recordingDate  = 'RecordingDate',
  currentBalance = 'CurrentBalance',
  voucherNumber  = 'VoucherNumber',
}


export const AccountStatementOrderList: Identifiable[] = [
  { uid: AccountStatementOrder.ascending,      name: 'Menor a mayor' },
  { uid: AccountStatementOrder.descending,     name: 'Mayor a menor' },
  { uid: AccountStatementOrder.accountingDate, name: 'Fecha de afectación' },
  { uid: AccountStatementOrder.recordingDate,  name: 'Fecha de registro' },
  { uid: AccountStatementOrder.currentBalance, name: 'Saldo actual' },
  { uid: AccountStatementOrder.voucherNumber,  name: 'Número de poliza' },
];


export const DefaultAccountStatementOrder = { uid: AccountStatementOrder.ascending, name: 'Menor a mayor' };


export interface AccountStatementQuery extends DataTableQuery {
  query: BalanceExplorerQuery | TrialBalanceQuery;
  entry: BalanceExplorerEntry | TrialBalanceEntry;
  orderBy: AccountStatementOrder;
}


export interface AccountStatementEntry extends DataTableEntry {
  voucherId: number;
}


export const EmptyAccountStatementQuery: AccountStatementQuery = {
  query: getEmptyTrialBalanceQuery(),
  entry: null,
  orderBy: AccountStatementOrder.ascending,
};


export const EmptyAccountStatement: AccountStatement = {
  query: EmptyAccountStatementQuery,
  columns: [],
  entries: [],
  title: '',
};
