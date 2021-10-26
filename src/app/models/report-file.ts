/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export interface ExcelFile {
  url: string;
}


export enum ReportFileType {
  excel = 'excel',
  pdf = 'pdf',
  xml = 'xml',
}
