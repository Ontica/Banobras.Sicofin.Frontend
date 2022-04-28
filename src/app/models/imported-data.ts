/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';

import { FileData, FileTypeAccepted } from '@app/shared/form-controls/file-control/file-control-data';

import { FileType as ReportingFileType } from './reporting';

export interface FieldConfig {
  show: boolean;
  label?: string;
  list: Identifiable[];
  required: boolean;
  multiple?: boolean;
}


export const DefaultFieldConfig: FieldConfig = {
  show: true,
  label: '',
  list: [],
  required: true,
  multiple: false,
}


export interface ExecuteDatasetsCommand {
  typeUID?: string | string[];
  additionalUID?: string | string[];
  fromDate?: DateString;
  toDate?: DateString;
}


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
