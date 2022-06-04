/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { BalancesQuery, BalanceEntry } from './balances';

import { DataTable, DataTableColumn, DataTableEntry, DataTableQuery } from './data-table';

import { getEmptyTrialBalanceQuery, TrialBalanceQuery, TrialBalanceEntry } from './trial-balances';

export interface AccountStatement extends DataTable {
  query: AccountStatementQuery;
  columns: DataTableColumn[];
  entries: AccountStatementEntry[];
  title: string;
}


export interface AccountStatementQuery extends DataTableQuery {
  query: BalancesQuery | TrialBalanceQuery;
  entry: BalanceEntry | TrialBalanceEntry;
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
