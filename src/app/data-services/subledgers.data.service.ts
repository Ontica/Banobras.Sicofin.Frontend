/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { Subledger } from '@app/models';


@Injectable()
export class SubledgerDataService {

  constructor(private http: HttpService) { }


  getSubledgers(ledgerUID: string): Observable<Subledger[]> {
    Assertion.assertValue(ledgerUID, 'ledgerUID');

    const path = `v2/financial-accounting/ledgers/${ledgerUID}/subledgers`;

    return this.http.get<Subledger[]>(path);
  }

}
