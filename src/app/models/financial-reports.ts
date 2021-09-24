/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';

import { DataTable, DataTableColumn, DataTableCommand, DataTableEntry } from './data-table';


export interface FinancialReport extends DataTable {
  command: FinancialReportCommand;
  columns: DataTableColumn[];
  entries: FinancialReportEntry[];
}


export interface FinancialReportCommand extends DataTableCommand {
  financialReportType: string;
  accountsChartUID: string;
  date: DateString;
}


export interface FinancialReportEntry extends DataTableEntry {
  uid: string;
  accountsChartName: string;
  rulesSetName: string;
  format: string;
  itemType: FinancialReportItemType;
  groupingRuleUID: string;
  conceptCode: string;
  concept: string;
  domesticCurrencyTotal: number;
  foreignCurrencyTotal: number;
  total: number;
}


export interface FinancialReportBreakdown {
  financialReportEntry: FinancialReportEntry;
  financialReportBreakdown: FinancialReport;
}


export enum FinancialReportItemType {
  Entry = 'Entry',
  Summary = 'Summary'
}


export const EmptyFinancialReportCommand: FinancialReportCommand = {
  financialReportType: '',
  accountsChartUID: '',
  date: ''
};


export const EmptyFinancialReportEntry: FinancialReportEntry = {
  uid: '',
  accountsChartName: '',
  rulesSetName: '',
  format: '',
  itemType: FinancialReportItemType.Entry,
  groupingRuleUID: '',
  conceptCode: '',
  concept: '',
  domesticCurrencyTotal: 0,
  foreignCurrencyTotal: 0,
  total: 0,
};


export const EmptyFinancialReport: FinancialReport = {
  command: EmptyFinancialReportCommand,
  columns: [],
  entries: [],
};


export const EmptyFinancialReportBreakdown: FinancialReportBreakdown = {
  financialReportEntry: EmptyFinancialReportEntry,
  financialReportBreakdown: EmptyFinancialReport,
};

//
// Designer
//

export interface FinancialReportRow {
  uid: string;
  code: string;
  label: string;
  format: string;
  position: number;
  groupingRuleUID: string;
}


export interface FinancialReportColumn extends DataTableColumn {

}


export interface FinancialReportDesign {
  rows: FinancialReportRow[];
  columns: FinancialReportColumn[];
}


export enum FinancialReportColumnType {
  text = 'text',
  text_nowrap = 'text-nowrap',
  decimal = 'decimal',
  grouping_rule = 'grouping_rule',
  operation_data = 'operation_data',
  colums_sum = 'colums_sum',
}


export const EmptyFinancialReportRow: FinancialReportRow = {
  uid: '',
  code: '',
  label: '',
  format: '',
  position: null,
  groupingRuleUID: '',
};


export const EmptyFinancialReportDesign: FinancialReportDesign = {
  rows: [],
  columns: [],
};


export const EmptyFinancialReportColumn: FinancialReportColumn = {
  field: 'Empty',
  title: '',
  type: FinancialReportColumnType.text,
  digits: 0,
};
