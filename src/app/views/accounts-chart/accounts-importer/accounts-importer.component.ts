/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { PERMISSIONS } from '@app/main-layout';

import { MessageBoxService } from '@app/shared/services';

import { FormatLibrary, FormHelper, sendEvent } from '@app/shared/utils';

import { AccountsEditionDataService } from '@app/data-services';

import { ImportAccountsResult, ImportAccountsCommand, AccountsChartMasterData} from '@app/models';


export enum AccountsImporterEventType {
  CLOSE_MODAL_CLICKED  = 'AccountsImporterComponent.Event.CloseModalClicked',
  ACCOUNTS_IMPORTED    = 'AccountsImporterComponent.Event.AccountsImported',
}

interface AccountsImporterFormModel extends FormGroup<{
  accountsChartUID: FormControl<string>;
  applicationDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-fa-accounts-importer',
  templateUrl: './accounts-importer.component.html',
})
export class AccountsImporterComponent implements OnInit, OnDestroy {

  @Output() accountsImporterEvent = new EventEmitter<EventInfo>();

  permissions = PERMISSIONS;

  title = 'Importador de cambios al catálogo';

  file = null;

  form: AccountsImporterFormModel;

  formHelper = FormHelper;

  isFormInvalidated = false;

  isLoading = false;

  isLoadingAccountChart = false;

  accountsChartMasterDataList: Identifiable[] = [];

  importResult: ImportAccountsResult[] = [];

  executedDryRun = false;

  executedImported = false;

  hasErrors = false;

  accountsTotal = 0;

  errorsTotal = 0;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private accountsData: AccountsEditionDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit() {
    this.loadAccountsCharts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get showFileError(): boolean {
    return this.isFormInvalidated && !this.file;
  }


  get isFileFormValid(): boolean {
    return this.form.valid && this.file;
  }


  get isReadyForSubmit(): boolean {
    return this.executedDryRun && !this.executedImported &&
           this.isFileFormValid && !this.hasErrors && this.accountsTotal > 0;
  }


  onClose() {
    sendEvent(this.accountsImporterEvent, AccountsImporterEventType.CLOSE_MODAL_CLICKED);
  }


  onFileControlChange(file) {
    this.file = file;
    this.resetImportResult();
  }


  onSubmitDryRunImportAccounts() {
    if (this.setAndReturnIsFormInvalidated() || this.executedDryRun) {
      return;
    }

    this.executeUpdateAccountsFromExcel(true);
  }


  onSubmitImportAccounts() {
    if (this.hasErrorSubmitImport()) {
      return;
    }

    this.showConfirmUpdateMessage();
  }


  private loadAccountsCharts() {
    this.isLoadingAccountChart = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.isLoadingAccountChart = false;
      });
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      accountsChartUID: ['', Validators.required],
      applicationDate: ['' as DateString, Validators.required],
    });

    this.form.valueChanges.subscribe(v => this.resetImportResult());
  }


  private resetImportResult() {
    if (this.executedImported) {
      return;
    }

    this.executedDryRun = false;
    this.executedImported = false
    this.setImportResult([]);
  }


  private setImportResult(result: ImportAccountsResult[]) {
    this.importResult = result ?? [];
    this.hasErrors = this.importResult.some(x => x.errors > 0);
    this.accountsTotal = this.importResult.reduce((sum, x) => sum + x.count, 0);
    this.errorsTotal = this.importResult.reduce((sum, x) => sum + x.errors, 0);
  }


  private hasErrorSubmitImport(): boolean {
    if (this.setAndReturnIsFormInvalidated() || !this.isReadyForSubmit || this.hasErrors) {
      this.showErrorMessage();
      return true;
    }

    return false;
  }


  private setAndReturnIsFormInvalidated(): boolean {
    this.isFormInvalidated = this.isFileFormValid ? false :
      !this.formHelper.isFormReadyAndInvalidate(this.form) || !this.file;

    return this.isFormInvalidated;
  }


  private showErrorMessage() {
    if (!this.executedDryRun) {
      return;
    }

    if (this.hasErrors) {
      this.messageBox.showError('Se encontraron errores en los datos.');
    }
  }


  private showConfirmUpdateMessage() {
    this.messageBox.confirm(this.getConfirmUpdateMessage(), this.title)
      .firstValue()
      .then(x => {
        if (x) {
          this.executeUpdateAccountsFromExcel(false);
        }
      });
  }


  private getConfirmUpdateMessage(): string {
    const partsToImport = '<ul class="info-list">' +
      this.importResult.map(x => '<li>' + x.operation + '</li>').join('') + '</ul>';

    return `Esta operación afectara ` +
           `<strong>${FormatLibrary.numberWithCommas(this.accountsTotal)} cuentas</strong> ` +
           `al realizar las siguientes operaciones : <br><br>${partsToImport} <br>¿Importo las cuentas?`;
  }


  private executeUpdateAccountsFromExcel(dryRun: boolean) {
    this.isLoading = true;

    const command: ImportAccountsCommand = this.getFormData(dryRun);

    this.accountsData.updateAccountsChartFromExcel(this.file.file, command)
      .firstValue()
      .then(x => this.resolveImportResult(x, dryRun))
      .finally(() => this.isLoading = false);
  }


  private getFormData(dryRun: boolean): ImportAccountsCommand {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: ImportAccountsCommand = {
      accountsChartUID: formModel.accountsChartUID,
      applicationDate: formModel.applicationDate,
      dryRun: dryRun,
    };

    return data;
  }


  private resolveImportResult(result: ImportAccountsResult[], isDryRun: boolean) {
    this.setImportResult(result);

    if (isDryRun) {
      this.resolveDryRunResponse();
    } else {
      this.resolveUpdateResponse();
    }
  }


  private resolveDryRunResponse() {
    this.executedDryRun = true;

    if (this.hasErrors) {
      this.showImportResultErrorMessage();
    }
  }


  private resolveUpdateResponse() {
    if (this.hasErrors) {
      this.showImportResultErrorMessage();
    } else {
      this.executedImported = true;
      this.formHelper.setDisableForm(this.form);
      this.showImportResultSuccessMessage();
      sendEvent(this.accountsImporterEvent, AccountsImporterEventType.ACCOUNTS_IMPORTED);
    }
  }


  private showImportResultSuccessMessage() {
    const message = `Se han importado ${this.accountsTotal} cuentas.`;
    this.messageBox.show(message, this.title);
  }


  private showImportResultErrorMessage() {
    const message = `No es posible realizar la importación, ya que se detectaron ` +
      `<strong>${this.errorsTotal} errores</strong> en el archivo.`;
    this.messageBox.showError(message);
  }

}
