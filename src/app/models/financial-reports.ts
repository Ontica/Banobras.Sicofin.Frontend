/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion, DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableCommand, DataTableEntry } from './data-table';


export enum FinancialReportType {
  R01 = 'R01',
  R01_Integracion = 'R01_Integracion',
  R01_Banxico = 'R01_Banxico',
  R01_Banxico_Integracion = 'R01_Banxico_Integracion',
  R10_A_1011 = 'R10 A-1011',
  R10_1012 = 'R10_1012',
  R12_A_1219 = 'R12_A_1219',
  R12_A_1220 = 'R12_A_1220',
  R12_A_1223 = 'R12_A_1223',
  R12_A_1224 = 'R12_A_1224',
  R13_A_1311 = 'R13_A_1311',
  R13_A_1316 = 'R13_A_1316',
  R13_B_1321 = 'R13_B_1321',
  R13_B_1322 = 'R13_B_1322'
}


export const FinancialReportList: Identifiable[] = [
  { uid: FinancialReportType.R01,                      name: 'R01' },
  { uid: FinancialReportType.R01_Integracion,          name: 'R01 Integración' },
  { uid: FinancialReportType.R01_Banxico,              name: 'R01 Banxico' },
  { uid: FinancialReportType.R01_Banxico_Integracion,  name: 'R01 Banxico Integración' },
  { uid: FinancialReportType.R10_A_1011,               name: 'R10 A 1011' },
  { uid: FinancialReportType.R10_1012,                 name: 'R10 1012' },
  { uid: FinancialReportType.R12_A_1219,               name: 'R12 A 1219' },
  { uid: FinancialReportType.R12_A_1220,               name: 'R12 A 1220' },
  { uid: FinancialReportType.R12_A_1223,               name: 'R12 A 1223' },
  { uid: FinancialReportType.R12_A_1224,               name: 'R12 A 1224' },
  { uid: FinancialReportType.R13_A_1311,               name: 'R12 A 1311' },
  { uid: FinancialReportType.R13_A_1316,               name: 'R12 A 1316' },
  { uid: FinancialReportType.R13_B_1321,               name: 'R12 B 1321' },
  { uid: FinancialReportType.R13_B_1322,               name: 'R13 B 1322' },
];


export interface FinancialReport extends DataTable {
  command: FinancialReportCommand;
  columns: DataTableColumn[];
  entries: FinancialReportEntry[];
}


export interface FinancialReportCommand extends DataTableCommand {
  financialReportType: FinancialReportType;
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
  financialReportType: null,
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


export function getFinancialReportNameFromUID(financialReportTypeUID: string): string {
  const financialReportType = FinancialReportList.filter(x => x.uid === financialReportTypeUID);

  if (financialReportType && financialReportType.length > 0) {
    return financialReportType[0].name;
  }

  throw Assertion.assertNoReachThisCode(
    `Unhandled financial report type for uid '${financialReportTypeUID}'.`
  );
}
