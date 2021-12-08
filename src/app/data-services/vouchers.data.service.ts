/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { FileReport, LedgerAccount, SearchVouchersCommand, SubledgerAccountDescriptor,
         Voucher, VoucherDescriptor, VoucherEntry, VoucherEntryFields, VoucherFields,
         VoucherSpecialCaseType, VouchersOperationCommand, VouchersOperationType,
         VouchersOperationResult } from '@app/models';


@Injectable()
export class VouchersDataService {

  constructor(private http: HttpService) { }


  getEventTypes(): Observable<Identifiable[]> {
    const path = `v2/financial-accounting/vouchers/event-types`;

    return this.http.get<Identifiable[]>(path);
  }


  getFunctionalAreas(): Observable<Identifiable[]> {
    const path = `v2/financial-accounting/vouchers/functional-areas`;

    return this.http.get<Identifiable[]>(path);
  }


  getOpenedAccountingDates(accountsChartUID: string): Observable<string[]> {
    Assertion.assertValue(accountsChartUID, 'accountsChartUID');

    const path = `v2/financial-accounting/vouchers/opened-accounting-dates/${accountsChartUID}`;

    return this.http.get<string[]>(path);
  }


  getTransactionTypes(): Observable<Identifiable[]> {
    const path = `v2/financial-accounting/vouchers/transaction-types`;

    return this.http.get<Identifiable[]>(path);
  }


  getVoucherTypes(): Observable<Identifiable[]> {
    const path = `v2/financial-accounting/vouchers/voucher-types`;

    return this.http.get<Identifiable[]>(path);
  }


  getVoucherSpecialCaseTypes(): Observable<VoucherSpecialCaseType[]> {
    const path = `v2/financial-accounting/vouchers/special-case-types`;

    return this.http.get<VoucherSpecialCaseType[]>(path);
  }


  getVoucher(voucherId: number): Observable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');

    const path = `v2/financial-accounting/vouchers/${voucherId}`;

    return this.http.get<Voucher>(path);
  }


  getVoucherForPrint(voucherId: number): Observable<FileReport> {
    Assertion.assertValue(voucherId, 'voucherId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/print`;

    return this.http.get<FileReport>(path);
  }


  searchAccountsForEdition(voucherId: number, keywords: string): Observable<LedgerAccount[]> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(keywords, 'keywords');

    const path = `v2/financial-accounting/vouchers/${voucherId}/` +
      `search-accounts-for-edition?keywords=${keywords}`;

    return this.http.get<LedgerAccount[]>(path);
  }


  searchEditors(keywords: string): Observable<Identifiable[]> {
    Assertion.assertValue(keywords, 'keywords');

    const path = `v2/financial-accounting/vouchers/editors?keywords=${keywords}`;

    return this.http.get<Identifiable[]>(path);
  }


  searchSubledgerAccountsForEdition(voucherId: number,
                                    accountId: number,
                                    keywords: string): Observable<SubledgerAccountDescriptor[]> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(accountId, 'accountId');
    Assertion.assertValue(keywords, 'keywords');

    const path = `v2/financial-accounting/vouchers/${voucherId}/search-subledger-accounts-for-edition/` +
      `${accountId}/?keywords=${keywords}`;

    return this.http.get<SubledgerAccountDescriptor[]>(path);
  }


  searchVouchers(searchVouchersCommand: SearchVouchersCommand): Observable<VoucherDescriptor[]> {
    Assertion.assertValue(searchVouchersCommand, 'searchVouchersCommand');

    const path = `v2/financial-accounting/vouchers`;

    return this.http.post<VoucherDescriptor[]>(path, searchVouchersCommand);
  }


  createVoucher(voucherFields: VoucherFields): Observable<Voucher> {
    Assertion.assertValue(voucherFields, 'voucherFields');

    const path = `v2/financial-accounting/vouchers/create-voucher`;

    return this.http.post<Voucher>(path, voucherFields);
  }


  createVoucherSpecialCase(voucherFields: VoucherFields): Observable<Voucher> {
    Assertion.assertValue(voucherFields, 'voucherFields');

    const path = `v2/financial-accounting/vouchers/special-case/create-voucher`;

    return this.http.post<Voucher>(path, voucherFields);
  }


  updateVoucher(voucherId: number, voucherFields: VoucherFields): Observable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(voucherFields, 'voucherFields');

    const path = `v2/financial-accounting/vouchers/${voucherId}`;

    return this.http.put<Voucher>(path, voucherFields);
  }


  validateVoucher(voucherId: number): Observable<string[]> {
    Assertion.assertValue(voucherId, 'voucherId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/validate`;

    return this.http.get<string[]>(path);
  }


  closeVoucher(voucherId: number): Observable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/close`;

    return this.http.post<Voucher>(path);
  }


  deleteVoucher(voucherId: number): Observable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');

    const path = `v2/financial-accounting/vouchers/${voucherId}`;

    return this.http.delete<Voucher>(path);
  }


  bulkOperationVouchers(operationType: VouchersOperationType,
                        command: VouchersOperationCommand): Observable<VouchersOperationResult> {
    Assertion.assertValue(operationType, 'operationType');
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/vouchers/bulk-operation/${operationType}`;

    return this.http.post<VouchersOperationResult>(path, command);
  }


  assignAccountToVoucher(voucherId: number, standardAccountId: number): Observable<LedgerAccount> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(standardAccountId, 'standardAccountId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/assign-account/${standardAccountId}`;

    return this.http.post<LedgerAccount>(path);
  }


  appendVoucherEntry(voucherId: number, voucherEntryFields: VoucherEntryFields): Observable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(voucherEntryFields, 'voucherEntryFields');

    const path = `v2/financial-accounting/vouchers/${voucherId}/entries`;

    return this.http.post<Voucher>(path, voucherEntryFields);
  }


  updateVoucherEntry(voucherId: number,
                     voucherEntryId: number,
                     voucherEntryFields: VoucherEntryFields): Observable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(voucherEntryId, 'voucherEntryId');
    Assertion.assertValue(voucherEntryFields, 'voucherEntryFields');

    const path = `v2/financial-accounting/vouchers/${voucherId}/entries/${voucherEntryId}`;

    return this.http.put<Voucher>(path, voucherEntryFields);
  }


  deleteVoucherEntry(voucherId: number, voucherEntryId: number): Observable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(voucherEntryId, 'voucherEntryId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/entries/${voucherEntryId}`;

    return this.http.delete<Voucher>(path);
  }


  getCopyOfLastEntry(voucherId: number): Observable<VoucherEntry> {
    Assertion.assertValue(voucherId, 'voucherId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/get-copy-of-last-entry`;

    return this.http.get<VoucherEntry>(path);
  }


  getVoucherEntry(voucherId: number, voucherEntryId: number): Observable<VoucherEntry> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(voucherEntryId, 'voucherEntryId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/entries/${voucherEntryId}`;

    return this.http.get<VoucherEntry>(path);
  }

}
