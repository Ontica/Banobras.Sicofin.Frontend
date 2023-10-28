/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Empty, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableColumnType, DataTableQuery,
         DataTableEntry } from './data-table';


export interface Subledger {
  uid: string;
  typeName: string;
  baseLedger: Identifiable;
  name: string;
  description: string;
  accountsPrefix: string;
}


export interface SubledgerAccount {
  id: number;
  accountsChartUID: string;
  ledger: Identifiable;
  type: Identifiable;
  number: string;
  name: string;
  description: string;
  suspended: boolean;
  lists: Identifiable[];
}


export interface SubledgerAccountDescriptor extends DataTableEntry {
  id: number;
  number: string;
  name: string;
  fullname: string;
  description: string;
  typeName: string;
  ledgerName: string;
  suspended: boolean;
}


export interface SubledgerAccountFields {
  ledgerUID: string;
  typeUID: string;
  number: string;
  name: string;
  description: string;
}


export interface SubledgerAccountQuery extends DataTableQuery {
  accountsChartUID: string;
  ledgerUID?: string;
  typeUID?: string;
  keywords?: string;
  lists?: string[];
}


export interface SubledgerAccountIFRSQuery extends DataTableQuery {
  ledgerUID?: string;
  keywords: string;
}


export interface SubledgerAccountDataTable extends DataTable {
  query: SubledgerAccountQuery;
  entries: SubledgerAccountDescriptor[];
}


export const EmptySubledgerAccount: SubledgerAccount = {
  id: 0,
  accountsChartUID: '',
  ledger: Empty,
  type: Empty,
  number: '',
  name: '',
  description: '',
  suspended: false,
  lists: []
};


export const EmptySubledgerAccountDescriptor: SubledgerAccountDescriptor = {
  id: 0,
  number: '',
  name: '',
  fullname: '',
  description: '',
  typeName: '',
  ledgerName: '',
  suspended: false
};


export const EmptySubledgerAccountQuery: SubledgerAccountQuery = {
  accountsChartUID: '',
  ledgerUID: '',
  typeUID: '',
  keywords: '',
  lists: []
};


export const DefaultSubledgerAccountColumns: DataTableColumn[] = [
  {
    field: 'number',
    title: 'Auxiliar',
    type: DataTableColumnType.text_link,
  },
  {
    field: 'name',
    title: 'Nombre del auxiliar',
    type: DataTableColumnType.text,
    isColumnStrikethrough: true,
    fieldConditionStrikethrough: 'suspended',
  },
  {
    field: 'ledgerName',
    title: 'Contabilidad',
    type: DataTableColumnType.text,
  },
  {
    field: 'typeName',
    title: 'Tipo de auxiliar',
    type: DataTableColumnType.text,
  },
];


export const EmptySubledgerAccountDataTable: SubledgerAccountDataTable = {
  query: EmptySubledgerAccountQuery,
  columns: DefaultSubledgerAccountColumns,
  entries: [],
};


export function mapSubledgerAccountDescriptorFromSubledgerAccount(subledgerAccount: SubledgerAccount):
  SubledgerAccountDescriptor {
  return {
    id: subledgerAccount.id,
    number: subledgerAccount.number,
    name: subledgerAccount.name,
    fullname: subledgerAccount.number + ' - ' + subledgerAccount.ledger.name,
    description: subledgerAccount.description,
    typeName: subledgerAccount.type.name,
    ledgerName: subledgerAccount.ledger.name,
    suspended: subledgerAccount.suspended,
  };
}
