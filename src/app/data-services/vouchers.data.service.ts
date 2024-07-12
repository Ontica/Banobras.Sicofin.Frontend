/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { FileReport, LedgerAccount, VouchersQuery, SubledgerAccountDescriptor,
         Voucher, VoucherDescriptor, VoucherEntry, VoucherEntryFields, VoucherFields,
         VoucherSpecialCaseType, VouchersOperationCommand, VouchersOperationType,
         VouchersOperationResult } from '@app/models';


@Injectable()
export class VouchersDataService {

  constructor(private http: HttpService) { }


  getEventTypes(): EmpObservable<Identifiable[]> {
    const path = `v2/financial-accounting/vouchers/event-types`;

    return this.http.get<Identifiable[]>(path);
  }


  getFunctionalAreas(): EmpObservable<Identifiable[]> {
    const path = `v2/financial-accounting/vouchers/functional-areas`;

    return this.http.get<Identifiable[]>(path);
  }


  getOpenedAccountingDates(accountsChartUID: string): EmpObservable<string[]> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');

    const path = `v2/financial-accounting/vouchers/opened-accounting-dates/${accountsChartUID}`;

    return this.http.get<string[]>(path);
  }


  getTransactionTypes(): EmpObservable<Identifiable[]> {
    const path = `v2/financial-accounting/vouchers/transaction-types`;

    return this.http.get<Identifiable[]>(path);
  }


  getVoucherTypes(): EmpObservable<Identifiable[]> {
    const path = `v2/financial-accounting/vouchers/voucher-types`;

    return this.http.get<Identifiable[]>(path);
  }


  getVoucherStatus(): EmpObservable<Identifiable[]> {
    const path = `v2/financial-accounting/vouchers/status-list`;

    return this.http.get<Identifiable[]>(path);
  }


  getVoucherSpecialCaseTypes(): EmpObservable<VoucherSpecialCaseType[]> {
    const path = `v2/financial-accounting/vouchers/special-case-types`;

    return this.http.get<VoucherSpecialCaseType[]>(path);
  }


  getTransactionalSystems(): EmpObservable<Identifiable[]> {
    const path = `v2/financial-accounting/vouchers/transactional-systems`;

    return this.http.get<Identifiable[]>(path);
  }


  getVoucher(voucherId: number): EmpObservable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');

    const path = `v2/financial-accounting/vouchers/${voucherId}`;

    return this.http.get<Voucher>(path);
  }


  getVoucherForPrint(voucherId: number): EmpObservable<FileReport> {
    Assertion.assertValue(voucherId, 'voucherId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/print`;

    return this.http.get<FileReport>(path);
  }


  exportVoucherEntries(voucherId: number): EmpObservable<FileReport> {
    Assertion.assertValue(voucherId, 'voucherId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/excel`;

    return this.http.get<FileReport>(path);
  }


  searchAccountsForEdition(voucherId: number, keywords: string): EmpObservable<LedgerAccount[]> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(keywords, 'keywords');

    const path = `v2/financial-accounting/vouchers/${voucherId}/` +
      `search-accounts-for-edition?keywords=${keywords}`;

    return this.http.get<LedgerAccount[]>(path);
  }


  searchEditors(keywords: string): EmpObservable<Identifiable[]> {
    Assertion.assertValue(keywords, 'keywords');

    const path = `v2/financial-accounting/vouchers/editors?keywords=${keywords}`;

    return this.http.get<Identifiable[]>(path);
  }


  searchSubledgerAccountsForEdition(voucherId: number,
                                    accountId: number,
                                    keywords: string): EmpObservable<SubledgerAccountDescriptor[]> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(accountId, 'accountId');
    Assertion.assertValue(keywords, 'keywords');

    const path = `v2/financial-accounting/vouchers/${voucherId}/search-subledger-accounts-for-edition/` +
      `${accountId}/?keywords=${keywords}`;

    return this.http.get<SubledgerAccountDescriptor[]>(path);
  }


  searchVouchers(query: VouchersQuery): EmpObservable<VoucherDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/vouchers`;

    return this.http.post<VoucherDescriptor[]>(path, query);
  }


  createVoucher(voucherFields: VoucherFields): EmpObservable<Voucher> {
    Assertion.assertValue(voucherFields, 'voucherFields');

    const path = `v2/financial-accounting/vouchers/create-voucher`;

    return this.http.post<Voucher>(path, voucherFields);
  }


  createVoucherSpecialCase(voucherFields: VoucherFields): EmpObservable<Voucher> {
    Assertion.assertValue(voucherFields, 'voucherFields');

    const path = `v2/financial-accounting/vouchers/special-case/create-voucher`;

    return this.http.post<Voucher>(path, voucherFields);
  }


  createAllVouchersSpecialCase(voucherFields: VoucherFields): EmpObservable<string> {
    Assertion.assertValue(voucherFields, 'voucherFields');

    const path = `v2/financial-accounting/vouchers/special-case/create-all-vouchers`;

    return this.http.post<string>(path, voucherFields);
  }


  updateVoucher(voucherId: number, voucherFields: VoucherFields): EmpObservable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(voucherFields, 'voucherFields');

    const path = `v2/financial-accounting/vouchers/${voucherId}`;

    return this.http.put<Voucher>(path, voucherFields);
  }


  validateVoucher(voucherId: number): EmpObservable<string[]> {
    Assertion.assertValue(voucherId, 'voucherId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/validate`;

    return this.http.get<string[]>(path);
  }


  sendVoucherToSupervision(voucherId: number): EmpObservable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/send-to-supervisor`;

    return this.http.post<Voucher>(path);
  }


  closeVoucher(voucherId: number): EmpObservable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/close`;

    return this.http.post<Voucher>(path);
  }


  deleteVoucher(voucherId: number): EmpObservable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');

    const path = `v2/financial-accounting/vouchers/${voucherId}`;

    return this.http.delete<Voucher>(path);
  }


  bulkOperationVouchers(operationType: VouchersOperationType,
                        command: VouchersOperationCommand): EmpObservable<VouchersOperationResult> {
    Assertion.assertValue(operationType, 'operationType');
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/vouchers/bulk-operation/${operationType}`;

    return this.http.post<VouchersOperationResult>(path, command);
  }


  assignAccountToVoucher(voucherId: number, standardAccountId: number): EmpObservable<LedgerAccount> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(standardAccountId, 'standardAccountId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/assign-account/${standardAccountId}`;

    return this.http.post<LedgerAccount>(path);
  }


  appendVoucherEntry(voucherId: number, voucherEntryFields: VoucherEntryFields): EmpObservable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(voucherEntryFields, 'voucherEntryFields');

    const path = `v2/financial-accounting/vouchers/${voucherId}/entries`;

    return this.http.post<Voucher>(path, voucherEntryFields);
  }


  updateVoucherEntry(voucherId: number,
                     voucherEntryId: number,
                     voucherEntryFields: VoucherEntryFields): EmpObservable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(voucherEntryId, 'voucherEntryId');
    Assertion.assertValue(voucherEntryFields, 'voucherEntryFields');

    const path = `v2/financial-accounting/vouchers/${voucherId}/entries/${voucherEntryId}`;

    return this.http.put<Voucher>(path, voucherEntryFields);
  }


  deleteVoucherEntry(voucherId: number, voucherEntryId: number): EmpObservable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(voucherEntryId, 'voucherEntryId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/entries/${voucherEntryId}`;

    return this.http.delete<Voucher>(path);
  }


  getCopyOfLastEntry(voucherId: number): EmpObservable<VoucherEntry> {
    Assertion.assertValue(voucherId, 'voucherId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/get-copy-of-last-entry`;

    return this.http.get<VoucherEntry>(path);
  }


  getVoucherEntry(voucherId: number, voucherEntryId: number): EmpObservable<VoucherEntry> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(voucherEntryId, 'voucherEntryId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/entries/${voucherEntryId}`;

    return this.http.get<VoucherEntry>(path);
  }

}
