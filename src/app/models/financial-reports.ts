/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion, DateString, Identifiable } from '@app/core';
import { DataTableColumn } from './data-table';


export enum FinancialReportType {
  R01 = 'R01',
}


export const FinancialReportList: Identifiable[] = [
  {uid: FinancialReportType.R01,  name: 'R01'},
];


export interface FinancialReport {
  command: FinancialReportCommand;
  columns: DataTableColumn[];
  entries: FinancialReportEntry[];
}


export interface FinancialReportCommand {
  financialReportType: FinancialReportType;
  accountsChartUID: string;
  date: DateString;
}


export const EmptyTrialBalanceCommand: FinancialReportCommand = {
  financialReportType: null,
  accountsChartUID: '',
  date: ''
};


export interface FinancialReportEntry {
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


export function getFinancialReportNameFromUID(financialReportTypeUID: string): string {
  const financialReportType = FinancialReportList.filter(x => x.uid === financialReportTypeUID);

  if (financialReportType && financialReportType.length > 0) {
    return financialReportType[0].name;
  }

  throw Assertion.assertNoReachThisCode(
    `Unhandled financial report type for uid '${financialReportTypeUID}'.`
  );
}
