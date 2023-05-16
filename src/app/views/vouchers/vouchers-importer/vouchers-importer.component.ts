/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { combineLatest, Observable } from 'rxjs';

import { Assertion, DateStringLibrary, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { PERMISSIONS } from '@app/main-layout';

import { ImportVouchersDataService, VouchersDataService } from '@app/data-services';

import { EmptyImportVouchersResult, ImportVouchersResult, ImportVouchersTotals,
         ImportVouchersCommand } from '@app/models';

import { AccountChartStateSelector,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FileType } from '@app/shared/form-controls/file-control/file-control-data';

import { FormatLibrary, FormHandler, sendEvent } from '@app/shared/utils';

import { ImporterDetailsSelectionType,
         VouchersImporterDetailsTableEventType } from './importer-details-table.component';


export enum VouchersImporterEventType {
  CLOSE_MODAL_CLICKED  = 'VouchersImporterComponent.Event.CloseModalClicked',
  VOUCHERS_IMPORTED = 'VouchersImporterComponent.Event.VouchersImported',
}

enum VouchersImporterFormControls {
  allowUnbalancedVouchers = 'allowUnbalancedVouchers',
  generateSubledgerAccount = 'generateSubledgerAccount',
  canEditVoucherEntries = 'canEditVoucherEntries',
  accountsChartUID = 'accountsChartUID',
  accountingDate = 'accountingDate',
  voucherTypeUID = 'voucherTypeUID',
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
export class VouchersImporterComponent implements OnInit, OnDestroy {

  @Output() vouchersImporterEvent = new EventEmitter<EventInfo>();

  permissions = PERMISSIONS;

  title = 'Importador de pólizas';
  file = null;

  formHandler: FormHandler;
  controls = VouchersImporterFormControls;
  isFormInvalidated = false;

  isLoading = false;
  isLoadingDataLists = false;
  isLoadingAccountingDates = false;

  importTypes = ImportTypes;
  voucherTypesList: Identifiable[] = [];
  accountsChartMasterDataList: Identifiable[] = [];
  accountingDatesList: Identifiable[] = [];
  hasValueDate = false;

  selectedImportType = ImportTypes.excelFile;
  selectedFileType: FileType = 'excel';

  importerDetailsSelectionType: ImporterDetailsSelectionType = ImporterDetailsSelectionType.MULTI;

  importVouchersResult: ImportVouchersResult = EmptyImportVouchersResult;
  selectedPartsToImport: ImportVouchersTotals[] = [];
  executedDryRun = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private importVouchersData: ImportVouchersDataService,
              private vouchersData: VouchersDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit(): void {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
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
      return this.executedDryRun && !this.importVouchersResult.isRunning &&
        this.selectedPartsToImport.length === 1;
    }

    if (this.isExcelImport) {
      return this.executedDryRun && this.isFileFormValid && this.selectedPartsToImport.length > 0;
    }

    return this.executedDryRun && this.isFileFormValid && !this.importVouchersResult.hasErrors &&
      this.importVouchersResult.voucherTotals.length > 0;
  }


  get descriptionColumnText() {
    if (this.isExcelImport) {
      return 'Hoja';
    }

    if (this.isDataBaseImport) {
      return 'Sistema';
    }

    return 'Parte';
  }


  onClose() {
    sendEvent(this.vouchersImporterEvent, VouchersImporterEventType.CLOSE_MODAL_CLICKED);
  }


  onImportTypeChange() {
    this.resetFileAndDateFields();
    this.setImporterDetailsSelectionType();
    this.resetImportVouchersResult();
    this.resetForm();
    this.validateRequiredFormFields();

    if (this.isDataBaseImport) {
      const observable = this.importVouchersData.getStatusImportVouchersFromDatabase()
      this.importVouchers(observable, true);
    }
  }


  onFileControlChange(file) {
    this.file = file;
    this.resetImportVouchersResult();
  }


  onAccountChartChanges(accountChart: Identifiable) {
    if (this.isExcelImport) {
      this.formHandler.getControl(this.controls.accountingDate).reset();
      this.getOpenedAccountingDates(accountChart.uid);
    }
  }


  onHasValueDateChange() {
    this.formHandler.getControl(this.controls.accountingDate).reset();
  }


  onVouchersImporterDetailsTableEvent(event: EventInfo) {
    if (event.type === VouchersImporterDetailsTableEventType.CHECK_CLICKED) {
      Assertion.assertValue(event.payload.selection, 'event.payload.selection');
      this.selectedPartsToImport = event.payload.selection as ImportVouchersTotals[];
    }
  }


  onGetStatusImportVouchersFromDatabase() {
    this.resetImportVouchersResult();
    const observable = this.importVouchersData.getStatusImportVouchersFromDatabase()
    this.importVouchers(observable, true);
  }


  onSubmitDryRunImportVouchers() {
    if (this.setAndReturnIsFormInvalidated() || this.executedDryRun) {
      return;
    }

    this.validateExecuteImportVouchers(true);
  }


  onSubmitImportVouchers() {
    if (this.hasErrorSubmitImportVouchers()) {
      return;
    }

    if (this.isDataBaseImport) {
      this.showConfirmMessage();
      return;
    }

    this.validateExecuteImportVouchers(false);
  }


  private loadDataLists() {
    this.isLoadingDataLists = true;

    combineLatest([
      this.helper.select<Identifiable[]>(VoucherStateSelector.VOUCHER_TYPES_LIST),
      this.helper.select<Identifiable[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
    ])
    .subscribe(([a, b]) => {
      this.voucherTypesList = a;
      this.accountsChartMasterDataList = b;
      this.isLoadingDataLists = false;
    });
  }


  private getOpenedAccountingDates(accountsChartUID: string) {
    this.accountingDatesList = [];

    if (!accountsChartUID) {
      return;
    }

    this.isLoadingAccountingDates = true;

    this.vouchersData.getOpenedAccountingDates(accountsChartUID)
      .toPromise()
      .then(x => {
        this.accountingDatesList =
          x.map(item => Object.create({ uid: item, name: DateStringLibrary.format(item) }));
      })
      .finally(() => this.isLoadingAccountingDates = false);
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new UntypedFormGroup({
        allowUnbalancedVouchers: new UntypedFormControl(false),
        generateSubledgerAccount: new UntypedFormControl(false),
        canEditVoucherEntries: new UntypedFormControl(true),
        accountsChartUID: new UntypedFormControl('', Validators.required),
        accountingDate: new UntypedFormControl('', Validators.required),
        voucherTypeUID: new UntypedFormControl('', Validators.required),
      })
    );

    this.formHandler.form.valueChanges.subscribe(v => this.resetImportVouchersResult());
  }


  private resetForm() {
    this.formHandler.form.reset({
      allowUnbalancedVouchers: false,
      generateSubledgerAccount: false,
      canEditVoucherEntries: true,
      accountsChartUID: '',
      accountingDate: '',
      voucherTypeUID: '',
    });
  }


  private resetFileAndDateFields() {
    this.file = null;

    this.selectedFileType = null;
    this.selectedFileType = this.isExcelImport ? 'excel' : this.selectedFileType;
    this.selectedFileType = this.isTxtImport ? 'txt' : this.selectedFileType;

    this.accountingDatesList = [];
    this.hasValueDate = false;
  }


  private setImporterDetailsSelectionType() {
    this.importerDetailsSelectionType = ImporterDetailsSelectionType.NONE;

    if (this.isExcelImport) {
      this.importerDetailsSelectionType = ImporterDetailsSelectionType.MULTI;
      return;
    }

    if (this.isDataBaseImport) {
      this.importerDetailsSelectionType = ImporterDetailsSelectionType.UNIQUE;
    }
  }


  private validateRequiredFormFields() {
    if (this.isDataBaseImport) {
      this.formHandler.clearControlValidators(this.controls.voucherTypeUID);
      this.formHandler.clearControlValidators(this.controls.accountsChartUID);
      this.formHandler.clearControlValidators(this.controls.accountingDate);
    }

    if (this.isTxtImport) {
      this.formHandler.setControlValidators(this.controls.voucherTypeUID, Validators.required);
      this.formHandler.setControlValidators(this.controls.accountsChartUID, Validators.required);
      this.formHandler.clearControlValidators(this.controls.accountingDate);
    }

    if (this.isExcelImport) {
      this.formHandler.setControlValidators(this.controls.voucherTypeUID, Validators.required);
      this.formHandler.setControlValidators(this.controls.accountsChartUID, Validators.required);
      this.formHandler.setControlValidators(this.controls.accountingDate, Validators.required);
    }
  }


  private getFormData(dryRun: boolean): ImportVouchersCommand {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: ImportVouchersCommand = {
      dryRun: dryRun,
      allowUnbalancedVouchers: formModel.allowUnbalancedVouchers,
      generateSubledgerAccount: formModel.generateSubledgerAccount,
      canEditVoucherEntries: formModel.canEditVoucherEntries,
      voucherTypeUID: formModel.voucherTypeUID,
    };

    this.validateFieldsByImportType(data);

    return data;
  }


  private validateFieldsByImportType(data: ImportVouchersCommand) {
    const formModel = this.formHandler.form.getRawValue();

    if (this.isExcelImport) {
      data.accountsChartUID = formModel.accountsChartUID;
      data.accountingDate = formModel.accountingDate;
      data.processOnly = this.selectedPartsToImport.map(x => x.uid);
    }

    if (this.isTxtImport) {
      data.accountsChartUID = formModel.accountsChartUID;
    }

    if (this.isDataBaseImport) {
      data.processOnly = this.selectedPartsToImport.map(x => x.uid);
    }
  }


  private resetImportVouchersResult() {
    this.executedDryRun = false;
    this.importVouchersResult = EmptyImportVouchersResult;
    this.selectedPartsToImport = [];
  }


  private hasErrorSubmitImportVouchers(): boolean {
    if (this.setAndReturnIsFormInvalidated() || !this.isReadyForSubmit ||
        this.importVouchersResult.hasErrors) {
      this.showErrorMessage();
      return true;
    }

    return false;
  }


  private setAndReturnIsFormInvalidated(): boolean {
    this.isFormInvalidated = this.isFileFormValid ? false :
      !this.formHandler.validateReadyForSubmit() || !this.file;
    return this.isFormInvalidated;
  }


  private showErrorMessage() {
    if (!this.executedDryRun) {
      return;
    }

    if (this.importVouchersResult.hasErrors) {
      this.messageBox.showError('Se encontraron errores en los datos.');
      return;
    }

    if (this.isDataBaseImport && this.importVouchersResult.isRunning) {
      this.messageBox.show('El importador de pólizas ya está en ejecución.', this.title);
      return;
    }

    if ((this.isDataBaseImport || this.isExcelImport ) && this.selectedPartsToImport.length === 0) {
      this.messageBox.showError('Seleccionar los datos a importar.');
    }
  }


  private showConfirmMessage() {
    this.messageBox.confirm(this.getConfirmMessage(), this.title)
      .toPromise()
      .then(x => {
        if (x) {
          this.validateExecuteImportVouchers(false);
        }
      });
  }


  private getConfirmMessage(): string {
    const vouchersTotal = this.selectedPartsToImport.reduce((s, c) => s + c.vouchersCount, 0);
    const partsToImport = '<ul class="info-list">' +
      this.selectedPartsToImport.map(x => '<li>' + x.description + '</li>').join('') + '</ul>';

    return `Esta operación importará ` +
           `<strong>${FormatLibrary.numberWithCommas(vouchersTotal)} pólizas</strong> ` +
           `desde: <br><br>${partsToImport} <br>¿Importo las pólizas?`;
  }


  private validateExecuteImportVouchers(dryRun: boolean) {
    let observable: any = null;

    switch (this.selectedImportType) {
      case ImportTypes.excelFile:
        observable = this.importVouchersData.importVouchersFromExcelFile(this.file.file, this.getFormData(dryRun));
        break;
      case ImportTypes.txtFile:
        observable = this.importVouchersData.importVouchersFromTextFile(this.file.file, this.getFormData(dryRun));
        break;
      case ImportTypes.dataBase:
        if (dryRun) {
          observable = this.importVouchersData.getStatusImportVouchersFromDatabase();
        } else {
          observable = this.importVouchersData.importVouchersFromDatabase(this.getFormData(null));
        }
        break;
      default:
        console.log(`Unhandled import type ${this.selectedImportType}`);
        return;
    }

    this.importVouchers(observable, dryRun);
  }


  private importVouchers(importObservable: Observable<ImportVouchersResult>, dryRun: boolean) {
    this.isLoading = true;

    importObservable
      .toPromise()
      .then(x => {
        if (dryRun) {
          this.resolveDryRunImportVouchersResult(x);
        } else {
          this.resolveImportVouchersResult(x)
        }
      })
      .finally(() => this.isLoading = false);
  }


  private resolveDryRunImportVouchersResult(response: ImportVouchersResult) {
    this.executedDryRun = true;
    this.importVouchersResult = response ?? EmptyImportVouchersResult;

    if (!this.isDataBaseImport && this.importVouchersResult.hasErrors) {
      const message = `No es posible realizar la importación, ya que se detectaron ` +
        `${this.importVouchersResult.errors.length} errores en el archivo.`;
      this.messageBox.showError(message);
    }
  }


  private resolveImportVouchersResult(response: ImportVouchersResult) {
    let message = '';

    if (this.isDataBaseImport) {
      this.importVouchersResult = response;
      this.selectedPartsToImport = [];
      message = `Se ha iniciado la importación de pólizas de sistemas tranversales.`;
      this.messageBox.show(message, this.title);
      return;
    }

    if (response.hasErrors) {
      message = `No fue posible realizar la importación, ya que se detectaron ` +
        `${response.errors.length} errores` +
        `${this.isDataBaseImport ? '' : ' en el archivo'}.`;
      this.messageBox.showError(message);
      return;
    }

    message = `Se han importado ${response.vouchersCount} pólizas.`;
    this.messageBox.show(message, this.title);
    sendEvent(this.vouchersImporterEvent, VouchersImporterEventType.VOUCHERS_IMPORTED);
  }

}
