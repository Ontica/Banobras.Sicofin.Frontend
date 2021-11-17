/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableColumnType } from './data-table';


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
  baseLedger: Identifiable;
  subledger: Identifiable;
  number: string;
  name: string;
  keywords: string;
  description: string;
}


export interface SubledgerAccountDescriptor {
  id: number;
  number: string;
  name: string;
  fullname: string;
  description: string;
  typeName: string;
  ledgerName: string;
}


export const EmptySubledgerAccountDescriptor: SubledgerAccountDescriptor = {
  id: 0,
  number: '',
  name: '',
  fullname: '',
  description: '',
  typeName: '',
  ledgerName: '',
};


export interface SearchSubledgerAccountCommand {
  accountsChartUID: string;
  ledgerUID?: string;
  subledgerTypeUID?: string;
  keywords?: string;
  lists?: string[];
}


export interface SubledgerAccountDataTable extends DataTable {
  command: SearchSubledgerAccountCommand;
  entries: SubledgerAccountDescriptor[];
}


export const EmptySearchSubledgerAccountCommand: SearchSubledgerAccountCommand = {
  accountsChartUID: '',
  ledgerUID: '',
  subledgerTypeUID: '',
  keywords: '',
  lists: [],
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
  command: EmptySearchSubledgerAccountCommand,
  columns: DefaultSubledgerAccountColumns,
  entries: [],
};
