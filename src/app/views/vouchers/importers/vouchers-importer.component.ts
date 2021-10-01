/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateStringLibrary, EventInfo } from '@app/core';

import { ImportVouchersDataService } from '@app/data-services';

import { EmptyImportVouchersResult, ImportVouchersResult, ImportVouchersTotals,
         ImportVouchersCommand } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FileType } from '@app/shared/form-controls/file-control/file-control-data';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { Observable } from 'rxjs';

import { ImporterDetailsTableEventType } from './importer-details-table.component';

export enum VouchersImporterEventType {
  CLOSE_MODAL_CLICKED  = 'VouchersImporterComponent.Event.CloseModalClicked',
  VOUCHERS_IMPORTED = 'VouchersImporterComponent.Event.VouchersImported',
}

enum VouchersImporterFormControls {
  distributeVouchers = 'distributeVouchers',
  generateSubledgerAccount = 'generateSubledgerAccount',
  canEditVoucherEntries = 'canEditVoucherEntries',
  recordingDate = 'recordingDate',
}

enum ImportTypes {
  excelFile = 'excelFile',
  txtFile = 'txtFile',
  dataBase = 'dataBase',
}

@Component({
  selector: 'emp-fa-vouchers-importer',
  templateUrl: './vouchers-importer.component.html',
})
export class VouchersImporterComponent {

  @Output() vouchersImporterEvent = new EventEmitter<EventInfo>();

  file = null;

  formHandler: FormHandler;

  controls = VouchersImporterFormControls;

  isFormInvalidated = false;

  isLoading = false;

  importTypes = ImportTypes;

  selectedImportType = ImportTypes.excelFile;

  selectedFileType: FileType = 'excel';

  importVouchersResult: ImportVouchersResult = EmptyImportVouchersResult;

  selectedPartsToImport: ImportVouchersTotals[] = [];

  executedDryRun = false;

  constructor(private importVouchersData: ImportVouchersDataService,
              private messageBox: MessageBoxService) {
    this.initForm();
  }


  get isExcelImport() {
    return this.selectedImportType === ImportTypes.excelFile;
  }

  get isTxtImport() {
    return this.selectedImportType === ImportTypes.txtFile;
  }

  get isDataBaseImport() {
    return this.selectedImportType === ImportTypes.dataBase;
  }


  get showFileError(): boolean {
    return this.isFormInvalidated && !this.file;
  }

  get isFileFormValid() {
    return this.isDataBaseImport ? true : this.formHandler.form.valid && this.file;
  }


  get isReadyForSubmit() {
    if (this.isDataBaseImport) {
      return this.executedDryRun && !this.importVouchersResult.hasErrors &&
        this.importVouchersResult.voucherTotals.length > 0;
    }

    if (this.isExcelImport) {
      return this.executedDryRun && this.isFileFormValid && this.selectedPartsToImport.length > 0;
    }

    return this.executedDryRun && this.isFileFormValid && !this.importVouchersResult.hasErrors &&
      this.importVouchersResult.voucherTotals.length > 0;
  }


  onClose() {
    sendEvent(this.vouchersImporterEvent, VouchersImporterEventType.CLOSE_MODAL_CLICKED);
  }


