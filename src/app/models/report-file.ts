/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export interface FileReport {
  url: string;
  type?: FileReportType;
}


export enum FileReportType {
  Excel = 'Excel',
  PDF = 'PDF',
  Xml = 'Xml',
}
