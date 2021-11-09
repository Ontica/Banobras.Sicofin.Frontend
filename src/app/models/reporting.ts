/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export enum ReportGroup {
  ReportesFiscales = 'ReportesFiscales',
  ReportesRegulatorios = 'ReportesRegulatorios',
  ReportesOperativos = 'ReportesOperativos',
}


export interface ReportType {
  uid: string;
  name: string;
  group: string;
  accountsCharts: string[];
  payloadType: ReportPayloadType;
  exportTo: FileType[];
}


export enum ReportPayloadType {
  AccountsChartAndDate = 'AccountsChartAndDate',
}


export interface FileReport {
  url: string;
  type?: FileType;
}


export enum FileType {
  Excel = 'Excel',
  PDF = 'PDF',
  Xml = 'Xml',
}