  onImportTypeChange() {
    this.file = null;
    this.selectedFileType = null;
    this.selectedFileType = this.isExcelImport ? 'excel' : this.selectedFileType;
    this.selectedFileType = this.isTxtImport ? 'txt' : this.selectedFileType;

    this.resetImportVouchersResult();
    this.resetForm();

    if (this.isDataBaseImport) {
      this.dryRunImportVouchers(this.importVouchersData.dryRunImportVouchersFromDatabase(this.getFormData()));
    }
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


  onSubmitDryRunImportVouchers() {
    if (this.setAndReturnIsFormInvalidated() || this.executedDryRun) {
      return;
    }

    let observable: any = null;

    switch (this.selectedImportType) {
      case ImportTypes.excelFile:
        observable =
          this.importVouchersData.dryRunImportVouchersFromExcelFile(this.file.file, this.getFormData());
        break;
      case ImportTypes.txtFile:
        observable =
          this.importVouchersData.dryRunImportVouchersFromTextFile(this.file.file, this.getFormData());
        break;
      case ImportTypes.dataBase:
        observable = this.importVouchersData.dryRunImportVouchersFromDatabase(this.getFormData());
        break;
      default:
        console.log(`Unhandled import type ${this.selectedImportType}`);
        return;
    }

    this.dryRunImportVouchers(observable);
  }


  onSubmitImportVouchers() {
    if (this.setAndReturnIsFormInvalidated() || !this.isReadyForSubmit ||
        this.importVouchersResult.hasErrors) {
      if (this.executedDryRun) {
        this.messageBox.showError('Se encontraron errores en los datos, favor de rectificar.');
      }
      return;
    }

    let observable: any = null;

    switch (this.selectedImportType) {
      case ImportTypes.excelFile:
        observable = this.importVouchersData.importVouchersFromExcelFile(this.file.file, this.getFormData());
        break;
      case ImportTypes.txtFile:
        observable = this.importVouchersData.importVouchersFromTextFile(this.file.file, this.getFormData());
        break;
      case ImportTypes.dataBase:
        observable = this.importVouchersData.importVouchersFromDatabase(this.getFormData());
        break;
      default:
        console.log(`Unhandled import type ${this.selectedImportType}`);
        return;
    }

    this.importVouchers(observable);
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        distributeVouchers: new FormControl(false),
        generateSubledgerAccount: new FormControl(false),
        canEditVoucherEntries: new FormControl(true),
        recordingDate: new FormControl(DateStringLibrary.today(), Validators.required),
      })
    );

    this.formHandler.form.valueChanges.subscribe(v => this.resetImportVouchersResult());
  }


  private resetForm() {
    this.formHandler.form.reset({
      distributeVouchers: false,
      generateSubledgerAccount: false,
      canEditVoucherEntries: true,
      recordingDate: DateStringLibrary.today(),
    });
  }


  private getFormData(): ImportVouchersCommand {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: ImportVouchersCommand = {
      distributeVouchers: formModel.distributeVouchers,
      generateSubledgerAccount: formModel.generateSubledgerAccount,
      canEditVoucherEntries: formModel.canEditVoucherEntries,
      recordingDate: formModel.recordingDate,
    };

    if (this.isExcelImport) {
      data.processOnly = this.selectedPartsToImport.map(x => x.uid);
    }

    return data;
  }


  private resetImportVouchersResult() {
    this.executedDryRun = false;
    this.importVouchersResult = EmptyImportVouchersResult;
    this.selectedPartsToImport = [];
  }


  private setAndReturnIsFormInvalidated(): boolean {
    this.isFormInvalidated = this.isFileFormValid ? false :
      !this.formHandler.validateReadyForSubmit() || !this.file;
    return this.isFormInvalidated;
  }


  private dryRunImportVouchers(importObservavble: Observable<ImportVouchersResult>) {
    this.isLoading = true;

    importObservavble
      .toPromise()
      .then(x => {
        this.executedDryRun = true;
        this.importVouchersResult = x;
        this.resolveDryRunImportVoucherResponse();
      })
      .finally(() => this.isLoading = false);
  }


  private importVouchers(importObservavble: Observable<ImportVouchersResult>) {
    this.isLoading = true;

    importObservavble
      .toPromise()
      .then(x => this.resolveImportVoucherResponse(x))
      .finally(() => this.isLoading = false);
  }


  private resolveDryRunImportVoucherResponse() {
    if (this.importVouchersResult.hasErrors) {
      const message = `No es posible realizar la importación, ya que se detectaron ` +
        `${this.importVouchersResult.errors.length} errores` +
        `${this.isDataBaseImport ? '' : ' en el archivo'}.`;
      this.messageBox.showError(message);
    }
  }


  private resolveImportVoucherResponse(response: ImportVouchersResult) {
    let message = '';

    if (response.hasErrors) {
      message = `No fue posible realizar la importación, ya que se detectaron ` +
        `${response.errors.length} errores` +
        `${this.isDataBaseImport ? '' : ' en el archivo'}.`;
      this.messageBox.showError(message);
      return;
    }

    message = `Se han importado ${response.voucherTotals.length} pólizas.`;
    this.messageBox.show(message, 'Importador de pólizas');
    sendEvent(this.vouchersImporterEvent, VouchersImporterEventType.VOUCHERS_IMPORTED);
  }

}
