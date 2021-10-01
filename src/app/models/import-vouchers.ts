/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, DateStringLibrary, Identifiable } from '@app/core';


export interface ImportVouchersCommand {
  distributeVouchers: boolean;
  generateSubledgerAccount: boolean;
  canEditVoucherEntries: boolean;
  recordingDate: DateString;
  processOnly?: string[];
}


export interface ImportVouchersResult {
  hasErrors: boolean;
  errors: Identifiable[];
  warnings: Identifiable[];
  voucherTotals: ImportVouchersTotals[];
}


export interface ImportVouchersTotals {
  uid: string;
  description: string;
  vouchersCount: number;
  errorsCount: number;
  warningsCount: number;
}


export const EmptyImportVouchersResult: ImportVouchersResult = {
  hasErrors: false,
  errors: [],
  warnings: [],
  voucherTotals: [],
};


export const EmptyImportVouchersCommand: ImportVouchersCommand = {
  distributeVouchers: false,
  generateSubledgerAccount: false,
  canEditVoucherEntries: false,
  recordingDate: DateStringLibrary.today(),
};
