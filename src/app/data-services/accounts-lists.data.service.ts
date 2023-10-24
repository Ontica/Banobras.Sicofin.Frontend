/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { AccountsListData } from '@app/models';


@Injectable()
export class AccountsListsDataService {


  constructor(private http: HttpService) { }


  getAccountsListsForEdition(): EmpObservable<Identifiable[]> {
    const path = `v2/financial-accounting/accounts-lists-for-edition`;

    return this.http.get<Identifiable[]>(path);
  }


  searchAccountsLists(type: string, keywords: string): EmpObservable<AccountsListData> {
    Assertion.assertValue(type, 'type');

    let path = `v2/financial-accounting/accounts-lists-for-edition/${type}`;

    if (keywords) {
      path += `/?keywords=${keywords}`;
    }

    return this.http.get<AccountsListData>(path);
  }

}
