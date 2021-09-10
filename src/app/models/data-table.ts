/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export interface DataTable {
  command: DataTableCommand;
  columns: DataTableColumn[];
  entries: DataTableEntry[];
}


export interface DataTableCommand {

}


export interface DataTableColumn {
  field: string;
  title: string;
  type: string;
  digits?: number;
}


export interface DataTableEntry {

}


export const EmptyDataTable: DataTable = {
  command: {},
  columns: [],
  entries: [],
};


export type DataTableItemType = 'BalanceEntry' | 'BalanceSummary' | 'BalanceTotalGroupDebtor' |
  'BalanceTotalGroupCreditor' | 'BalanceTotalDebtor' | 'BalanceTotalCreditor' | 'BalanceTotalCurrency' |
  'BalanceTotalConsolidatedByLedger' | 'BalanceTotalConsolidated';
