/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableQuery, DataTableEntry,
         DataTableColumnType } from './data-table';

import { Positioning } from './edition-command';


export interface FinancialReportTypeActions {
  getAccountsIntegration: boolean;
  datePeriod: boolean;
  singleDate: boolean;
}


export interface FinancialReport extends DataTable {
  query: FinancialReportQuery;
  columns: DataTableColumn[];
  entries: FinancialReportEntry[];
}


export interface FinancialReportQuery extends DataTableQuery {
  financialReportType: string;
  accountsChartUID: string;
  fromDate?: DateString;
  toDate?: DateString;
  getAccountsIntegration?: boolean;
  exportTo?: string;
}


export interface FinancialReportEntry extends DataTableEntry {
  uid: string;
  accountsChartName: string;
  groupName: string;
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


export const EmptyFinancialReportQuery: FinancialReportQuery = {
  financialReportType: '',
  accountsChartUID: '',
  fromDate: '',
  toDate: '',
  getAccountsIntegration: false,
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
  itemType: FinancialReportItemType.Entry,
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

//
// Designer
//

export interface FinancialReportDesign {
  config: FinancialReportConfig;
  columns: FinancialReportColumn[];
  rows: FinancialReportRow[];
  cells: FinancialReportCell[];
}


export enum FinancialReportDesignType {
  FixedRows  = 'FixedRows',
  FixedCells = 'FixedCells',
}


export interface FinancialReportConfig {
  reportType: Identifiable;
  designType: FinancialReportDesignType;
  accountsChart: Identifiable;
  financialConceptGroups: Identifiable[];
  dataFields: string[];
  grid: {
    columns: string[];
    startRow: number;
    endRow: number;
  };
}


export interface FinancialReportRow {
  uid: string;
  conceptCode?: string;
  concept?: string;
  format?: string;
  row: number;
  financialConceptGroupUID?: string;
  financialConceptUID?: string;
}


export interface FinancialReportColumn extends DataTableColumn {
  column: string;
  title: string;
  field: string;
  type: string;
  digits?: number;
}


export interface FinancialReportCell {
  uid: string;
  column: string;
  row: number;
  financialConceptGroupUID: string;
  financialConceptUID: string;
  dataField: string;
  label: string;
  format: string;
}


export const EmptyFinancialReportConfig: FinancialReportConfig = {
  reportType: Empty,
  designType: FinancialReportDesignType.FixedRows,
  accountsChart: Empty,
  financialConceptGroups: [],
  dataFields: [],
  grid: {
    columns: [],
    startRow: 0,
    endRow: 0,
  },
};


export const EmptyFinancialReportColumn: FinancialReportColumn = {
  column: '',
  title: '',
  field: 'Empty',
  type: DataTableColumnType.text,
  digits: 0,
};


export const EmptyFinancialReportRow: FinancialReportRow = {
  uid: '',
  row: -1,
};


export const EmptyFinancialReportCell: FinancialReportCell = {
  uid: '',
  dataField: '',
  label: '',
  column: '',
  row: -1,
  format: '',
  financialConceptGroupUID: '',
  financialConceptUID: '',
};


export const EmptyFinancialReportDesign: FinancialReportDesign = {
  config: EmptyFinancialReportConfig,
  columns: [],
  rows: [],
  cells: [],
};


export enum FinancialReportEditionItemType {
  Concept = 'Concept',
  Label   = 'Label',
}


export const FinancialReportEditionItemTypeList: Identifiable[] = [
  {uid: FinancialReportEditionItemType.Concept, name: 'Concepto'},
  {uid: FinancialReportEditionItemType.Label,   name: 'Etiqueta'},
];


export enum FormatType {
  Default     = 'Default',
  Bold        = 'Bold',
  Primario    = 'Primario',
  Secundario  = 'Secundario',
  Terciario   = 'Terciario',
  Cuaternario = 'Cuaternario',
  Gris        = 'Gris',
  Verde       = 'Verde',
  VerdeBold   = 'VerdeBold',
}


export const FormatTypeList: string[] = [
  FormatType.Default,
  FormatType.Bold,
  FormatType.Primario,
  FormatType.Secundario,
  FormatType.Terciario,
  FormatType.Cuaternario,
  FormatType.Gris,
  FormatType.Verde,
  FormatType.VerdeBold,
];


export interface FinancialReportEditionCommand {
  type: FinancialReportEditionType;
  payload: FinancialReportEditionFields;
}


export enum FinancialReportEditionType {
  InsertLabelRow    = 'InsertLabelRow',
  InsertConceptRow  = 'InsertConceptRow',
  UpdateLabelRow    = 'UpdateLabelRow',
  UpdateConceptRow  = 'UpdateConceptRow',
  InsertLabelCell   = 'InsertLabelCell',
  InsertConceptCell = 'InsertConceptCell',
  UpdateLabelCell   = 'UpdateLabelCell',
  UpdateConceptCell = 'UpdateConceptCell',
}


export interface FinancialReportEditionFields {
  label?: string;
  conceptUID?: string;
  cell?: {
    column: string;
    row: number;
  };
  dataField?: string;
  positioning?: Positioning;
  format?: string;
}
