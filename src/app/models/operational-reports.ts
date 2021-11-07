/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableCommand, DataTableEntry } from './data-table';

import { FileReportType } from './report-file';


export enum OperationalReportType {
  BalanzaSat = 'BalanzaSAT',
  CatalogoSAT = 'CatalogoSAT',
}


export const OperationalReportTypeList: Identifiable[] = [
  {uid: OperationalReportType.BalanzaSat,  name: 'Balanza SAT'},
  {uid: OperationalReportType.CatalogoSAT, name: 'Catálogo de cuentas SAT'},
];


export interface OperationalReportCommand extends DataTableCommand {
  reportType: OperationalReportType;
  accountsChartUID: string;
  toDate: DateString;
  exportTo?: FileReportType;
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
