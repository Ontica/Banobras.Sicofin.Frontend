/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { DateSearchField } from './vouchers';


export enum TransactionSlipStatus {
  Pending  = 'Pending',
  Processed = 'Processed',
  ProcessedOK = 'ProcessedOK',
  ProcessedWithIssues = 'ProcessedWithIssues',
}


export const TransactionSlipStatusList: Identifiable[] = [
  {
    uid: TransactionSlipStatus.Pending,
    name: 'Pendientes',
  },
  {
    uid: TransactionSlipStatus.Processed,
    name: 'Procesados',
  },
  {
    uid: TransactionSlipStatus.ProcessedOK,
    name: 'Procesados sin errores',
  },
  {
    uid: TransactionSlipStatus.ProcessedWithIssues,
    name: 'Procesados con errores',
  },
];


export interface SearchTransactionSlipsCommand {
  accountsChartUID: string;
  systemUID: string;
  fromDate: DateString;
  toDate: DateString;
  dateSearchField: DateSearchField;
  status: TransactionSlipStatus;
  keywords?: string;
}


export const EmptySearchTransactionSlipsCommand: SearchTransactionSlipsCommand = {
  accountsChartUID: '',
  systemUID: '',
  fromDate: '',
  toDate: '',
  status: null,
  dateSearchField: DateSearchField.AccountingDate,
};


export interface TransactionSlipDescriptor {
  uid: string;
  slipNumber: string;
  concept: string;
  accountingDate: string;
  recordingDate: string;
  functionalArea: string;
  elaboratedBy: string;
  controlTotal: number;
  accountingVoucherId: number;
  statusName: string;
}


export const EmptyTransactionSlipDescriptor: TransactionSlipDescriptor = {
  uid: '',
  slipNumber: '',
  concept: '',
  accountingDate: '',
  recordingDate: '',
  functionalArea: '',
  elaboratedBy: '',
  controlTotal: 0,
  accountingVoucherId: 0,
  statusName: '',
};


export interface TransactionSlip {
  header: TransactionSlipDescriptor;
  entries: TransactionSlipEntry[];
  issues: TransactionSlipIssue[];
  voucher: Identifiable;
}


export const EmptyTransactionSlip: TransactionSlip = {
  header: EmptyTransactionSlipDescriptor,
  entries: [],
  issues: [],
  voucher: Empty,
};


export interface TransactionSlipEntry {
  uid: string;
  entryNumber: number;
  accountNumber: string;
  sectorCode: string;
  subledgerAccount: string;
  currencyCode: string;
  functionalArea: string;
  description: string;
  exchangeRate: number;
  debit: number;
  credit: number;
  issues: TransactionSlipIssue[];
}


export interface TransactionSlipIssue {
  description: string;
}
