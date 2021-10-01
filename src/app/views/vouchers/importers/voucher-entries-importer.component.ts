/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { ImportVouchersDataService } from '@app/data-services';

import { EmptyImportVouchersCommand, EmptyImportVouchersResult, EmptyVoucher, ImportVouchersCommand,
        ImportVouchersResult, ImportVouchersTotals, Voucher } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { ImporterDetailsTableEventType } from './importer-details-table.component';

export enum VoucherEntriesImporterEventType {
  CLOSE_MODAL_CLICKED  = 'VoucherEntriesImporterComponent.Event.CloseModalClicked',
  VOUCHER_ENTRIES_IMPORTED = 'VoucherEntriesImporterComponent.Event.VoucherEntriesImported',
}

@Component({
  selector: 'emp-fa-voucher-entries-importer',
  templateUrl: './voucher-entries-importer.component.html',
})
export class VoucherEntriesImporterComponent {

  @Input() voucher: Voucher = EmptyVoucher;

  @Output() voucherEntriesImporterEvent = new EventEmitter<EventInfo>();

  file = null;

  importVouchersResult: ImportVouchersResult = EmptyImportVouchersResult;

  selectedPartsToImport: ImportVouchersTotals[] = [];

  executedDryRun = false;

  isFormInvalidated = false;

  isLoading = false;

  constructor(private importVouchersData: ImportVouchersDataService,
              private messageBox: MessageBoxService){}

  get showFileError(): boolean {
    return this.isFormInvalidated && !this.file;
  }


  get isReadyForSubmitDryRun() {
    return !this.executedDryRun && !!this.file;
  }


  get isReadyForSubmitImport() {
    return this.executedDryRun && !!this.file && this.selectedPartsToImport.length > 0;
  }


  onClose() {
    sendEvent(this.voucherEntriesImporterEvent, VoucherEntriesImporterEventType.CLOSE_MODAL_CLICKED);
  }


  onFileControlChange(file) {
    this.file = file;
    this.resetImportVouchersResult();
  }


   onImporterDetailsTableEvent(event) {
    if (event.type === ImporterDetailsTableEventType.CHECK_CLICKED) {
      Assertion.assertValue(event.payload.selection, 'event.payload.selection');
      this.selectedPartsToImport = event.payload.selection as ImportVouchersTotals[];
    }
  }


  onSubmitDryRunImportVoucherEntries() {
    if (this.isReadyForSubmitDryRun) {
      this.dryRunImportVoucherEntriesFromExcelFile(this.file.file);
    } else {
      this.isFormInvalidated = !this.file;
    }
  }


  onSubmitImportVoucherEntries() {
    if (this.executedDryRun) {
      if (!this.isReadyForSubmitImport) {
        this.messageBox.showError('Se encontraron errores en los datos, favor de rectificar.');
        return;
      }
      this.importVoucherEntriesFromExcelFile(this.file.file);
    }
  }


  private resetImportVouchersResult() {
    this.executedDryRun = false;
    this.importVouchersResult = EmptyImportVouchersResult;
    this.selectedPartsToImport = [];
  }


  private dryRunImportVoucherEntriesFromExcelFile(file: File) {
    this.isLoading = true;

    this.importVouchersData.dryRunImportVoucherEntriesFromExcelFile(this.voucher.id, file, this.getCommand())
      .toPromise()
      .then(x => {
        this.executedDryRun = true;
        this.importVouchersResult = x;
        this.resolveDryRunImportVoucherEntriesResponse();
      })
      .finally(() => this.isLoading = false);
  }


  private importVoucherEntriesFromExcelFile(file: File) {
    this.isLoading = true;

    this.importVouchersData.importVoucherEntriesFromExcelFile(this.voucher.id, file, this.getCommand())
      .toPromise()
      .then(x => {
        sendEvent(this.voucherEntriesImporterEvent, VoucherEntriesImporterEventType.VOUCHER_ENTRIES_IMPORTED,
          {voucher: x});
      })
      .finally(() => this.isLoading = false);
  }


  private getCommand(): ImportVouchersCommand {
    const data: ImportVouchersCommand = Object.assign({}, EmptyImportVouchersCommand,
      {processOnly: this.selectedPartsToImport.map(x => x.uid)});

    return data;
  }


  private resolveDryRunImportVoucherEntriesResponse() {
    if (this.importVouchersResult.hasErrors) {
      const message = `No es posible realizar la importación, ya que se detectaron ` +
        `${this.importVouchersResult.errors.length} errores en el archivo.`;
      this.messageBox.showError(message);
    }
  }

}
