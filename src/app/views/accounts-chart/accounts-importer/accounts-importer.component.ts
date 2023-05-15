/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsEditionDataService } from '@app/data-services';

import { ImportAccountsResult, ImportAccountsCommand, AccountsChartMasterData} from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormatLibrary, FormHandler, sendEvent } from '@app/shared/utils';

import { PERMISSIONS } from '@app/main-layout';

export enum AccountsImporterEventType {
  CLOSE_MODAL_CLICKED  = 'AccountsImporterComponent.Event.CloseModalClicked',
  ACCOUNTS_IMPORTED = 'AccountsImporterComponent.Event.AccountsImported',
}

enum AccountsImporterFormControls {
  accountsChartUID = 'accountsChartUID',
  applicationDate = 'applicationDate',
}

@Component({
  selector: 'emp-fa-accounts-importer',
  templateUrl: './accounts-importer.component.html',
})
export class AccountsImporterComponent implements OnInit, OnDestroy {

  @Output() accountsImporterEvent = new EventEmitter<EventInfo>();

  permissions = PERMISSIONS;

  title = 'Importador de cambios al catálogo';

  file = null;

  formHandler: FormHandler;

  controls = AccountsImporterFormControls;

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


  ngOnInit(): void {
    this.loadAccountsCharts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get showFileError(): boolean {
    return this.isFormInvalidated && !this.file;
  }


  get isFileFormValid() {
    return this.formHandler.form.valid && this.file;
  }


  get isReadyForSubmit() {
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
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        accountsChartUID: new FormControl('', Validators.required),
        applicationDate: new FormControl('', Validators.required),
      })
    );

    this.formHandler.form.valueChanges.subscribe(v => this.resetImportResult());
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
      !this.formHandler.validateReadyForSubmit() || !this.file;

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
      .toPromise()
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
      .toPromise()
      .then(x => this.resolveImportResult(x, dryRun))
      .finally(() => this.isLoading = false);
  }


  private getFormData(dryRun: boolean): ImportAccountsCommand {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

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
      this.formHandler.disableForm();
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
