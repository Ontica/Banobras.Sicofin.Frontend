/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { BalanceCommand, BalanceEntry } from './balances';

import { DataTable, DataTableColumn, DataTableEntry, DataTableCommand,
         DataTableItemType } from './data-table';

import { getEmptyTrialBalanceCommand, TrialBalanceCommand, TrialBalanceEntry } from './trial-balances';

export interface AccountStatement extends DataTable {
  command: AccountStatementCommand;
  columns: DataTableColumn[];
  entries: AccountStatementEntry[];
  title: string;
}


export interface AccountStatementCommand extends DataTableCommand {
  command: BalanceCommand | TrialBalanceCommand;
  entry: BalanceEntry | TrialBalanceEntry;
}


export interface AccountStatementEntry extends DataTableEntry {
  voucherId: number;
  itemType: DataTableItemType;
}


export const EmptyAccountStatementCommand: AccountStatementCommand = {
  command: getEmptyTrialBalanceCommand(),
  entry: null,
};


export const EmptyAccountStatement: AccountStatement = {
  command: EmptyAccountStatementCommand,
  columns: [],
  entries: [],
  title: '',
};
