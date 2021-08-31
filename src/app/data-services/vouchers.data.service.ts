/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { LedgerAccount, SearchVouchersCommand, SubsidiaryAccount, Voucher, VoucherFileData, VoucherDescriptor,
         VoucherEntry, VoucherEntryFields, VoucherFields } from '@app/models';


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


  getOpenedAccountingDates(ledgerUID: string): Observable<string[]> {
    const path = `v2/financial-accounting/vouchers/opened-accounting-dates/${ledgerUID}`;

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


  getVoucher(voucherId: number): Observable<Voucher> {
    const path = `v2/financial-accounting/vouchers/${voucherId}`;

    return this.http.get<Voucher>(path);
  }


  searchAccountsForEdition(voucherId: number, keywords: string): Observable<LedgerAccount[]> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(keywords, 'keywords');

    const path = `v2/financial-accounting/vouchers/${voucherId}/` +
      `search-accounts-for-edition?keywords=${keywords}`;

    return this.http.get<LedgerAccount[]>(path);
  }


  searchSubledgerAccountsForEdition(voucherId: number,
                                    accountId: number,
                                    keywords: string): Observable<SubsidiaryAccount[]> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(accountId, 'accountId');
    Assertion.assertValue(keywords, 'keywords');

    const path = `v2/financial-accounting/vouchers/${voucherId}/search-subledger-accounts-for-edition/` +
      `${accountId}/?keywords=${keywords}`;

    return this.http.get<SubsidiaryAccount[]>(path);
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


  importVouchersFromTextFile(file: File, dataFile: VoucherFileData): Observable<string> {
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(dataFile, 'dataFile');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('data', JSON.stringify(dataFile));

    const path = `v2/financial-accounting/vouchers/import-from-text-file`;

    return this.http.post<string>(path, formData);
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


  appendVoucherEntry(voucherId: number, voucherEntryFields: VoucherEntryFields): Observable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(voucherEntryFields, 'voucherEntryFields');

    const path = `v2/financial-accounting/vouchers/${voucherId}/entries`;

    return this.http.post<Voucher>(path, voucherEntryFields);
  }


  importVoucherEntriesFromExcel(voucherId: number, file: File): Observable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(file, 'fileToUpload');

    const formData: FormData = new FormData();
    formData.append('media', file);

    const path = `v2/financial-accounting/vouchers/${voucherId}/entries/import-from-excel`;

    return this.http.post<Voucher>(path, formData);
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
    const path = `v2/financial-accounting/vouchers/${voucherId}/entries/${voucherEntryId}`;

    return this.http.get<VoucherEntry>(path);
  }

}
