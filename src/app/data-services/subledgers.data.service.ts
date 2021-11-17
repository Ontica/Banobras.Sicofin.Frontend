/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { SearchSubledgerAccountCommand, SubledgerAccountDescriptor } from '@app/models';


@Injectable()
export class SubledgerDataService {

  constructor(private http: HttpService) { }


  searchSubledgerAccounts(command: SearchSubledgerAccountCommand): Observable<SubledgerAccountDescriptor[]> {
    Assertion.assertValue(command, 'command');

    const path = 'v2/financial-accounting/subledger-accounts/search';

    return this.http.post<SubledgerAccountDescriptor[]>(path, command);
  }

}
