/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DateStringLibrary, EventInfo, isEmpty, Validate } from '@app/core';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { Account, AccountDataToBeUpdated, AccountEditionCommandType, AccountFields, AccountRole,
         AccountRoleList, AccountsChartMasterData, DebtorCreditorTypesList, EmptyAccount,
         getAccountRole } from '@app/models';


export enum AccountHeaderEventType {
  FORM_CHANGED = 'AccountHeaderComponent.Event.FormChanged',
}

enum AccountHeaderFormControls {
  accountsChartUID = 'accountsChartUID',
  startDate = 'startDate',
  applicationDate = 'applicationDate',
  accountNumber = 'accountNumber',
  name = 'name',
  description = 'description',
  role = 'role',
  accountTypeUID = 'accountTypeUID',
  debtorCreditor = 'debtorCreditor',
  usesSubledger = 'usesSubledger',
  usesSector = 'usesSector',
}


@Component({
  selector: 'emp-fa-account-header',
  templateUrl: './account-header.component.html',
})
export class AccountHeaderComponent implements OnInit, OnChanges {

  @Input() commandType: AccountEditionCommandType = AccountEditionCommandType.CreateAccount;

  @Input() account: Account = EmptyAccount;

  @Input() dataToUpdate: AccountDataToBeUpdated[] = [];

  @Input() accountsChartMasterDataList: AccountsChartMasterData[] = [];

  @Input() selectedAccountChart: AccountsChartMasterData = null;

  @Output() accountHeaderEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;

  controls = AccountHeaderFormControls;

  accountRoleList: string[] = AccountRoleList;

  debtorCreditorTypesList: string[] = DebtorCreditorTypesList;


