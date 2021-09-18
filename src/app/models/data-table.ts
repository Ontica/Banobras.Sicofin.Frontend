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
  type: DataTableColumnType;
  digits?: number;
}


export interface DataTableEntry {

}


export const EmptyDataTable: DataTable = {
  command: {},
  columns: [],
  entries: [],
};


export enum DataTableColumnType {
  text = 'text',
  text_link = 'text-link',
  text_nowrap = 'text-nowrap',
  decimal = 'decimal',
  date = 'date',
}


export type DataTableItemType = 'BalanceEntry' | 'BalanceSummary' | 'BalanceTotalGroupDebtor' |
  'BalanceTotalGroupCreditor' | 'BalanceTotalDebtor' | 'BalanceTotalCreditor' | 'BalanceTotalCurrency' |
  'BalanceTotalConsolidatedByLedger' | 'BalanceTotalConsolidated';