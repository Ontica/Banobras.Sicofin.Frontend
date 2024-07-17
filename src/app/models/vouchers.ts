/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Assertion, DateString, Empty, Identifiable } from '@app/core';

import { AccountsChartMasterData } from './accounts-chart';

import { EmptyLedgerAccount, EmptyLedgerAccountSectorRule, LedgerAccount,
         LedgerAccountSectorRule } from './ledgers';

import { FileReport } from './reporting';

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
  {uid: 'RecordingDate',  name: 'Fecha de elaboración'}
];


export const EditorTypeList: Identifiable[] = [
  {uid: EditorType.ElaboratedBy, name: 'Elaborada por'},
  {uid: EditorType.AuthorizedBy, name: 'Autorizada por'},
  {uid: EditorType.PostedBy,     name: 'Enviada a diario por'},
];


export enum VouchersOperationType {
  close            = 'close',
  sendToSupervisor = 'send-to-supervisor',
  reasign          = 'reasign',
  delete           = 'delete',
  clone            = 'clone',
  print            = 'print',
  excel            = 'excel',
}


export interface VouchersOperation extends Identifiable {
  uid: string;
  name: string;
  assignToRequired?: boolean;
}


export const VouchersOperationList: VouchersOperation[] = [
  {uid: VouchersOperationType.close,            name: 'Enviar al diario'},
  {uid: VouchersOperationType.sendToSupervisor, name: 'Enviar al supervisor'},
  {uid: VouchersOperationType.reasign,          name: 'Reasignar a', assignToRequired: true},
  {uid: VouchersOperationType.delete,           name: 'Eliminar'},
  {uid: VouchersOperationType.print,            name: 'Imprimir'},
  {uid: VouchersOperationType.excel,            name: 'Exportar movimientos'},
  {uid: VouchersOperationType.clone,            name: 'Clonar'}
];


export function getVoucherOperation(operationType: VouchersOperationType): VouchersOperation {
  return VouchersOperationList.find(x => x.uid === operationType);
}


export interface VouchersOperationCommand {
  vouchers: number[];
  assignToUID?: string;
}


export interface VouchersBulkOperationData {
  operation: VouchersOperationType,
  command: VouchersOperationCommand;
}


export interface VouchersOperationResult {
  message?: string;
  file?: FileReport;
  vouchers?: VoucherDescriptor[];
}


export interface VouchersQuery {
  stage: VoucherStage;
  accountsChartUID: string;
  keywords: string;
  status?: string;
  ledgerUID?: string;
  voucherTypeUID?: string;
  transactionTypeUID?: string;
  number?: string;
  voucherID?: string;
  concept?: string;
  verificationNumber?: string;
  accountKeywords?: string;
  subledgerAccountKeywords?: string;
  fromAccountingDate?: string;
  toAccountingDate?: string;
  fromRecordingDate?: string;
  toRecordingDate?: string;
  editorType?: EditorType;
  editorUID?: string;
}


export const EmptyVouchersQuery: VouchersQuery = {
  stage: VoucherStage.All,
  accountsChartUID: '',
  ledgerUID: '',
  keywords: '',
  editorType: EditorType.ElaboratedBy,
};


export interface VoucherFilterData {
  query: VouchersQuery;
  accountChart: AccountsChartMasterData;
  editor: Identifiable;
}


export const EmptyVoucherFilterData: VoucherFilterData = {
  query: Object.assign({}, EmptyVouchersQuery),
  accountChart: null,
  editor: null,
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
  editVoucher?: boolean;
  deleteVoucher: boolean;
  reviewVoucher?: boolean;
  sendToLedger?: boolean;
  sendToSupervisor?: boolean;
  changeConcept: boolean;
  cloneVoucher: boolean;
}


export const EmptyVoucherActions: VoucherActions = {
  editVoucher: false,
  deleteVoucher: false,
  reviewVoucher: false,
  sendToLedger: false,
  sendToSupervisor: false,
  changeConcept: false,
  cloneVoucher: false,
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
  uid: string;
  name: string;
  allowAllLedgersSelection: boolean;
  allowAllChildrenLedgersSelection: boolean;
  askForCalculationDateField: boolean;
  askForVoucherNumberField: boolean;
  calculationDateFieldName: string;
}


export interface VoucherSpecialCaseFields {
  calculationDate?: DateString;
  onVoucherNumber?: string;
  generateForAllChildrenLedgers?: boolean;
}


export interface VoucherFields extends VoucherSpecialCaseFields {
  voucherTypeUID: string;
  accountsChartUID: string;
  ledgerUID: string;
  accountingDate: DateString;
  concept?: string;
  functionalAreaId?: number;
  calculationDate?: DateString;
  onVoucherNumber?: string;
  generateForAllChildrenLedgers?: boolean;
}


export interface VoucherUpdateFields {
  concept: string;
  accountingDate: DateString;
  recordingDate: DateString;
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


export function isVoucherStageAll(viewName: string): boolean {
  return 'AccountingOperation.All' === viewName;
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
