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
  R01_Integracion = 'R01_integracion',
  R01_Banxico = 'R01_Banxico',
  R01_Banxico_Integracion = 'R01_Banxico_Integracion',
}


export const FinancialReportList: Identifiable[] = [
  { uid: FinancialReportType.R01,                      name: 'R01' },
  { uid: FinancialReportType.R01_Integracion,          name: 'R01 Integración' },
  { uid: FinancialReportType.R01_Banxico,              name: 'R01 Banxico' },
  { uid: FinancialReportType.R01_Banxico_Integracion,  name: 'R01 Banxico Integración' },
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
  itemType: FinancialReportItemType;
  groupingRuleUID: string;
  conceptCode: string;
  concept: string;
  domesticCurrencyTotal: number;
  foreignCurrencyTotal: number;
  total: number;
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


export const EmptyFinancialReport: FinancialReport = {
  command: EmptyFinancialReportCommand,
  columns: [],
  entries: [],
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
