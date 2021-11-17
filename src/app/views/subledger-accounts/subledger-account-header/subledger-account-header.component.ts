/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, EmptySubledgerAccountDescriptor, Ledger,
         SubledgerAccountDescriptor } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormHandler, sendEvent } from '@app/shared/utils';

export enum SubledgerAccountHeaderEventType {
  CREATE_SUBLEDGER_ACCOUNT = 'SubledgerAccountHeaderComponent.Event.CreateSubledgerAccount',
  UPDATE_SUBLEDGER_ACCOUNT = 'SubledgerAccountHeaderComponent.Event.UpdateSubledgerAccount',
  SUSPEND_SUBLEDGER_ACCOUNT = 'SubledgerAccountHeaderComponent.Event.SuspendSubledgerAccount',
  DELETE_SUBLEDGER_ACCOUNT = 'SubledgerAccountHeaderComponent.Event.DeleteSubledgerAccount',
}

enum SubledgerAccountHeaderFormControls {
  accountsChart = 'accountsChart',
  ledger = 'ledger',
  subledgerType = 'subledgerType',
  number = 'number',
  name = 'name',
  description = 'description',
}

@Component({
  selector: 'emp-fa-subledger-account-header',
  templateUrl: './subledger-account-header.component.html',
})
export class SubledgerAccountHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() accountsChartUID = '';

  @Input() ledgerUID = '';

  @Input() subledgerAccount: SubledgerAccountDescriptor = EmptySubledgerAccountDescriptor;

  @Output() subledgerAccountHeaderEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;
  controls = SubledgerAccountHeaderFormControls;
  editionMode = false;
  isLoading = false;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  helper: SubscriptionHelper;
  eventType = SubledgerAccountHeaderEventType;


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.accountsChartUID) {
      this.setAccountsChartDefault();
    }

    if (changes.ledgerUID) {
      this.setLedgerDefault();
    }

    if (this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnInit(): void {
    this.loadAccountsCharts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isSaved(): boolean {
    return !!this.subledgerAccount.id;
  }


  get selectedAccountChart(): AccountsChartMasterData {
    return this.formHandler.getControl(this.controls.accountsChart).value;
  }


  get selectedLedger(): Ledger {
    return this.formHandler.getControl(this.controls.ledger).value;
  }


  enableEditor(enable) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.formHandler.disableForm(!this.editionMode);
  }


  onLedgerChanges() {
    this.formHandler.getControl(this.controls.subledgerType).reset();
  }


  onSubmitForm() {
    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    let eventType = SubledgerAccountHeaderEventType.CREATE_SUBLEDGER_ACCOUNT;

    if (this.isSaved) {
      eventType = SubledgerAccountHeaderEventType.UPDATE_SUBLEDGER_ACCOUNT;
    }

    sendEvent(this.subledgerAccountHeaderEvent, eventType, {subledgerAccount: this.getFormData()});
  }


  onEventButtonClicked(eventType: SubledgerAccountHeaderEventType) {
    if ([SubledgerAccountHeaderEventType.DELETE_SUBLEDGER_ACCOUNT,
         SubledgerAccountHeaderEventType.SUSPEND_SUBLEDGER_ACCOUNT].includes(eventType)) {
      this.showConfirmMessage(eventType);
      return;
    }
    sendEvent(this.subledgerAccountHeaderEvent, eventType, {subledgerAccount: this.subledgerAccount});
  }


  private loadAccountsCharts() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.isLoading = false;

        if (!this.isSaved) {
          this.setAccountsChartDefault();
          this.setLedgerDefault();
        }
      });
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        accountsChart: new FormControl('', Validators.required),
        ledger: new FormControl('', Validators.required),
        subledgerType: new FormControl('', Validators.required),
        number: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
      })
    );
  }


  private setFormData() {
    this.formHandler.form.reset({
      accountsChart: '',
      ledger: '',
      subledgerType: '',
      number: this.subledgerAccount.number || '',
      name: this.subledgerAccount.name || '',
      description: this.subledgerAccount.description || '',
    });
  }


  private setAccountsChartDefault() {
    let accountsChart = this.accountsChartMasterDataList.length === 0 ? null :
      this.accountsChartMasterDataList[0];

    if (!!this.accountsChartUID) {
      accountsChart = this.accountsChartMasterDataList.find(x => x.uid === this.accountsChartUID);
    }

    this.formHandler.getControl(this.controls.accountsChart).reset(accountsChart);
    this.formHandler.disableControl(this.controls.accountsChart, !!this.accountsChartUID);
  }


  private setLedgerDefault() {
    let ledger = null;

    if (!!this.ledgerUID && this.selectedAccountChart?.ledgers.length > 0) {
      ledger = this.selectedAccountChart.ledgers.find(x => x.uid === this.ledgerUID);
    }

    this.formHandler.getControl(this.controls.ledger).reset(ledger);
    this.formHandler.disableControl(this.controls.ledger, !!this.ledgerUID);
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: any = {
      subledgerTypeUID: formModel.subledgerType ?? '',
      number: formModel.number ?? '',
      name: formModel.name ?? '',
      description: formModel.description ?? '',
    };

    return data;
  }


  private showConfirmMessage(eventType: SubledgerAccountHeaderEventType) {
    let title = 'Eliminar auxiliar';
    let message = `Esta operación eliminará el auxiliar
                   <strong> ${this.subledgerAccount.number}: ${this.subledgerAccount.name}</strong>.
                   <br><br>¿Elimino al auxiliar?`;

    if (eventType === SubledgerAccountHeaderEventType.SUSPEND_SUBLEDGER_ACCOUNT) {
      title = 'Suspender auxiliar';
      message = `Esta operación suspenderá el auxiliar
        <strong> ${this.subledgerAccount.number}: ${this.subledgerAccount.name}</strong>.
        <br><br>¿Suspendo al auxiliar?`;
    }

    this.messageBox.confirm(message, title, 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.subledgerAccountHeaderEvent, eventType, {subledgerAccount: this.subledgerAccount});
        }
      });
  }

}
