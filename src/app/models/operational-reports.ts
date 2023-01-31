/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTableColumn } from './data-table';

import { FileType, ReportData, ReportEntry, ReportQuery, ReportTypeFlags } from './reporting';


export interface OperationalReportTypeFlags extends ReportTypeFlags {
  singleDate: boolean;
  datePeriod: boolean;
  ledgers: boolean;
  account: boolean;
  withSubledgerAccount: boolean;
  sendType: boolean;
  outputType: boolean;
}


export enum SendTypes {
  N = 'N',
  C = 'C',
}


export interface OperationalReportQuery extends ReportQuery {
  reportType: string;
  accountsChartUID: string;
  ledgers?: string[];
  fromDate?: DateString;
  toDate: DateString;
  accountNumber?: string;
  withSubledgerAccount?: boolean;
  exportTo?: FileType;
  sendType?: SendTypes;
  outputType?: string;
}


export interface OperationalReport extends ReportData {
  query: OperationalReportQuery;
  columns: DataTableColumn[];
  entries: OperationalReportEntry[];
}


export interface OperationalReportEntry extends ReportEntry {

}


export const EmptyOperationalReportTypeFlags: OperationalReportTypeFlags = {
  singleDate: false,
  datePeriod: false,
  ledgers: false,
  account: false,
  withSubledgerAccount: false,
  sendType: false,
  outputType: false,
}


export const SendTypesList: Identifiable[] = [
  {uid: SendTypes.N, name: 'Normal'},
  {uid: SendTypes.C, name: 'Complementario'},
];


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
