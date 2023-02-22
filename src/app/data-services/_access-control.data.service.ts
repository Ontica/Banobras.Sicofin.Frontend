/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpService, Identifiable } from '@app/core';


@Injectable()
export class AccessControlDataService {

  constructor(private http: HttpService) { }


  getContexts(): Observable<Identifiable[]> {
    const path = `v4/onepoint/security/management/contexts`;

    return this.http.get<Identifiable[]>(path);
  }

}
