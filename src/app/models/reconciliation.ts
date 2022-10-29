/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry } from './data-table';

import { ExecuteDatasetsQuery, ImportDatasets, ImportInputDatasetCommand, InputDataset,
         InputDatasetsQuery, InputDatasetType } from './imported-data';


export interface ReconciliationType extends Identifiable {
  uid: string;
  name: string;
}


export interface ReconciliationCommand {
  reconciliationTypeUID: string;
  date: DateString;
}


export interface ReconciliationInputDatasetsCommand {
  reconciliationTypeUID: string;
  date: DateString;
  exportTo?: string;
}


export interface ReconciliationData extends DataTable {
  command: ReconciliationCommand;
  columns: DataTableColumn[];
  entries: DataTableEntry[];
}


export const EmptyReconciliationData: ReconciliationData = {
  command: {reconciliationTypeUID: '', date: ''},
  query: {},
  columns: [],
  entries: [],
};


export interface ReconciliationImportInputDatasetCommand {
  reconciliationTypeUID?: string;
  datasetKind?: string;
  date: DateString;
}


export interface ReconciliationDatasets extends ImportDatasets {
  loadedDatasets: InputDataset[];
  missingDatasetKinds: InputDatasetType[];
}


export function mapToReconciliationCommand(query: ExecuteDatasetsQuery): ReconciliationCommand {
  const reconciliationCommand: ReconciliationCommand = {
    reconciliationTypeUID: query.typeUID as string,
    date: query.fromDate,
  };

  return reconciliationCommand;
}


export function mapToReconciliationInputDatasetsCommand(query: InputDatasetsQuery)
  : ReconciliationInputDatasetsCommand {
  const reconciliationInputDatasetCommand: ReconciliationInputDatasetsCommand = {
    reconciliationTypeUID: query.typeUID,
    date: query.date,
  };

  return reconciliationInputDatasetCommand;
}


export function mapToReconciliationImportInputDatasetCommand(command: ImportInputDatasetCommand)
  : ReconciliationImportInputDatasetCommand {
  const reconciliationInputDatasetCommand: ReconciliationImportInputDatasetCommand = {
    reconciliationTypeUID: command.typeUID,
    datasetKind: command.datasetKind,
    date: command.date,
  };

  return reconciliationInputDatasetCommand;
}
