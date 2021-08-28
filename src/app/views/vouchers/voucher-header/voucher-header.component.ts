/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest } from 'rxjs';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, EmptyVoucher, Ledger, Voucher, VoucherFields } from '@app/models';

import { AccountChartStateSelector,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { VouchersDataService } from '@app/data-services';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { DateTimeFormatPipe } from '@app/shared/pipes/date-time-format.pipe';

export enum VoucherHeaderEventType {
  CREATE_VOUCHER_CLICKED = 'VoucherHeaderComponent.Event.CreateVoucherClicked',
  UPDATE_VOUCHER_CLICKED = 'VoucherHeaderComponent.Event.UpdateVoucherClicked',
  DELETE_VOUCHER_CLICKED = 'VoucherHeaderComponent.Event.DeleteVoucherClicked',
  REVIEW_VOUCHER_BUTTON_CLICKED = 'VoucherHeaderComponent.Event.reviewVoucherButtonClicked',
  SEND_TO_LEDGER_BUTTON_CLICKED = 'VoucherHeaderComponent.Event.SendToLedgerButtonClicked',
  SEND_TO_SUPERVISOR_BUTTON_CLICKED = 'VoucherHeaderComponent.Event.SendToSupervisorButtonClicked',
  ADD_VOUCHER_ENTRY_CLICKED = 'VoucherHeaderComponent.Event.AddVoucherEntryClicked',
  IMPORT_VOUCHER_ENTRIES_BUTTON_CLICKED = 'VoucherHeaderComponent.Event.ImportVoucherEntriesButtonClicked',
}

enum VoucherHeaderFormControls {
  voucherTypeUID = 'voucherTypeUID',
  accountsChart = 'accountsChart',
  ledgerUID = 'ledgerUID',
  concept = 'concept',
  functionalAreaId = 'functionalAreaId',
  transactionTypeUID = 'transactionTypeUID',
  accountingDate = 'accountingDate',
}

@Component({
  selector: 'emp-fa-voucher-header',
  templateUrl: './voucher-header.component.html',
  providers: [DateTimeFormatPipe]
})
export class VoucherHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() voucher: Voucher = EmptyVoucher;

  @Input() canEdit = true;

  @Output() voucherHeaderEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;
  controls = VoucherHeaderFormControls;
  editionMode = false;
  isLoading = false;
  isLoadingAccountingDates = false;

  hasValueDate = false;
  accountChartSelected: AccountsChartMasterData = null;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];
  voucherTypesList: Identifiable[] = [];
  functionalAreasList: Identifiable[] = [];
  transactionTypesList: Identifiable[] = [];
  accountingDatesList: Identifiable[] = [];

  helper: SubscriptionHelper;
  eventType = VoucherHeaderEventType;

  constructor(private uiLayer: PresentationLayer,
              private vouchersData: VouchersDataService,
              private messageBox: MessageBoxService,
              private dateTimeFormat: DateTimeFormatPipe) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnInit(): void {
    this.loadDataLists();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucher) {
      this.enableEditor(false);
    }
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isSavedVoucher() {
    return this.voucher && this.voucher.id > 0;
  }


  get hasEntries() {
    return this.voucher.entries.length > 0;
  }


  enableEditor(enable) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.disableForm(!this.editionMode);
    this.validateDisabledFieldsByHasEntries();
  }


  validateDisabledFieldsByHasEntries() {
    if (this.editionMode) {
      this.formHandler.disableControl(this.controls.accountsChart, this.hasEntries);
      this.formHandler.disableControl(this.controls.ledgerUID, this.hasEntries);
    }
  }


  onAccountChartChanges(accountChart: AccountsChartMasterData) {
    this.accountChartSelected = accountChart;
    this.formHandler.getControl(this.controls.ledgerUID).reset();
  }


  onLedgerChanges(ledger: Ledger) {
    if (!!ledger.uid) {
      this.getOpenedAccountingDates(ledger.uid);
    }
  }


  onHasValueDateChange() {
    this.formHandler.getControl(this.controls.accountingDate).reset();
  }


  submitForm() {
    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    let eventType = VoucherHeaderEventType.CREATE_VOUCHER_CLICKED;

    if (this.isSavedVoucher) {
      eventType = VoucherHeaderEventType.UPDATE_VOUCHER_CLICKED;
    }

    sendEvent(this.voucherHeaderEvent, eventType, {voucher: this.getFormData()});
  }


  onEventButtonClicked(eventType: VoucherHeaderEventType) {
    if ([VoucherHeaderEventType.DELETE_VOUCHER_CLICKED,
         VoucherHeaderEventType.SEND_TO_LEDGER_BUTTON_CLICKED,
         VoucherHeaderEventType.SEND_TO_SUPERVISOR_BUTTON_CLICKED].includes(eventType)) {
      this.showConfirmMessage(eventType);
      return;
    }
    sendEvent(this.voucherHeaderEvent, eventType, {voucher: this.voucher});
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<Identifiable[]>(VoucherStateSelector.VOUCHER_TYPES_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.TRANSACTION_TYPES_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.FUNCTIONAL_AREAS_LIST),
      this.helper.select<AccountsChartMasterData[]>
        (AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
    ])
    .subscribe(([a, b, c, d]) => {
      this.voucherTypesList = a;
      this.transactionTypesList = b;
      this.functionalAreasList = c;
      this.accountsChartMasterDataList = d;

      this.setAccountChartSelected();
      this.isLoading = false;
    });
  }


  private getOpenedAccountingDates(ledgerUID: string) {
    this.isLoadingAccountingDates = true;

    this.vouchersData.getOpenedAccountingDates(ledgerUID)
      .toPromise()
      .then(x => {
        this.accountingDatesList =
          x.map(item => Object.create({ uid: item, name: this.dateTimeFormat.transform(item) }));
        this.hasValueDate = this.voucher.id > 0 ?
          !x.includes(this.voucher.accountingDate) : false;
      })
      .finally(() => this.isLoadingAccountingDates = false);
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        voucherTypeUID: new FormControl('', Validators.required),
        accountsChart: new FormControl('', Validators.required),
        ledgerUID: new FormControl('', Validators.required),
        concept: new FormControl('', Validators.required),
        functionalAreaId: new FormControl('', Validators.required),
        transactionTypeUID: new FormControl('', Validators.required),
        accountingDate: new FormControl('', Validators.required),
      })
    );
  }


  private setFormData() {
    if (!this.voucher) {
      this.formHandler.form.reset();
      return;
    }

    this.formHandler.form.reset({
      voucherTypeUID: this.voucher.voucherType.uid || '',
      accountsChart: this.voucher.accountsChart.uid || '',
      ledgerUID: this.voucher.ledger.uid || '',
      concept: this.voucher.concept || '',
      functionalAreaId: this.voucher.functionalArea.uid || '',
      transactionTypeUID: this.voucher.transactionType.uid || '',
      accountingDate: this.voucher.accountingDate || '',
    });

    this.setAccountChartSelected();
    this.getOpenedAccountingDates(this.voucher.ledger.uid);
  }


  private disableForm(disable) {
    this.formHandler.disableForm(disable);
  }


  private setAccountChartSelected() {
    if (this.accountsChartMasterDataList.length === 0 || isEmpty(this.voucher.accountsChart)) {
      return;
    }

    const accountChart =
      this.accountsChartMasterDataList.filter(x => x.uid === this.voucher.accountsChart.uid);

    if (accountChart.length > 0) {
      this.accountChartSelected = accountChart[0];
    }
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: VoucherFields = {
      voucherTypeUID: formModel.voucherTypeUID ?? '',
      ledgerUID: formModel.ledgerUID ?? '',
      concept: formModel.concept ?? '',
      functionalAreaId: formModel.functionalAreaId ?? '',
      transactionTypeUID: formModel.transactionTypeUID ?? '',
      accountingDate: formModel.accountingDate ?? '',
    };

    return data;
  }


  private showConfirmMessage(eventType: VoucherHeaderEventType) {
    const type = eventType === VoucherHeaderEventType.DELETE_VOUCHER_CLICKED ?
      'DeleteCancel' : 'AcceptCancel';

    this.messageBox.confirm(this.getConfirmMessage(eventType), this.getConfirmTitle(eventType), type)
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.voucherHeaderEvent, eventType, {voucher: this.voucher});
        }
      });
  }


  private getConfirmTitle(eventType: VoucherHeaderEventType): string {
    switch (eventType) {
      case VoucherHeaderEventType.DELETE_VOUCHER_CLICKED:
        return 'Eliminar póliza';
      case VoucherHeaderEventType.SEND_TO_LEDGER_BUTTON_CLICKED:
        return 'Enviar al diario';
      case VoucherHeaderEventType.SEND_TO_SUPERVISOR_BUTTON_CLICKED:
        return 'Enviar a supervisión';
      default:
        return 'Confirmar operación';
    }
  }


  private getConfirmMessage(eventType: VoucherHeaderEventType): string {
    let operation = 'modificará';
    let question = '¿Continuo con la operación?';
    switch (eventType) {
      case VoucherHeaderEventType.DELETE_VOUCHER_CLICKED:
        operation = 'eliminará';
        question = '¿Elimino la póliza?';
        break;
      case VoucherHeaderEventType.SEND_TO_LEDGER_BUTTON_CLICKED:
        operation = 'enviara al diario';
        break;
      case VoucherHeaderEventType.SEND_TO_SUPERVISOR_BUTTON_CLICKED:
        operation = 'enviara a supervisión';
        break;
      default:
        break;
    }
    return `Esta operación ${operation} la póliza
            <strong> ${this.voucher.number}: ${this.voucher.voucherType.name}</strong>.
            <br><br>${question}`;
  }

}
