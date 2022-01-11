/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { SearchTransactionSlipsCommand, TransactionSlip, TransactionSlipDescriptor } from '@app/models';


@Injectable()
export class TransactionSlipsDataService {

  constructor(private http: HttpService) { }


  searchTransactionSlips(command: SearchTransactionSlipsCommand): Observable<TransactionSlipDescriptor[]> {
    Assertion.assertValue(command, 'command');

    const path = `v2/financial-accounting/transaction-slips`;

    return this.http.post<TransactionSlipDescriptor[]>(path, command);
  }


  getTransactionSlip(transactionSlipUID: string): Observable<TransactionSlip> {
    Assertion.assertValue(transactionSlipUID, 'transactionSlipUID');

    const path = `v2/financial-accounting/transaction-slips/${transactionSlipUID}`;

    return this.http.get<TransactionSlip>(path);
  }

}
