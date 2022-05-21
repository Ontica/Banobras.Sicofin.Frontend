/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';

import { DataTable, DataTableColumn, DataTableColumnType, DataTableCommand,
         DataTableEntry } from './data-table';


export interface FinancialConceptCommand extends DataTableCommand {
  accountsChartUID: string;
  rulesSetUID?: string;
  date?: DateString;
}


export interface FinancialConcept extends DataTableEntry {
  uid: string;
  code: string;
  concept: string;
  position: number;
  level: number;
  parentUID: string;
  accountsChartName: string;
  rulesSetName: string;

  accountsChartUID?: string;
  rulesSetUID?: string;
  startDate?: DateString;
  endDate?: DateString;
}


export interface FinancialConceptDataTable extends DataTable {
  command: FinancialConceptCommand;
  entries: FinancialConcept[];
}


export const DefaultFinancialConceptsColumns: DataTableColumn[] = [
  {
    field: 'code',
    title: 'Clave',
    type: DataTableColumnType.text_link,
  },
  {
    field: 'concept',
    title: 'Concepto',
    type: DataTableColumnType.text,
  },
];


export enum ConceptIntegrationEntryType {
  Agrupation = 'Agrupation',
  Account = 'Account',
  FixedValue = 'FixedValue',
}


export interface ConceptIntegrationEntry {
  uid: string;
  type: ConceptIntegrationEntryType;
  itemName: string;
  itemCode: string;
  subledgerAccount: string;
  sectorCode: string;
  operator: string;
}


export const EmptyEmptyConceptIntegrationEntry: ConceptIntegrationEntry = {
  uid: '',
  type: ConceptIntegrationEntryType.Account,
  itemName: '',
  itemCode: '',
  subledgerAccount: '',
  sectorCode: '',
  operator: '',
}


export const EmptyFinancialConceptCommand: FinancialConceptCommand = {
  accountsChartUID: '',
  rulesSetUID: '',
  date: '',
};


export const EmptyFinancialConceptDataTable: FinancialConceptDataTable = {
  command: EmptyFinancialConceptCommand,
  columns: DefaultFinancialConceptsColumns,
  entries: [],
};


export const EmptyFinancialConcept: FinancialConcept = {
  uid: '',
  code: '',
  concept: '',
  position: 0,
  level: 0,
  parentUID: '',
  accountsChartName: '',
  rulesSetName: '',
};
