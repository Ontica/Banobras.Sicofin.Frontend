/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { LedgerAccount, SearchVouchersCommand, SubsidiaryAccount, Voucher, VoucherDescriptor,
         VoucherEntryFields, VoucherFields } from '@app/models';


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


  updateVoucher(voucherId: number, voucherFields: VoucherFields): Observable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(voucherFields, 'voucherFields');

    const path = `v2/financial-accounting/vouchers/${voucherId}`;

    return this.http.put<Voucher>(path, voucherFields);
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


  deleteVoucherEntry(voucherId: number, voucherEntryId: number): Observable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(voucherEntryId, 'voucherEntryId');

    const path = `v2/financial-accounting/vouchers/${voucherId}/entries/${voucherEntryId}`;

    return this.http.delete<Voucher>(path);
  }

}
