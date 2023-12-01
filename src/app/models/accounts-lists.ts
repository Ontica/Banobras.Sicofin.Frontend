/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from "@app/core";

import { DataTable, DataTableColumn, DataTableEntry, DataTableQuery } from "./data-table";


export enum AccountsListType {
  ConciliacionDerivados   = 'ConciliacionDerivados',
  DepreciacionActivoFijo  = 'DepreciacionActivoFijo',
  PrestamosInterbancarios = 'PrestamosInterbancarios',
  SwapsCobertura          = 'SwapsCobertura',
}


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
  uid: string;
}


export interface ConciliacionDerivadosEntry extends AccountsListEntry {
  uid: string;
  accountUID: string;
  accountNumber: string;
  accountName: string;
  startDate: DateString;
  endDate: DateString;
}


export interface DepreciacionActivoFijoEntry extends AccountsListEntry {
  uid: string;
  auxiliarHistoricoId: number;
  auxiliarHistoricoNombre: string;
  auxiliarHistorico: string;
  numeroInventario: string;
  numeroDelegacion: string;
  delegacion: string;
  delegacionUID: string;
  fechaAdquisicion: DateString;
  fechaInicioDepreciacion: DateString;
  mesesDepreciacion: number;
  auxiliarRevaluacion: string;
  auxiliarRevaluacionNombre: string;
  auxiliarRevaluacionId: number;
  montoRevaluacion: number;
}


export interface PrestamosInterbancariosEntry extends AccountsListEntry {
  uid: string;
  prestamoUID: string;
  prestamoName: string;
  subledgerAccountId: number;
  subledgerAccountName: string;
  subledgerAccountNumber: string;
  sectorCode: string;
  currencyCode: string;
  vencimiento: DateString;
}


export interface SwapsCoberturaEntry extends AccountsListEntry {
  uid: string;
  subledgerAccountId: number;
  subledgerAccountName: string;
  subledgerAccountNumber: string;
  classification: string;
  startDate: DateString;
  endDate: DateString;
}


export interface AccountsListEntryFields {
  uid: string;
}


export interface ConciliacionDerivadosFields extends AccountsListEntryFields {
  accountNumber: string;
  startDate: DateString;
  endDate: DateString;
}


export interface DepreciacionActivoFijoFields extends AccountsListEntryFields {
  uid: string;
  auxiliarHistorico: string;
  delegacionUID: string;
  fechaAdquisicion: DateString;
  fechaInicioDepreciacion: DateString;
  mesesDepreciacion: number;
  auxiliarRevaluacion: string;
  montoRevaluacion: number;
}


export interface PrestamosInterbancariosFields extends AccountsListEntryFields {
  uid: string;
  prestamoUID: string;
  subledgerAccountNumber: string;
  sectorCode: string;
  currencyCode: string;
  vencimiento: DateString;
}


export interface SwapsCoberturaFields extends AccountsListEntryFields {
  uid: string;
  subledgerAccountNumber: string;
  classification: string;
  startDate: DateString;
  endDate: DateString;
}


export const EmptyAccountsListData: AccountsListData = {
  uid: '',
  name: '',
  query: null,
  columns: [],
  entries: [],
}
