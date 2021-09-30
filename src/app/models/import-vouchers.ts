/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';


export interface ImportVouchersCommand {
  distributeVouchers: string;
  generateSubledgerAccount: string;
  canEditVoucherEntries: string;
  recordingDate: string;
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
