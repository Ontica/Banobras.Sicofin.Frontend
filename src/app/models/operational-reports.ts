/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableCommand, DataTableEntry } from './data-table';

import { FileType } from './reporting';


export enum SendTypes {
  N = 'N',
  C = 'C',
}


export const SendTypesList: Identifiable[] = [
  {uid: SendTypes.N, name: 'Normal'},
  {uid: SendTypes.C, name: 'Complementario'},
];


export interface OperationalReportCommand extends DataTableCommand {
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
  command: OperationalReportCommand;
  columns: DataTableColumn[];
  entries: OperationalReportEntry[];
}


export interface OperationalReportEntry extends DataTableEntry {

}


export const EmptyOperationalReportCommand: OperationalReportCommand = {
  reportType: null,
  accountsChartUID: '',
  toDate: '',
};


export const EmptyOperationalReport: OperationalReport = {
  command: EmptyOperationalReportCommand,
  columns: [],
  entries: [],
};