  constructor() {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataToUpdate) {
      setTimeout(() => this.enableEditor())
    }
  }


  ngOnInit() {
    setTimeout(() => this.enableEditor());
  }


  get isSaved(): boolean {
    return !isEmpty(this.account);
  }


  get canEditName(): boolean {
    return this.dataToUpdate.includes(AccountDataToBeUpdated.Name) ||
      this.commandType === AccountEditionCommandType.FixAccountName;
  }


  get canEditRole(): boolean {
    return this.dataToUpdate.includes(AccountDataToBeUpdated.MainRole);
  }


  get canEditType(): boolean {
    return this.dataToUpdate.includes(AccountDataToBeUpdated.AccountType);
  }


  get canEditDebtorCreditor(): boolean {
    return this.dataToUpdate.includes(AccountDataToBeUpdated.DebtorCreditor);
  }

  get canEditSubledgerRole(): boolean {
    return this.dataToUpdate.includes(AccountDataToBeUpdated.SubledgerRole);
  }


  onAccountChartChanges() {
    this.formHandler.getControl(this.controls.accountTypeUID).reset('');
  }


  onRoleChanges() {
    this.formHandler.getControl(this.controls.usesSector)
      .reset(this.isSaved ? this.account.usesSector : false);
    this.formHandler.getControl(this.controls.usesSubledger)
      .reset(this.isSaved ? this.account.usesSubledger : false);

    this.validateDisableSectorsAndSubledgers();
  }


  invalidateForm() {
    this.formHandler.invalidateForm();
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        accountsChartUID: new FormControl('', Validators.required),
        startDate: new FormControl(''),
        applicationDate: new FormControl('', Validators.required),
        accountNumber: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        description: new FormControl(''),
        role: new FormControl('', Validators.required),
        accountTypeUID: new FormControl('', Validators.required),
        debtorCreditor: new FormControl('', Validators.required),
        usesSubledger: new FormControl(false),
        usesSector: new FormControl(false),
      })
    );

  }


  private enableEditor() {
    if (this.isSaved) {
      this.setFormData();
      this.validateFieldsValidators();
      this.validateDisabledFields();
    } else {
      this.setDefaultFields();
      this.validateDisableSectorsAndSubledgers();
    }

    this.suscribeToFormChangesForEmit();
  }


  private setDefaultFields() {
    this.formHandler.form.reset({
      accountsChartUID: this.selectedAccountChart?.uid ?? '',
      applicationDate: DateStringLibrary.today(),
    });
  }


  private setFormData() {
    this.formHandler.form.reset({
      accountsChartUID: this.selectedAccountChart?.uid ?? '',
      startDate: DateStringLibrary.format(this.account.startDate),
      applicationDate: this.commandType === AccountEditionCommandType.FixAccountName ?
        DateStringLibrary.today() : '',
      accountNumber: this.account.number,
      name: this.account.name,
      description: this.account.description,
      role: this.getInitRoleFromAccount(),
      accountTypeUID: this.account.type.uid,
      debtorCreditor: this.account.debtorCreditor,
      usesSubledger: this.account.usesSubledger,
      usesSector: this.account.usesSector,
    });
  }


  private getInitRoleFromAccount() {
    return this.account.role === AccountRole.Sumaria ? AccountRole.Sumaria : AccountRole.Detalle;
  }


  private validateDisableSectorsAndSubledgers() {
    const role = this.formHandler.getControl(this.controls.role).value;
    const showSectorsAndSubledgersChecks = !!role && role !== AccountRole.Sumaria;

    this.formHandler.disableControl(this.controls.usesSector, !showSectorsAndSubledgersChecks);
    this.formHandler.disableControl(this.controls.usesSubledger, !showSectorsAndSubledgersChecks);
  }


  private validateFieldsValidators() {
    this.formHandler.clearControlValidators(this.controls.applicationDate);

    if (this.canEditName) {
      this.formHandler.setControlValidators(this.controls.name,
        [Validators.required, Validate.changeRequired(this.account.name)]);
    }

    // TODO: validate at least one change in one of the 3 fields (role, usesSectors or usesSublegers)
    if (this.canEditRole) {
      this.formHandler.setControlValidators(this.controls.role,
        [Validators.required, Validate.changeRequired(this.getInitRoleFromAccount())]);
    }

    if (this.canEditType) {
      this.formHandler.setControlValidators(this.controls.accountTypeUID,
        [Validators.required, Validate.changeRequired(this.account.type.uid)]);
    }

    if (this.canEditDebtorCreditor) {
      this.formHandler.setControlValidators(this.controls.debtorCreditor,
        [Validators.required, Validate.changeRequired(this.account.debtorCreditor)]);
    }

    if (this.canEditSubledgerRole) {
      this.formHandler.setControlValidators(this.controls.usesSubledger,
        [Validators.required, Validate.changeRequired(this.account.usesSubledger)]);
    }
  }


  private validateDisabledFields() {
    this.formHandler.disableForm();

    if (this.canEditName) {
      this.formHandler.getControl(this.controls.name).enable();
      this.formHandler.getControl(this.controls.description).enable();
    }

    if (this.canEditRole) {
      this.formHandler.getControl(this.controls.role).enable();

      this.validateDisableSectorsAndSubledgers();
    }

    if (this.canEditType) {
      this.formHandler.getControl(this.controls.accountTypeUID).enable();
    }

    if (this.canEditDebtorCreditor) {
      this.formHandler.getControl(this.controls.debtorCreditor).enable();
    }

    if (this.canEditSubledgerRole) {
      this.formHandler.getControl(this.controls.usesSubledger).enable();
    }
  }


  private suscribeToFormChangesForEmit() {
    this.formHandler.form.valueChanges.subscribe(x => this.emitChanges());
  }


  private emitChanges() {
    const payload = {
      accountFields: this.getFormData(),
      accountChartUID: this.formHandler.getControl(this.controls.accountsChartUID).value,
      applicationDate: this.formHandler.getControl(this.controls.applicationDate).value,
      usesSector: this.formHandler.getControl(this.controls.usesSector).value,
      usesSubledger: this.formHandler.getControl(this.controls.usesSubledger).value,
    };

    sendEvent(this.accountHeaderEvent, AccountHeaderEventType.FORM_CHANGED, payload);
  }


  private getFormData(): AccountFields {
    const formModel = this.formHandler.form.getRawValue();

    const data: AccountFields = {
      accountNumber: formModel.accountNumber ?? '',
      name: formModel.name ?? '',
      description: formModel.description ?? '',
      role: getAccountRole(formModel.role, formModel.usesSector, formModel.usesSubledger),
      accountTypeUID: formModel.accountTypeUID ?? '',
      debtorCreditor: formModel.debtorCreditor ?? '',
    };

    return data;
  }

}
