/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { LockedUpBalancesData, LockedUpBalancesQuery } from '@app/models';


@Injectable()
export class ReportingDataService {

  constructor(private http: HttpService) { }


  getLockedUpBalances(query: LockedUpBalancesQuery): Observable<LockedUpBalancesData> {
    Assertion.assertValue(query, 'query');

    const path = `v2/financial-accounting/locked-up-balances`;

    return this.http.post<LockedUpBalancesData>(path, query);
  }

}
