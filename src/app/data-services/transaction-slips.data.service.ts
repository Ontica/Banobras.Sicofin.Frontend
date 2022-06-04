/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { FileReport, TransactionSlipsQuery, TransactionSlip, TransactionSlipDescriptor,
         TransactionSlipExportationType } from '@app/models';


@Injectable()
export class TransactionSlipsDataService {

  constructor(private http: HttpService) { }


  searchTransactionSlips(query: TransactionSlipsQuery): Observable<TransactionSlipDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/transaction-slips`;

    return this.http.post<TransactionSlipDescriptor[]>(path, query);
  }


  exportTransactionSlips(exportationType: TransactionSlipExportationType,
                         query: TransactionSlipsQuery): Observable<FileReport> {
    Assertion.assertValue(exportationType, 'exportationType');
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/transaction-slips/export/${exportationType}`;

    return this.http.post<FileReport>(path, query);
  }


  getTransactionSlip(transactionSlipUID: string): Observable<TransactionSlip> {
    Assertion.assertValue(transactionSlipUID, 'transactionSlipUID');

    const path = `v2/financial-accounting/transaction-slips/${transactionSlipUID}`;

    return this.http.get<TransactionSlip>(path);
  }

}
