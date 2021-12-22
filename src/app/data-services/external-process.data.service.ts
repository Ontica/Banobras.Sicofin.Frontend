/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { ExternalProcessTypes, RentabilidadExternalProcessCommand } from '@app/models';


@Injectable()
export class ExternalProcessDataService {

  constructor(private http: HttpService) { }


  executeExternalProcess(externalProcessType: ExternalProcessTypes,
                         externalProcessCommand: RentabilidadExternalProcessCommand): Observable<string> {
    Assertion.assertValue(externalProcessCommand, 'externalProcessCommand');

    const path = `v2/financial-accounting/integration/external-processes/${externalProcessType}`;

    return this.http.post<string>(path, externalProcessCommand);
  }

}
