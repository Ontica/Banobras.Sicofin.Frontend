/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { PermissionsLibrary } from '@app/main-layout';

import { AccountsChartMasterData, EmptySubledgerAccount, Ledger, SubledgerAccount,
         SubledgerAccountFields} from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormHandler, sendEvent } from '@app/shared/utils';

export enum SubledgerAccountHeaderEventType {
  CREATE_SUBLEDGER_ACCOUNT = 'SubledgerAccountHeaderComponent.Event.CreateSubledgerAccount',
  UPDATE_SUBLEDGER_ACCOUNT = 'SubledgerAccountHeaderComponent.Event.UpdateSubledgerAccount',
  SUSPEND_SUBLEDGER_ACCOUNT = 'SubledgerAccountHeaderComponent.Event.SuspendSubledgerAccount',
  ACTIVE_SUBLEDGER_ACCOUNT = 'SubledgerAccountHeaderComponent.Event.ActiveSubledgerAccount',
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

  @Input() subledgerAccount: SubledgerAccount = EmptySubledgerAccount;

  @Output() subledgerAccountHeaderEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;
  controls = SubledgerAccountHeaderFormControls;
  editionMode = false;
  isLoading = false;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];
  ledgerList: Ledger[] = [];
  subledgerAccountsTypeList: Identifiable[] = [];

  helper: SubscriptionHelper;
  eventType = SubledgerAccountHeaderEventType;

  permissions = PermissionsLibrary;


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


  enableEditor(enable) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.formHandler.disableForm(!this.editionMode);
  }


  onAccountsChartChanges(accountsChart: AccountsChartMasterData) {
    this.formHandler.getControl(this.controls.ledger).reset();
    this.ledgerList = accountsChart.ledgers;
    this.onLedgerChanges(null);
  }


  onLedgerChanges(ledger: Ledger) {
    this.formHandler.getControl(this.controls.subledgerType).reset();
    this.subledgerAccountsTypeList = ledger?.subledgerAccountsTypes ?? [];
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


  onSuspendButtonClicked() {
    this.showConfirmMessage(SubledgerAccountHeaderEventType.SUSPEND_SUBLEDGER_ACCOUNT);
  }


  onActiveButtonClicked() {
    this.showConfirmMessage(SubledgerAccountHeaderEventType.ACTIVE_SUBLEDGER_ACCOUNT);
  }


  private loadAccountsCharts() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.isLoading = false;

        if (this.isSaved) {
          this.setLedgerList(this.subledgerAccount.accountsChartUID);
          this.setSubledgerAccountsTypeList(this.subledgerAccount.ledger.uid);
        } else {
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
        description: new FormControl(''),
      })
    );
  }


  private setFormData() {
    this.formHandler.form.reset({
      accountsChart: this.subledgerAccount.accountsChartUID,
      ledger: this.subledgerAccount.ledger.uid,
      subledgerType: this.subledgerAccount.type.uid,
      number: this.subledgerAccount.number || '',
      name: this.subledgerAccount.name || '',
      description: this.subledgerAccount.description || '',
    });

    this.setLedgerList(this.subledgerAccount.accountsChartUID);
    this.setSubledgerAccountsTypeList(this.subledgerAccount.ledger.uid);
  }


  private setAccountsChartDefault() {
    let accountsChartUID = this.accountsChartMasterDataList.length === 0 ? null :
      this.accountsChartMasterDataList[0].uid;

    accountsChartUID = !!this.accountsChartUID ? this.accountsChartUID : accountsChartUID;

    this.formHandler.getControl(this.controls.accountsChart).reset(accountsChartUID);
    this.formHandler.disableControl(this.controls.accountsChart, !!this.accountsChartUID);

    this.setLedgerList(accountsChartUID);
  }


  private setLedgerDefault() {
    this.formHandler.getControl(this.controls.ledger).reset(this.ledgerUID ?? null);
    this.formHandler.disableControl(this.controls.ledger, !!this.ledgerUID);
    this.setSubledgerAccountsTypeList(this.ledgerUID);
  }


  private setLedgerList(accountsChartUID: string) {
    const accountsChartSelected = this.accountsChartMasterDataList.find(x => x.uid === accountsChartUID);
    this.ledgerList = !!accountsChartSelected?.ledgers ? accountsChartSelected.ledgers : [];
  }


  private setSubledgerAccountsTypeList(ledgerUID: string) {
    const ledgerSelected = this.ledgerList.find(x => x.uid === ledgerUID);

    if (!!ledgerSelected) {
      this.subledgerAccountsTypeList = ledgerSelected.subledgerAccountsTypes;
    }
  }


  private getFormData(): SubledgerAccountFields {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: SubledgerAccountFields = {
      ledgerUID: formModel.ledger ?? '',
      typeUID: formModel.subledgerType ?? '',
      number: formModel.number ?? '',
      name: formModel.name ?? '',
      description: formModel.description ?? '',
    };

    return data;
  }


  private showConfirmMessage(eventType: SubledgerAccountHeaderEventType) {
    let confirmType: 'AcceptCancel' | 'DeleteCancel' = 'AcceptCancel';
    let title = 'Activar auxiliar';
    let message = `Esta operación activará el auxiliar
                   <strong> ${this.subledgerAccount.number}: ${this.subledgerAccount.name}</strong>.
                   <br><br>¿Activo al auxiliar?`;

    if (eventType === SubledgerAccountHeaderEventType.SUSPEND_SUBLEDGER_ACCOUNT) {
      confirmType = 'DeleteCancel';
      title = 'Suspender auxiliar';
      message = `Esta operación suspenderá el auxiliar
        <strong> ${this.subledgerAccount.number}: ${this.subledgerAccount.name}</strong>.
        <br><br>¿Suspendo al auxiliar?`;
    }

    this.messageBox.confirm(message, title, confirmType)
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.subledgerAccountHeaderEvent, eventType, {subledgerAccount: this.subledgerAccount});
        }
      });
  }

}
