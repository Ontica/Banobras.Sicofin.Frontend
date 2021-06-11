/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion, DateString, Empty, Identifiable } from '@app/core';


export enum VoucherStage {
  MyInbox = 'MyInbox',
  ControlDesk = 'ControlDesk',
  Pending = 'Pending',
  Completed = 'Completed',
  All = 'All',
}


export enum VoucherStatus {
  Undefined = 'Undefined',
  Control = 'Control',
  Elaboration = 'Elaboration',
  Revision = 'Revision',
  OnHold = 'OnHold',
  Posted = 'Posted',
  All = 'All',
}


export enum DateSearchField {
  None = 'None',
  AccountingDate = 'AccountingDate',
  RecordingDate = 'RecordingDate',
}


export const DateSearchFieldList: Identifiable[] = [
  {uid: 'AccountingDate', name: 'Fecha de afectación'},
  {uid: 'RecordingDate', name: 'Fecha de elaboración'}
];


export interface SearchVouchersCommand {
  accountsChartUID: string;
  keywords: string;
  ledgersGroupUID?: string;
  ledgerUID?: string;

  fromDate?: string;
  toDate?: string;
  dateSearchField?: DateSearchField;
  accountKeywords?: string;
  subledgerAccountKeywords?: string;
  transactionTypeUID?: string;
  voucherTypeUID?: string;

  stage: VoucherStage;
  status?: VoucherStatus;
  orderBy?: string;
  pageSize?: number;
  page?: number;
}


export const EmptySearchVouchersCommand: SearchVouchersCommand = {
  stage: VoucherStage.All,
  accountsChartUID: '',
  keywords: '',
};


export interface VoucherDescriptor {
  id: number;
  number: string;
  ledgerName: string;
  concept: string;
  transactionTypeName: string;
  voucherTypeName: string;
  sourceName: string;
  accountingDate: DateString;
  recordingDate: DateString;
  elaboratedBy: string;
  authorizedBy: string;
  status: string;
}


export const EmptyVoucherDescriptor: VoucherDescriptor = {
  id: 0,
  number: '',
  ledgerName: '',
  concept: '',
  transactionTypeName: '',
  voucherTypeName: '',
  sourceName: '',
  accountingDate: '',
  recordingDate: '',
  elaboratedBy: '',
  authorizedBy: '',
  status: '',
};


export enum VoucherEntryType {
  Debit = 'D',
  Credit = 'H'
}


export interface Voucher {
  id: number;
  number: string;
  accountsChart: Identifiable;
  ledger: Identifiable;
  concept: string;
  transactionType: Identifiable;
  voucherType: Identifiable;
  functionalArea: Identifiable;
  accountingDate: string;
  recordingDate: string;
  elaboratedBy: string;
  authorizedBy: string;
  status: string;
  entries: VoucherEntry[];
}


export const EmptyVoucher: Voucher = {
  id: 0,
  number: '',
  accountsChart: Empty,
  ledger: Empty,
  concept: '',
  transactionType: Empty,
  voucherType: Empty,
  functionalArea: Empty,
  accountingDate: '',
  recordingDate: '',
  elaboratedBy: '',
  authorizedBy: '',
  status: '',
  entries: [],
};


export interface VoucherEntry {
  id: number;
  voucherEntryType: VoucherEntryType;
  ledgerAccount: NumberedNamedEntity;
  sector: Identifiable;
  subledgerAccount: NumberedNamedEntity;
  concept: string;
  date: string;
  responsibilityArea: Identifiable;
  budgetConcept: string;
  availabilityCode: string;
  eventType: Identifiable;
  verificationNumber: string;
  debit: number;
  credit: number;
  currency: Identifiable;
  amount: number;
  exchangeRate: number;
  baseCurrencyAmount: number;
}


export interface NumberedNamedEntity {
  uid: string;
  number: string;
  name: string;
  fullName: string;
}


export function mapVoucherStageFromViewName(viewName: string): VoucherStage {
  switch (viewName) {
    case 'AccountingOperation.MyInbox':
      return VoucherStage.MyInbox;
    case 'AccountingOperation.ControlDesk':
      return VoucherStage.ControlDesk;
    case 'AccountingOperation.Finished':
      return VoucherStage.Completed;
    case 'AccountingOperation.All':
      return VoucherStage.All;
    default:
      throw Assertion.assertNoReachThisCode(`Unhandled transaction stage for view '${viewName}'.`);
  }
}
