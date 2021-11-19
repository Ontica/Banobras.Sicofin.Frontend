/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';

import { DataTable, DataTableColumn, DataTableCommand, DataTableEntry } from './data-table';

import { FileType } from './reporting';


export interface OperationalReportCommand extends DataTableCommand {
  reportType: string;
  accountsChartUID: string;
  ledgers?: string[];
  fromDate?: DateString;
  toDate: DateString;
  exportTo?: FileType;
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
