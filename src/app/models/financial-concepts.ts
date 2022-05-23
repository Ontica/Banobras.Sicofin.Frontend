/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableColumnType, DataTableCommand,
         DataTableEntry } from './data-table';


export interface FinancialConceptCommand extends DataTableCommand {
  accountsChartUID: string;
  groupUID?: string;
  date?: DateString;
}


export interface FinancialConcept {
  uid: string;
  code: string;
  name: string;
  position: number;
  level: number;
  startDate: DateString;
  endDate: DateString;
  group: Identifiable;
  integration: FinancialConceptEntry[]
}


export interface FinancialConceptDescriptor extends DataTableEntry {
  uid: string;
  code: string;
  name: string;
  position: number;
  level: number;
  accountsChartName: string;
  groupName: string;
}


export interface FinancialConceptDataTable extends DataTable {
  command: FinancialConceptCommand;
  entries: FinancialConceptDescriptor[];
}


export const DefaultFinancialConceptsColumns: DataTableColumn[] = [
  {
    field: 'code',
    title: 'Clave',
    type: DataTableColumnType.text_link,
  },
  {
    field: 'name',
    title: 'Concepto',
    type: DataTableColumnType.text,
  },
];


export enum FinancialConceptEntryType {
  Account = 'Account',
  ExternalVariable = 'ExternalVariable',
  FinancialConceptReference = 'FinancialConceptReference'
}


export interface FinancialConceptEntry {
  uid: string;
  type: FinancialConceptEntryType;
  itemName: string;
  itemCode: string;
  subledgerAccount: string;
  sectorCode: string;
  operator: string;
}


export const EmptyEmptyConceptIntegrationEntry: FinancialConceptEntry = {
  uid: '',
  type: FinancialConceptEntryType.Account,
  itemName: '',
  itemCode: '',
  subledgerAccount: '',
  sectorCode: '',
  operator: '',
}


export const EmptyFinancialConceptCommand: FinancialConceptCommand = {
  accountsChartUID: '',
  groupUID: '',
  date: '',
};


export const EmptyFinancialConceptDataTable: FinancialConceptDataTable = {
  command: EmptyFinancialConceptCommand,
  columns: DefaultFinancialConceptsColumns,
  entries: [],
};


export const EmptyFinancialConcept: FinancialConceptDescriptor = {
  uid: '',
  code: '',
  name: '',
  position: 0,
  level: 0,
  accountsChartName: '',
  groupName: '',
};
