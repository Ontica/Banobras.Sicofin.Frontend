/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { SubledgerAccountQuery, SubledgerAccount, SubledgerAccountDescriptor,
         SubledgerAccountFields } from '@app/models';


@Injectable()
export class SubledgerDataService {

  constructor(private http: HttpService) { }


  searchSubledgerAccounts(query: SubledgerAccountQuery): Observable<SubledgerAccountDescriptor[]> {
    Assertion.assertValue(query, 'query');

    const path = 'v2/financial-accounting/subledger-accounts/search';

    return this.http.post<SubledgerAccountDescriptor[]>(path, query);
  }


  getSubledgerAccount(subledgerAccountId: number): Observable<SubledgerAccount> {
    Assertion.assertValue(subledgerAccountId, 'subledgerAccountId');

    const path = `v2/financial-accounting/subledger-accounts/${subledgerAccountId}`;

    return this.http.get<SubledgerAccount>(path);
  }


  createSubledgerAccount(subledgerAccountFields: SubledgerAccountFields): Observable<SubledgerAccount> {
    Assertion.assertValue(subledgerAccountFields, 'subledgerAccountFields');

    const path = `v2/financial-accounting/subledger-accounts`;

    return this.http.post<SubledgerAccount>(path, subledgerAccountFields);
  }


  updateSubledgerAccount(subledgerAccountId: number,
                         subledgerAccountFields: SubledgerAccountFields): Observable<SubledgerAccount> {
    Assertion.assertValue(subledgerAccountId, 'subledgerAccountId');
    Assertion.assertValue(subledgerAccountFields, 'subledgerAccountFields');

    const path = `v2/financial-accounting/subledger-accounts/${subledgerAccountId}`;

    return this.http.put<SubledgerAccount>(path, subledgerAccountFields);
  }


  activateSubledgerAccount(subledgerAccountId: number): Observable<SubledgerAccount> {
    Assertion.assertValue(subledgerAccountId, 'subledgerAccountId');

    const path = `v2/financial-accounting/subledger-accounts/${subledgerAccountId}/activate`;

    return this.http.post<SubledgerAccount>(path);
  }


  suspendSubledgerAccount(subledgerAccountId: number): Observable<SubledgerAccount> {
    Assertion.assertValue(subledgerAccountId, 'subledgerAccountId');

    const path = `v2/financial-accounting/subledger-accounts/${subledgerAccountId}/suspend`;

    return this.http.post<SubledgerAccount>(path);
  }

}
