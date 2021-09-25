/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateStringLibrary, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { VouchersDataService } from '@app/data-services';

import { AccountsChartMasterData, VoucherFileData } from '@app/models';

import { AccountChartStateSelector,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FileType } from '@app/shared/form-controls/file-control/file-control-data';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { combineLatest } from 'rxjs';

export enum VouchersUploaderEventType {
  CLOSE_MODAL_CLICKED  = 'VouchersUploaderComponent.Event.CloseModalClicked',
  VOUCHERS_IMPORTED = 'VouchersUploaderComponent.Event.VouchersImported',
}

enum VouchersUploaderFormControls {
  recordingDate = 'recordingDate',
  accountsChartUID = 'accountsChartUID',
  transactionTypeUID = 'transactionTypeUID',
  distributeVouchers = 'distributeVouchers',
  generateSubledgerAccount = 'generateSubledgerAccount',
  canEditVoucherEntries = 'canEditVoucherEntries',
  excelSheets = 'excelSheets',
}

@Component({
  selector: 'emp-fa-vouchers-uploader',
  templateUrl: './vouchers-uploader.component.html',
})
export class VouchersUploaderComponent implements OnInit, OnDestroy {

  @Output() vouchersUploaderEvent = new EventEmitter<EventInfo>();

  file = null;

  formHandler: FormHandler;

  controls = VouchersUploaderFormControls;

  isFormInvalidated = false;

  isLoading = false;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  transactionTypesList: Identifiable[] = [];

  helper: SubscriptionHelper;

  fileType: FileType = 'excel';

  excelSheetsList: Identifiable[] = [];

  constructor(private uiLayer: PresentationLayer,
              private vouchersData: VouchersDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit(): void {
    this.loadDataLists();
    this.generateExcelSheetsList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get showFileError(): boolean {
    return this.isFormInvalidated && !this.file;
  }


  onClose() {
    sendEvent(this.vouchersUploaderEvent, VouchersUploaderEventType.CLOSE_MODAL_CLICKED);
  }


  onFileTypeChange() {
    this.file = null;
    this.formHandler.getControl(this.controls.excelSheets).reset();
    this.formHandler.setControlValidators(this.controls.excelSheets,
      this.fileType === 'excel' ? Validators.required : null);
  }


  onExcelSheetsChanges() {
    const excelSheets: string[] = this.formHandler.getControl(this.controls.excelSheets).value;
    const excelSheetsOrdered = excelSheets.sort((a, b) => +a - +b);
    this.formHandler.getControl(this.controls.excelSheets).reset(excelSheetsOrdered);
  }


  onSubmitForm() {
    this.isFormInvalidated = !this.formHandler.validateReadyForSubmit() || !this.file;

    if (this.isFormInvalidated) {
      this.formHandler.invalidateForm();
      return;
    }

    if (this.fileType === 'excel') {
      this.importVouchersFromExcelFile(this.file.file, this.getFormData());
      return;
    }

    if (this.fileType === 'txt') {
      this.importVouchersFromTextFile(this.file.file, this.getFormData());
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<AccountsChartMasterData[]>
        (AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.TRANSACTION_TYPES_LIST),
    ])
    .subscribe(([x, y]) => {
      this.accountsChartMasterDataList = x;
      this.transactionTypesList = y;
      this.isLoading = false;
    });
  }


  private generateExcelSheetsList() {
    this.excelSheetsList = Array.from({ length: 10 }, (v, k) => (k + 1).toString())
      .map(x => Object.create({uid: x, name: x}));
    this.excelSheetsList.unshift({uid: '-1', name: 'Todas'});
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        recordingDate: new FormControl(DateStringLibrary.today(), Validators.required),
        accountsChartUID: new FormControl('', Validators.required),
        transactionTypeUID: new FormControl('', Validators.required),
        distributeVouchers: new FormControl(false),
        generateSubledgerAccount: new FormControl(false),
        canEditVoucherEntries: new FormControl(true),
        excelSheets: new FormControl('', Validators.required),
      })
    );
  }


  private getFormData(): VoucherFileData {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: VoucherFileData = {
      recordingDate: formModel.recordingDate,
      accountsChartUID: formModel.accountsChartUID,
      transactionTypeUID: formModel.transactionTypeUID,
      distributeVouchers: formModel.distributeVouchers,
      generateSubledgerAccount: formModel.generateSubledgerAccount,
      canEditVoucherEntries: formModel.canEditVoucherEntries,
      excelSheets: this.fileType === 'excel' ? formModel.excelSheets.map(x => +x) : [],
      type: this.fileType === 'excel' ? 'ExcelFile' : 'TextFile',
      format: this.fileType === 'excel' ? 'excel' : 'txt',
      version: '1.0'
    };

    return data;
  }


  private importVouchersFromExcelFile(file: File, dataFile: VoucherFileData) {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.messageBox.showInDevelopment('Importador de pólizas desde archivo Excel', {file, dataFile});
    }, 600);
  }


  private importVouchersFromTextFile(file: File, dataFile: VoucherFileData) {
    this.isLoading = true;

    this.vouchersData.importVouchersFromTextFile(file, dataFile)
      .toPromise()
      .then(x => this.emitVouchersImported(x))
      .finally(() => this.isLoading = false);
  }


  private emitVouchersImported(message: string) {
    sendEvent(this.vouchersUploaderEvent, VouchersUploaderEventType.VOUCHERS_IMPORTED);
    this.messageBox.show(message, 'Importador de pólizas');
  }

}
