/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { SearchVouchersCommand, Voucher, VoucherDescriptor, VoucherFields } from '@app/models';


@Injectable()
export class VouchersDataService {

  constructor(private http: HttpService) { }


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


  getVoucher(idVoucher: number): Observable<Voucher> {
    const path = `v2/financial-accounting/vouchers/${idVoucher}`;

    return this.http.get<Voucher>(path);
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

}
