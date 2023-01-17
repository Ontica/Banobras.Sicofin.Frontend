/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';

import { DataTable, DataTableColumn, DataTableQuery, DataTableEntry } from './data-table';


export interface LockedUpBalancesQuery extends DataTableQuery {
  accountsChartUID: string;
  fromDate?: DateString;
  toDate: DateString;
}


export interface LockedUpBalancesData extends DataTable {
  query: LockedUpBalancesQuery;
  columns: DataTableColumn[];
  entries: DataTableEntry[];
}


export const EmptyLockedUpBalancesQuery: LockedUpBalancesQuery = {
  accountsChartUID: '',
  fromDate: '',
  toDate: '',
};


export const EmptyLockedUpBalancesData: LockedUpBalancesData = {
  query: EmptyLockedUpBalancesQuery,
  columns: [],
  entries: [],
};
