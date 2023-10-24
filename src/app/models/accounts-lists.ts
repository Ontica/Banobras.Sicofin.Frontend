/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DataTable, DataTableColumn, DataTableEntry, DataTableQuery } from "./data-table";


export interface AccountsListQuery extends DataTableQuery {
  type: string;
  keywords: string;
}


export interface AccountsListData extends DataTable {
  uid: string;
  name: string;
  query: AccountsListQuery;
  columns: DataTableColumn[];
  entries: AccountsListEntry[];
}


export interface AccountsListEntry extends DataTableEntry {

}


export const EmptyAccountsListData: AccountsListData = {
  uid: '',
  name: '',
  query: null,
  columns: [],
  entries: [],
}
