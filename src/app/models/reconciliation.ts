/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { DataTable, DataTableColumn, DataTableEntry } from './data-table';

import { ExecuteDatasetsCommand, ImportDatasets, ImportInputDatasetCommand, InputDataset,
         InputDatasetsCommand, InputDatasetType } from './imported-data';


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
}


export interface ReconciliationData extends DataTable {
  command: ReconciliationCommand;
  columns: DataTableColumn[];
  entries: DataTableEntry[];
}


export const EmptyReconciliationData: ReconciliationData = {
  command: {reconciliationTypeUID: '', date: ''},
  columns: [],
  entries: [],
};


export interface ReconciliationImportInputDatasetCommand {
  reconciliationTypeUID?: string;
  datasetType?: string;
  date: DateString;
}


export interface ReconciliationDatasets extends ImportDatasets {
  loaded: InputDataset[];
  missing: InputDatasetType[];
}


export function mapToReconciliationCommand(command: ExecuteDatasetsCommand): ReconciliationCommand {
  const reconciliationCommand: ReconciliationCommand = {
    reconciliationTypeUID: command.typeUID,
    date: command.fromDate,
  };

  return reconciliationCommand;
}


export function mapToReconciliationInputDatasetsCommand(command: InputDatasetsCommand)
  : ReconciliationInputDatasetsCommand {
  const reconciliationInputDatasetCommand: ReconciliationInputDatasetsCommand = {
    reconciliationTypeUID: command.typeUID,
    date: command.date,
  };

  return reconciliationInputDatasetCommand;
}


export function mapToReconciliationImportInputDatasetCommand(command: ImportInputDatasetCommand)
  : ReconciliationImportInputDatasetCommand {
  const reconciliationInputDatasetCommand: ReconciliationImportInputDatasetCommand = {
    reconciliationTypeUID: command.typeUID,
    datasetType: command.datasetType,
    date: command.date,
  };

  return reconciliationInputDatasetCommand;
}
