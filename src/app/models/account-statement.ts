/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { BalanceExplorerQuery, BalanceExplorerEntry } from './balance-explorer';

import { DataTable, DataTableColumn, DataTableEntry, DataTableQuery } from './_data-table';

import { getEmptyTrialBalanceQuery, TrialBalanceQuery, TrialBalanceEntry } from './trial-balances';

export interface AccountStatement extends DataTable {
  query: AccountStatementQuery;
  columns: DataTableColumn[];
  entries: AccountStatementEntry[];
  title: string;
}


export interface AccountStatementQuery extends DataTableQuery {
  query: BalanceExplorerQuery | TrialBalanceQuery;
  entry: BalanceExplorerEntry | TrialBalanceEntry;
}


export interface AccountStatementEntry extends DataTableEntry {
  voucherId: number;
}


export const EmptyAccountStatementQuery: AccountStatementQuery = {
  query: getEmptyTrialBalanceQuery(),
  entry: null,
};


export const EmptyAccountStatement: AccountStatement = {
  query: EmptyAccountStatementQuery,
  columns: [],
  entries: [],
  title: '',
};
