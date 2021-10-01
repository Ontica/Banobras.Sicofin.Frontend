/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, HttpService } from '@app/core';

import { ImportVouchersResult, Voucher, ImportVouchersCommand } from '@app/models';


@Injectable()
export class ImportVouchersDataService {

  constructor(private http: HttpService) { }


  dryRunImportVouchersFromDatabase(importVouchersCommand: ImportVouchersCommand):
    Observable<ImportVouchersResult> {
    Assertion.assertValue(importVouchersCommand, 'importVouchersCommand');

    const path = `v2/financial-accounting/vouchers/import-from-database/dry-run`;
    return this.http.post<ImportVouchersResult>(path, importVouchersCommand);
  }


  dryRunImportVouchersFromExcelFile(file: File, importVouchersCommand: ImportVouchersCommand):
    Observable<ImportVouchersResult> {
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(importVouchersCommand, 'importVouchersCommand');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('command', JSON.stringify(importVouchersCommand));

    const path = `v2/financial-accounting/vouchers/import-from-excel/dry-run`;

    return this.http.post<ImportVouchersResult>(path, formData);
  }


  dryRunImportVouchersFromTextFile(file: File, importVouchersCommand: ImportVouchersCommand):
    Observable<ImportVouchersResult> {
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(importVouchersCommand, 'importVouchersCommand');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('command', JSON.stringify(importVouchersCommand));

    const path = `v2/financial-accounting/vouchers/import-from-text-file/dry-run`;

    return this.http.post<ImportVouchersResult>(path, formData);
  }


  importVouchersFromDatabase(importVouchersCommand: ImportVouchersCommand): Observable<ImportVouchersResult> {
    Assertion.assertValue(importVouchersCommand, 'importVouchersCommand');

    const path = `v2/financial-accounting/vouchers/import-from-database`;
    return this.http.post<ImportVouchersResult>(path, importVouchersCommand);
  }


  importVouchersFromExcelFile(file: File, importVouchersCommand: ImportVouchersCommand):
    Observable<ImportVouchersResult> {
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(importVouchersCommand, 'importVouchersCommand');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('command', JSON.stringify(importVouchersCommand));

    const path = `v2/financial-accounting/vouchers/import-from-excel`;

    return this.http.post<ImportVouchersResult>(path, formData);
  }


  importVouchersFromTextFile(file: File, importVouchersCommand: ImportVouchersCommand):
    Observable<ImportVouchersResult> {
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(importVouchersCommand, 'importVouchersCommand');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('command', JSON.stringify(importVouchersCommand));

    const path = `v2/financial-accounting/vouchers/import-from-text-file`;

    return this.http.post<ImportVouchersResult>(path, formData);
  }


  dryRunImportVoucherEntriesFromExcelFile(voucherId: number,
                                          file: File,
                                          importVouchersCommand: ImportVouchersCommand)
                                          : Observable<ImportVouchersResult> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(importVouchersCommand, 'importVouchersCommand');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('command', JSON.stringify(importVouchersCommand));

    const path = `v2/financial-accounting/vouchers/${voucherId}/entries/import-from-excel/dry-run`;

    return this.http.post<ImportVouchersResult>(path, formData);
  }


  importVoucherEntriesFromExcelFile(voucherId: number,
                                    file: File,
                                    importVouchersCommand: ImportVouchersCommand): Observable<Voucher> {
    Assertion.assertValue(voucherId, 'voucherId');
    Assertion.assertValue(file, 'file');
    Assertion.assertValue(importVouchersCommand, 'importVouchersCommand');

    const formData: FormData = new FormData();
    formData.append('media', file);
    formData.append('command', JSON.stringify(importVouchersCommand));

    const path = `v2/financial-accounting/vouchers/${voucherId}/entries/import-from-excel`;

    return this.http.post<Voucher>(path, formData);
  }

}
