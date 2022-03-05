/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { FileData, FileTypeAccepted } from '@app/shared/form-controls/file-control/file-control-data';

import { FileType as ReportingFileType } from './reporting';


export interface InputDatasetsCommand {
  typeUID: string;
  date: DateString;
}


export interface InputDatasetType {
  name: string;
  type: string;
  fileType: ReportingFileType;
  optional: boolean;
  count: number;
}


export interface InputDataset {
  uid: string;
  datasetType: string;
  datasetTypeName: string;
  elaborationDate: DateString;
  elaboratedBy: DateString;
  fileType: ReportingFileType;
  fileSize: number;
  url: string;
}


export interface ImportDatasets {
  loaded: InputDataset[];
  missing: InputDatasetType[];
}


export const EmptyImportDatasets: ImportDatasets = {
  loaded: [],
  missing: [],
};


export interface ImportInputDatasetCommand {
  typeUID?: string;
  datasetType?: string;
  date: DateString;
}


export interface ReconciliationType extends Identifiable {
  uid: string;
  name: string;
}


export interface ReconciliationInputDatasetsCommand {
  reconciliationTypeUID: string;
  date: DateString;
}


export interface ReconciliationImportInputDatasetCommand {
  reconciliationTypeUID?: string;
  datasetType?: string;
  date: DateString;
}


export interface ReconciliationDatasets extends ImportDatasets {
  loaded: InputDataset[];
  missing: InputDatasetType[];
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


export function mapToFileDataFromInputDataset(data: InputDataset): FileData {
  const fileData: FileData = {
    uid: data.uid,
    tag: data.datasetTypeName,
    file: null,
    name: data.datasetTypeName,
    size: data.fileSize ?? 0,
    type: getFileTypeFromReportingFileType(data.fileType),
    url: data.url,
  };

  return fileData;
}


function getFileTypeFromReportingFileType(fileType: ReportingFileType) {
  switch (fileType) {
    case ReportingFileType.Csv:
      return FileTypeAccepted.csv;
    case ReportingFileType.Excel:
      return FileTypeAccepted.excel;
    default:
      return FileTypeAccepted.all;
  }
}
