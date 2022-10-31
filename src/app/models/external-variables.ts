/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry } from './data-table';

import { ExecuteDatasetsQuery, ImportInputDatasetCommand, InputDatasetsQuery } from './imported-data';


export interface ExternalVariableSet extends Identifiable {
  uid: string;
  name: string;
}


export enum DatasetModes {
  onlyLoadedValues = 'onlyLoadedValues',
  allValues        = 'allValues',
}


export const DatasetModesList: Identifiable[] = [
  {
    uid: DatasetModes.onlyLoadedValues,
    name: 'Solo valores importados',
  },
  {
    uid: DatasetModes.allValues,
    name: 'Lista completa',
  },
];


export interface ExternalValuesQuery {
  externalVariablesSetUID: string;
  datasetMode: string;
  date: DateString;
  exportTo?: string;
}


export interface ExternalValuesDatasetsQuery {
  externalVariablesSetUID: string;
  date: DateString;
  exportTo?: string;
}


export interface ExternalValuesData extends DataTable {
  query: ExternalValuesQuery;
  columns: DataTableColumn[];
  entries: DataTableEntry[];
}


export const EmptyExternalValuesData: ExternalValuesData = {
  query: {externalVariablesSetUID: '', datasetMode: '', date: ''},
  columns: [],
  entries: [],
};


export interface ExternalValuesImportDatasetCommand {
  externalVariablesSetUID?: string;
  datasetKind?: string;
  date: DateString;
}


export function mapToExternalValuesQuery(query: ExecuteDatasetsQuery): ExternalValuesQuery {
  const externalValuesQuery: ExternalValuesQuery = {
    externalVariablesSetUID: query.typeUID as string,
    date: query.fromDate,
    datasetMode: query.additionalUID as string,
  };

  return externalValuesQuery;
}


export function mapToExternalValuesDatasetsQuery(query: InputDatasetsQuery)
  : ExternalValuesDatasetsQuery {
  const externalValuesDatasetsQuery: ExternalValuesDatasetsQuery = {
    externalVariablesSetUID: query.typeUID,
    date: query.date,
  };

  return externalValuesDatasetsQuery;
}


export function mapToExternalValuesImportDatasetCommand(command: ImportInputDatasetCommand)
  : ExternalValuesImportDatasetCommand {
  const externalValuesImportDatasetCommand: ExternalValuesImportDatasetCommand = {
    externalVariablesSetUID: command.typeUID,
    datasetKind: command.datasetKind,
    date: command.date,
  };

  return externalValuesImportDatasetCommand;
}
