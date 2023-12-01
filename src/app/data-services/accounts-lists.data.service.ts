/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService, Identifiable } from '@app/core';

import { AccountsListData, AccountsListEntry, AccountsListEntryFields, AccountsListType,
         FileReport } from '@app/models';


@Injectable()
export class AccountsListsDataService {


  constructor(private http: HttpService) { }


  getAccountsListsForEdition(): EmpObservable<Identifiable[]> {
    const path = `v2/financial-accounting/accounts-lists-for-edition`;

    return this.http.get<Identifiable[]>(path);
  }


  getClassificationsForSwapsCobertura(): EmpObservable<string[]> {
    const path = `v2/financial-accounting/accounts-lists-for-edition/SwapsCobertura/classifications`;

    return this.http.get<string[]>(path);
  }


  getPrestamosForPrestamosInterbancarios(): EmpObservable<Identifiable[]> {
    const path = `v2/financial-accounting/accounts-lists-for-edition/PrestamosInterbancarios/prestamos`;

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


  exportAccountsLists(type: string, keywords: string): EmpObservable<FileReport> {
    Assertion.assertValue(type, 'type');

    let path = `v2/financial-accounting/accounts-lists-for-edition/${type}/excel`;

    if (keywords) {
      path += `/?keywords=${keywords}`;
    }

    return this.http.get<FileReport>(path);
  }


  addAccountListEntry(type: AccountsListType,
                      entryFields: AccountsListEntryFields): EmpObservable<AccountsListEntry> {
    Assertion.assertValue(type, 'type');
    Assertion.assertValue(entryFields, 'entryFields');

    const path = `v2/financial-accounting/accounts-lists-for-edition/${type}`;

    return this.http.post<AccountsListEntry>(path, entryFields);
  }


  updateAccountListEntry(type: AccountsListType,
                         entryUID: string,
                         entryFields: AccountsListEntryFields): EmpObservable<AccountsListEntry> {
    Assertion.assertValue(type, 'type');
    Assertion.assertValue(entryUID, 'entryUID');
    Assertion.assertValue(entryFields, 'entryFields');

    const path = `v2/financial-accounting/accounts-lists-for-edition/${type}/${entryUID}`;

    return this.http.put<AccountsListEntry>(path, entryFields);
  }


  deleteAccountListEntry(type: AccountsListType,
                         entryUID: string,
                         entryFields: AccountsListEntryFields): EmpObservable<void> {
    Assertion.assertValue(type, 'type');
    Assertion.assertValue(entryUID, 'entryUID');
    Assertion.assertValue(entryFields, 'entryFields');

    const path = `v2/financial-accounting/accounts-lists-for-edition/${type}/${entryUID}`;

    return this.http.delete<void>(path, entryFields);
  }

}
