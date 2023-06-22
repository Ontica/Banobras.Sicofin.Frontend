/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Assertion, EmpObservable, HttpService } from '@app/core';

import { ImportVouchersResult, ImportVouchersCommand } from '@app/models';


@Injectable()
export class ImportVouchersDataService {

  constructor(private http: HttpService) { }


  getStatusImportVouchersFromDatabase(): EmpObservable<ImportVouchersResult> {
    const path = `v2/financial-accounting/vouchers/import-from-database/status`;

    return this.http.get<ImportVouchersResult>(path);
  }


  importVouchersFromDatabase(importVouchersCommand: ImportVouchersCommand): EmpObservable<ImportVouchersResult> {
    Assertion.assertValue(importVouchersCommand, 'importVouchersCommand');

    const path = `v2/financial-accounting/vouchers/import-from-database`;

    return this.http.post<ImportVouchersResult>(path, importVouchersCommand);
  }


  importVouchersFromExcelFile(file: File, importVouchersCommand: ImportVouchersCommand):
    EmpObservable<ImportVouchersResult> {
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(importVouchersCommand, 'importVouchersCommand');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('command', JSON.stringify(importVouchersCommand));

    const path = `v2/financial-accounting/vouchers/import-from-excel`;

    return this.http.post<ImportVouchersResult>(path, formData);
  }


  importVouchersFromTextFile(file: File, importVouchersCommand: ImportVouchersCommand):
    EmpObservable<ImportVouchersResult> {
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(importVouchersCommand, 'importVouchersCommand');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('command', JSON.stringify(importVouchersCommand));

    const path = `v2/financial-accounting/vouchers/import-from-text-file`;

    return this.http.post<ImportVouchersResult>(path, formData);
  }

}
