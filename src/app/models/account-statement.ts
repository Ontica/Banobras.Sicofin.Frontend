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


export interface AccountStatementEntry extends DataTableEntry {
  voucherId: number;
}


export interface AccountStatementQuery extends DataTableQuery {
  query: BalanceExplorerQuery | TrialBalanceQuery;
  entry: BalanceExplorerEntry | TrialBalanceEntry;
  orderBy: AccountStatementSortOrder;
}


export interface AccountStatementSortOrder {
  sortType: AccountStatementSortType;
  orderType: AccountStatementOrderType;
}


export enum AccountStatementSortType {
  accountingDate   = 'AccountingDate',
  amount           = 'Amount',
  recordingDate    = 'RecordingDate',
  subledgerAccount = 'SubledgerAccount',
  voucherNumber    = 'VoucherNumber',
}


export enum AccountStatementOrderType {
  ascending  = 'Ascending',
  descending = 'Descending',
}


export const AccountStatementSortTypesList: Identifiable[] = [
  { uid: AccountStatementSortType.accountingDate,   name: 'Fecha de afectación' },
  { uid: AccountStatementSortType.recordingDate,    name: 'Fecha de registro' },
  { uid: AccountStatementSortType.subledgerAccount, name: 'Auxiliar' },
  { uid: AccountStatementSortType.voucherNumber,    name: 'Número de poliza' },
  { uid: AccountStatementSortType.amount,           name: 'Importe' },
];


export const AccountStatementOrderTypesList: Identifiable[] = [
  { uid: AccountStatementOrderType.ascending,  name: 'Ascendente' },
  { uid: AccountStatementOrderType.descending, name: 'Descendente' },
];


export const DefaultAccountStatementSortOrder: AccountStatementSortOrder = {
  sortType: AccountStatementSortType.accountingDate,
  orderType: AccountStatementOrderType.ascending,
};


export const EmptyAccountStatementQuery: AccountStatementQuery = {
  query: getEmptyTrialBalanceQuery(),
  entry: null,
  orderBy: DefaultAccountStatementSortOrder,
};


export const EmptyAccountStatement: AccountStatement = {
  query: EmptyAccountStatementQuery,
  columns: [],
  entries: [],
  title: '',
};
