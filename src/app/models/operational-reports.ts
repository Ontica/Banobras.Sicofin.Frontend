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
  BalanzaSat = 'BalanzaSat',
  CatalogoSAT = 'CatalogoSAT',
}


export const OperationalReportTypeList: Identifiable[] = [
  {uid: OperationalReportType.BalanzaSat,  name: 'Balanza'},
  {uid: OperationalReportType.CatalogoSAT, name: 'Catalogo de cuentas'},
];


export interface OperationalReportCommand extends DataTableCommand {
  reportType: OperationalReportType;
  accountsChartUID: string;
  date: DateString;
  fileType?: FileReportType;
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
  date: '',
};


export const EmptyOperationalReport: OperationalReport = {
  command: EmptyOperationalReportCommand,
  columns: [],
  entries: [],
};
