/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';

import { DataTableColumn, DataTableItemType } from './data-table';

import { ReportData, ReportEntry, ReportQuery, ReportType } from './reporting';


export interface FinancialReportTypeFlags {
  datePeriod: boolean;
  singleDate: boolean;
}


export interface FinancialReportQuery extends ReportQuery {
  reportType: string;
  accountsChartUID: string;
  fromDate?: DateString;
  toDate?: DateString;
  exportTo?: string;
}


export interface FinancialReport extends ReportData {
  query: FinancialReportQuery;
  columns: DataTableColumn[];
  entries: FinancialReportEntry[];
}


export interface FinancialReportEntry extends ReportEntry {
  uid: string;
  accountsChartName: string;
  groupName: string;
  format: string;
  itemType: DataTableItemType;
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


export const EmptyFinancialReportTypeFlags: FinancialReportTypeFlags = {
  datePeriod: false,
  singleDate: false,
}


export const EmptyFinancialReportType: ReportType<FinancialReportTypeFlags> = {
  uid: '',
  name: '',
  group: null,
  controller: null,
  show: EmptyFinancialReportTypeFlags,
  exportTo: [],
}


export const EmptyFinancialReportQuery: FinancialReportQuery = {
  reportType: '',
  accountsChartUID: '',
  fromDate: '',
  toDate: '',
};


export const EmptyFinancialReport: FinancialReport = {
  query: EmptyFinancialReportQuery,
  columns: [],
  entries: [],
};


export const EmptyFinancialReportEntry: FinancialReportEntry = {
  uid: '',
  accountsChartName: '',
  groupName: '',
  format: '',
  itemType: 'Entry',
  groupingRuleUID: '',
  conceptCode: '',
  concept: '',
  domesticCurrencyTotal: 0,
  foreignCurrencyTotal: 0,
  total: 0,
};


export const EmptyFinancialReportBreakdown: FinancialReportBreakdown = {
  financialReportEntry: EmptyFinancialReportEntry,
  financialReportBreakdown: EmptyFinancialReport,
};
