/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion, DateString, Empty, Identifiable } from '@app/core';

import { EmptyLedgerAccount, EmptyLedgerAccountSectorRule, LedgerAccount,
         LedgerAccountSectorRule } from './ledgers';

import { EmptySubledgerAccountDescriptor, SubledgerAccountDescriptor } from './subledgers';

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


export enum EditorType {
  ElaboratedBy = 'ElaboratedBy',
  AuthorizedBy = 'AuthorizedBy',
  PostedBy = 'PostedBy',
}


export const DateSearchFieldList: Identifiable[] = [
  {uid: 'AccountingDate', name: 'Fecha de afectación'},
  {uid: 'RecordingDate', name: 'Fecha de elaboración'}
];


export const EditorTypeList: Identifiable[] = [
  {uid: EditorType.ElaboratedBy, name: 'Elaborada por'},
  {uid: EditorType.AuthorizedBy, name: 'Autorizada por'},
  {uid: EditorType.PostedBy, name: 'Enviada a diario por'},
];


export interface SearchVouchersCommand {
  accountsChartUID: string;
  keywords: string;
  number?: string;
  concept?: string;
  ledgerUID?: string;

  fromDate?: string;
  toDate?: string;
  dateSearchField?: DateSearchField;
  accountKeywords?: string;
  subledgerAccountKeywords?: string;
  transactionTypeUID?: string;
  voucherTypeUID?: string;
  editorType?: EditorType;
  editorUID?: string;

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
  ledgerUID: '',
  editorType: EditorType.ElaboratedBy,
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


export const VoucherEntryTypeList: Identifiable[] = [
  {
    uid: 'Debit',
    name: 'Cargo',
  },
  {
    uid: 'Credit',
    name: 'Abono',
  },
];


export interface VoucherActions {
  reviewVoucher?: boolean;
  sendToLedger?: boolean;
  sendToSupervisor?: boolean;
}


export const EmptyVoucherActions: VoucherActions = {
  reviewVoucher: false,
  sendToLedger: false,
  sendToSupervisor: false,
};


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
  entries: VoucherEntryDescriptor[];
  actions: VoucherActions;
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
  actions: EmptyVoucherActions,
};


export function isOpenVoucher(status: string): boolean {
  return status === 'Pendiente';
}


export function mapVoucherDescriptorFromVoucher(voucher: Voucher): VoucherDescriptor {
  return {
    id: voucher.id,
    number: voucher.number,
    ledgerName: voucher.ledger.name,
    concept: voucher.concept,
    transactionTypeName: voucher.transactionType.name,
    voucherTypeName: voucher.voucherType.name,
    sourceName: voucher.functionalArea.name,
    accountingDate: voucher.accountingDate,
    recordingDate: voucher.recordingDate,
    elaboratedBy: voucher.elaboratedBy,
    authorizedBy: voucher.authorizedBy,
    status: voucher.status,
  };
}


export enum VoucherCreatorCases {
  Manual = 'Manual',
  Special = 'Special',
}


export interface VoucherSpecialCaseType extends Identifiable {
  askForCalculationDateField: boolean;
  askForVoucherNumberField: boolean;
  calculationDateFieldName: string;
}


export interface VoucherFields {
  voucherTypeUID: string;
  concept: string;
  ledgerUID: string;
  functionalAreaId: number;
  accountingDate: string;
  calculationDate?: DateString;
  onVoucherNumber?: string;
}


export interface NumberedNamedEntity {
  uid: string;
  number: string;
  name: string;
  fullName: string;
}


export const EmptyNumberedNamedEntity: NumberedNamedEntity = {
  uid: '',
  number: '',
  name: '',
  fullName: '',
};


export interface VoucherEntry {
  id: number;
  voucherEntryType: VoucherEntryType;
  ledgerAccount: LedgerAccount;
  sector: LedgerAccountSectorRule;
  subledgerAccount: SubledgerAccountDescriptor;
  concept: string;
  date: string;
  responsibilityArea: Identifiable;
  budgetConcept: string;
  eventType: Identifiable;
  verificationNumber: string;
  currency: Identifiable;
  amount: number;
  exchangeRate: number;
  baseCurrencyAmount: number;
}


export const EmptyVoucherEntry: VoucherEntry = {
  id: 0,
  voucherEntryType: VoucherEntryType.Debit,
  ledgerAccount: EmptyLedgerAccount,
  sector: EmptyLedgerAccountSectorRule,
  subledgerAccount: EmptySubledgerAccountDescriptor,
  concept: '',
  date: '',
  responsibilityArea: Empty,
  budgetConcept: '',
  eventType: Empty,
  verificationNumber: '',
  currency: Empty,
  amount: 0,
  exchangeRate: 0,
  baseCurrencyAmount: 0,
};


export enum VoucherEntryItemType {
  AccountEntry = 'AccountEntry',
  PartialEntry = 'PartialEntry',
  TotalsEntry = 'TotalsEntry',
}


export interface VoucherEntryDescriptor {
  id: number;
  voucherEntryType: VoucherEntryType;
  accountNumber: string;
  accountName: string;
  subledgerAccountNumber: string;
  subledgerAccountName: string;
  sector: string;
  verificationNumber: string;
  responsibilityArea: string;
  currency: string;
  exchangeRate: number;
  partial: number;
  debit: number;
  credit: number;
  itemType: VoucherEntryItemType;
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


export interface VoucherEntryFields {
  voucherId: number;
  referenceEntryId: number;
  voucherEntryType: VoucherEntryType;
  ledgerAccountId: number;
  sectorId: number;
  subledgerAccountId: number;
  currencyUID: string;
  amount: number;
  exchangeRate: number;
  baseCurrencyAmount: number;
  responsibilityAreaId: number;
  budgetConcept: string;
  eventTypeId: number;
  verificationNumber: string;
  date?: DateString;
  concept: string;
}
