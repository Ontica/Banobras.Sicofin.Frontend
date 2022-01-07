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
  isColumnStrikethrough?: boolean;
  fieldConditionStrikethrough?: string;
}


export interface DataTableEntry {
  itemType?: DataTableItemType;
  clickableEntry?: boolean;
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


export type DataTableItemType = 'Entry' | 'Summary' | 'Group' | 'Total' |
  'BalanceEntry' | 'BalanceSummary' | 'BalanceTotalConsolidated' | 'BalanceTotalConsolidatedByLedger' |
  'BalanceTotalCreditor' | 'BalanceTotalCurrency' | 'BalanceTotalDebtor' | 'BalanceTotalGroupCreditor' |
  'BalanceTotalGroupDebtor';


export const EntryItemTypeList: DataTableItemType[] = [
  'Entry',
  'BalanceEntry',
];


export const SummaryItemTypeList: DataTableItemType[] = [
  'Summary',
  'BalanceSummary',
];


export const GroupItemTypeList: DataTableItemType[] = [
  'Group',
  'BalanceTotalGroupDebtor',
  'BalanceTotalGroupCreditor',
];


export const TotalItemTypeList: DataTableItemType[] = [
  'Total',
  'BalanceTotalDebtor',
  'BalanceTotalCreditor',
  'BalanceTotalCurrency',
  'BalanceTotalConsolidatedByLedger',
  'BalanceTotalConsolidated',
];


export const ClickeableItemTypeList: DataTableItemType[] = [...EntryItemTypeList];
