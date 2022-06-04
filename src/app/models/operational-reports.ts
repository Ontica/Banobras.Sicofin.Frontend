/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableQuery, DataTableEntry } from './data-table';

import { FileType } from './reporting';


export enum SendTypes {
  N = 'N',
  C = 'C',
}


export const SendTypesList: Identifiable[] = [
  {uid: SendTypes.N, name: 'Normal'},
  {uid: SendTypes.C, name: 'Complementario'},
];


export interface OperationalReportQuery extends DataTableQuery {
  reportType: string;
  accountsChartUID: string;
  ledgers?: string[];
  fromDate?: DateString;
  toDate: DateString;
  accountNumber?: string;
  withSubledgerAccount?: boolean;
  exportTo?: FileType;
  sendType?: SendTypes;
}


export interface OperationalReport extends DataTable {
  query: OperationalReportQuery;
  columns: DataTableColumn[];
  entries: OperationalReportEntry[];
}


export interface OperationalReportEntry extends DataTableEntry {

}


export const EmptyOperationalReportQuery: OperationalReportQuery = {
  reportType: null,
  accountsChartUID: '',
  toDate: '',
};


export const EmptyOperationalReport: OperationalReport = {
  query: EmptyOperationalReportQuery,
  columns: [],
  entries: [],
};
