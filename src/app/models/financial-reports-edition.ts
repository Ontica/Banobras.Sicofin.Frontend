/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DataTableColumn, DataTableQuery, DataTableColumnType } from './_data-table';

import { Positioning } from './edition-command';


export interface FinancialReportTypesForDesign extends Identifiable {
  uid: string;
  name: string;
  outputTypes: Identifiable[];
}


export interface FinancialReportDesignQuery extends DataTableQuery {
  accountChartUID: string;
  financialReportTypeUID: string;
  date: DateString;
  outputType?: string;
}


export interface FinancialReportDesign {
  config: FinancialReportConfig;
  columns: FinancialReportColumn[];
  rows: FinancialReportRow[];
  cells: FinancialReportCell[];
}


export enum FinancialReportDesignType {
  FixedRows    = 'FixedRows',
  FixedCells   = 'FixedCells',
  FixedColumns = 'FixedColumns',
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
  startDate?: DateString,
  endDate?: DateString,
  row: number;
  financialConceptGroupUID?: string;
  financialConceptUID?: string;
}


export interface FinancialReportColumn extends DataTableColumn {
  column: string;
  field: string;
  title: string;
  type: string;
  formula: string;
  show: boolean;
  isCalculated: boolean;
  digits?: number;
  startDate?: DateString,
  endDate?: DateString,
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
  startDate?: DateString,
  endDate?: DateString,
}


export const EmptyFinancialReportDesignQuery: FinancialReportDesignQuery = {
  accountChartUID: '',
  financialReportTypeUID: '',
  date: '',
  outputType: '',
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
  field: '',
  title: '',
  type: DataTableColumnType.text,
  formula: '',
  show: true,
  isCalculated: false,
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
  Concept   = 'Concept',
  Label     = 'Label',
  DataField = 'DataField',
  Formula   = 'Formula',
}


export const FinancialReportEditionItemTypeList: Identifiable[] = [
  {uid: FinancialReportEditionItemType.Concept, name: 'Concepto'},
  {uid: FinancialReportEditionItemType.Label,   name: 'Etiqueta'},
];


export const FinancialReportColumnEditionItemTypeList: Identifiable[] = [
  {uid: FinancialReportEditionItemType.DataField, name: 'Dato'},
  {uid: FinancialReportEditionItemType.Formula,   name: 'Fórmula'},
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
  InsertDataFieldColumn = 'InsertDataFieldColumn',
  InsertFormulaColumn   = 'InsertFormulaColumn',
  UpdateDataFieldColumn = 'UpdateDataFieldColumn',
  UpdateFormulaColumn   = 'UpdateFormulaColumn',
  InsertLabelCell   = 'InsertLabelCell',
  InsertConceptCell = 'InsertConceptCell',
  UpdateLabelCell   = 'UpdateLabelCell',
  UpdateConceptCell = 'UpdateConceptCell',
}


export interface FinancialReportEditionFields {
  label?: string;
  financialConceptUID?: string;
  column?: string;
  row?: number;
  dataField?: string;
  columnName?: string;
  isHideColumn?: boolean;
  formula?: string;
  positioning?: Positioning;
  format?: string;
  startDate?: DateString;
  endDate?: DateString;
}
