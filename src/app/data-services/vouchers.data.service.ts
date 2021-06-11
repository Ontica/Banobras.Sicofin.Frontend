/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService, Identifiable } from '@app/core';

import { SearchVouchersCommand, VoucherDescriptor } from '@app/models';


@Injectable()
export class VouchersDataService {

  constructor(private http: HttpService) { }


  getFunctionalAreas(): Observable<Identifiable[]> {
    const path = `v2/financial-accounting/vouchers/functional-areas`;

    return this.http.get<Identifiable[]>(path);
  }


  getTransactionTypes(): Observable<Identifiable[]> {
    const path = `v2/financial-accounting/vouchers/transaction-types`;

    return this.http.get<Identifiable[]>(path);
  }


  getVoucherTypes(): Observable<Identifiable[]> {
    const path = `v2/financial-accounting/vouchers/voucher-types`;

    return this.http.get<Identifiable[]>(path);
  }


  searchVouchers(searchVouchersCommand: SearchVouchersCommand): Observable<VoucherDescriptor[]> {
    Assertion.assertValue(searchVouchersCommand, 'searchVouchersCommand');

    const path = `v2/financial-accounting/vouchers`;

    return this.http.post<VoucherDescriptor[]>(path, searchVouchersCommand);
  }

}
