/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { PERMISSIONS } from '@app/main-layout';

import { AccountsChartMasterData, EmptySubledgerAccount, Ledger, SubledgerAccount,
         SubledgerAccountFields} from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormHelper, sendEvent } from '@app/shared/utils';

export enum SubledgerAccountHeaderEventType {
  CREATE_SUBLEDGER_ACCOUNT = 'SubledgerAccountHeaderComponent.Event.CreateSubledgerAccount',
  UPDATE_SUBLEDGER_ACCOUNT = 'SubledgerAccountHeaderComponent.Event.UpdateSubledgerAccount',
  SUSPEND_SUBLEDGER_ACCOUNT = 'SubledgerAccountHeaderComponent.Event.SuspendSubledgerAccount',
  ACTIVE_SUBLEDGER_ACCOUNT = 'SubledgerAccountHeaderComponent.Event.ActiveSubledgerAccount',
}

interface SubledgerAccounFormModel extends FormGroup<{
  accountsChart: FormControl<string>;
  ledger: FormControl<string>;
  subledgerType: FormControl<string>;
  number: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
}> { }

@Component({
  selector: 'emp-fa-subledger-account-header',
  templateUrl: './subledger-account-header.component.html',
})
export class SubledgerAccountHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() accountsChartUID = '';

  @Input() ledgerUID = '';

  @Input() subledgerAccount: SubledgerAccount = EmptySubledgerAccount;

  @Output() subledgerAccountHeaderEvent = new EventEmitter<EventInfo>();

  form: SubledgerAccounFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  ledgerList: Ledger[] = [];

  subledgerAccountsTypeList: Identifiable[] = [];

  helper: SubscriptionHelper;

  eventType = SubledgerAccountHeaderEventType;

  permissions = PERMISSIONS;


  constructor(private uiLayer: PresentationLayer,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnChanges(changes: SimpleChanges) {
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


  ngOnInit() {
    this.loadAccountsCharts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isSaved(): boolean {
    return !!this.subledgerAccount.id;
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.formHelper.setDisableForm(this.form, !this.editionMode);
  }


  onAccountsChartChanges(accountsChart: AccountsChartMasterData) {
    this.form.controls.ledger.reset();
    this.ledgerList = accountsChart.ledgers;
    this.onLedgerChanges(null);
  }


  onLedgerChanges(ledger: Ledger) {
    this.form.controls.subledgerType.reset();
    this.subledgerAccountsTypeList = ledger?.subledgerAccountsTypes ?? [];
  }


  onSubmitForm() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      let eventType = SubledgerAccountHeaderEventType.CREATE_SUBLEDGER_ACCOUNT;

      if (this.isSaved) {
        eventType = SubledgerAccountHeaderEventType.UPDATE_SUBLEDGER_ACCOUNT;
      }

      sendEvent(this.subledgerAccountHeaderEvent, eventType, { subledgerAccount: this.getFormData() });
    }
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
    const fb = new FormBuilder();

    this.form = fb.group({
      accountsChart: ['', Validators.required],
      ledger: ['', Validators.required],
      subledgerType: ['', Validators.required],
      number: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
    });
  }


  private setFormData() {
    this.form.reset({
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

    this.form.controls.accountsChart.reset(accountsChartUID);
    this.formHelper.setDisableControl(this.form.controls.accountsChart, !!this.accountsChartUID);

    this.setLedgerList(accountsChartUID);
  }


  private setLedgerDefault() {
    this.form.controls.ledger.reset(this.ledgerUID ?? null);
    this.formHelper.setDisableControl(this.form.controls.ledger, !!this.ledgerUID);
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
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

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
