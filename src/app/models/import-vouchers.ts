/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';


export interface ImportVouchersCommand {
  allowUnbalancedVouchers: boolean;
  generateSubledgerAccount: boolean;
  canEditVoucherEntries: boolean;
  voucherTypeUID: string;
  accountsChartUID?: string;
  accountingDate?: DateString;
  processOnly?: string[];
}


export interface ImportVouchersResult {
  hasErrors: boolean;
  isRunning: boolean;
  errors: Identifiable[];
  warnings: Identifiable[];
  vouchersCount: number;
  voucherTotals: ImportVouchersTotals[];
}


export interface ImportVouchersTotals {
  uid: string;
  description: string;
  vouchersCount: number;
  processedCount: number;
  errorsCount: number;
  warningsCount: number;
}


export const EmptyImportVouchersResult: ImportVouchersResult = {
  hasErrors: false,
  isRunning: false,
  errors: [],
  warnings: [],
  vouchersCount: 0,
  voucherTotals: [],
};


export const EmptyImportVouchersCommand: ImportVouchersCommand = {
  allowUnbalancedVouchers: false,
  generateSubledgerAccount: false,
  canEditVoucherEntries: false,
  voucherTypeUID: '',
};
