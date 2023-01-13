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
         AccountRoleList, AccountsChartMasterData, DebtorCreditorTypesList, EmptyAccount, getAccountRole,
         getAccountMainRole } from '@app/models';


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
  mainRole = 'mainRole',
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

  accountRoleList: AccountRole[] = AccountRoleList;

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


  get roleName(): string {
    return this.formHandler.getControl(this.controls.mainRole).value ?? '';
  }


  onAccountChartChanges() {
    this.formHandler.getControl(this.controls.accountTypeUID).reset('');
  }


  onRoleChanges(role: AccountRole) {
    this.setSectorsAndSubledgersAfterRoleChanges(role);
    this.validateDisableSectorsAndSubledgers();
    this.setMainRole();
  }


  onChecksChanges() {
    this.setMainRole();
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
        mainRole: new FormControl('', Validators.required),
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
    const isRoleSumaria = this.account.role === AccountRole.Sumaria;

    this.formHandler.form.reset({
      accountsChartUID: this.selectedAccountChart?.uid ?? '',
      startDate: DateStringLibrary.format(this.account.startDate),
      applicationDate: this.commandType === AccountEditionCommandType.FixAccountName ?
        DateStringLibrary.today() : '',
      accountNumber: this.account.number,
      name: this.account.name,
      description: this.account.description,
      role: getAccountRole(this.account.role),
      mainRole: getAccountMainRole(this.account.role, this.account.usesSector, this.account.usesSubledger),
      accountTypeUID: this.account.type.uid,
      debtorCreditor: this.account.debtorCreditor,
      usesSubledger: isRoleSumaria ? false : this.account.usesSubledger,
      usesSector: isRoleSumaria ? false : this.account.usesSector,
    });
  }


  private validateFieldsValidators() {
    this.formHandler.clearControlValidators(this.controls.applicationDate);
    this.formHandler.clearControlValidators(this.controls.name);
    this.formHandler.clearControlValidators(this.controls.mainRole);
    this.formHandler.clearControlValidators(this.controls.role);
    this.formHandler.clearControlValidators(this.controls.usesSector);
    this.formHandler.clearControlValidators(this.controls.usesSubledger);
    this.formHandler.clearControlValidators(this.controls.accountTypeUID);
    this.formHandler.clearControlValidators(this.controls.debtorCreditor);

    if (this.canEditName) {
      this.formHandler.setControlValidators(this.controls.name,
        [Validators.required, Validate.changeRequired(this.account.name)]);
    }

    if (this.canEditRole) {
      const initMainRole =
        getAccountMainRole(this.account.role, this.account.usesSector, this.account.usesSubledger);
      this.formHandler.setControlValidators(this.controls.role, [Validators.required]);
      this.formHandler.setControlValidators(this.controls.mainRole,
        [Validators.required, Validate.changeRequired(initMainRole)]);
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
      this.formHandler.getControl(this.controls.mainRole).enable();

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


  private setSectorsAndSubledgersAfterRoleChanges(role: AccountRole) {
    const useAccountData = this.isSaved && role !== AccountRole.Sumaria &&
      this.account.role !== AccountRole.Sumaria;

    this.formHandler.getControl(this.controls.usesSector)
      .reset(useAccountData ? this.account.usesSector : false);

    this.formHandler.getControl(this.controls.usesSubledger)
      .reset(useAccountData ? this.account.usesSubledger : false);
  }


  private validateDisableSectorsAndSubledgers() {
    const role = this.formHandler.getControl(this.controls.role).value;
    const showSectorsAndSubledgersChecks = !!role && role !== AccountRole.Sumaria;

    this.formHandler.disableControl(this.controls.usesSector, !showSectorsAndSubledgersChecks);
    this.formHandler.disableControl(this.controls.usesSubledger, !showSectorsAndSubledgersChecks);
  }


  private suscribeToFormChangesForEmit() {
    this.formHandler.form.valueChanges.subscribe(x => this.emitChanges());
  }


  private setMainRole() {
    const role = this.formHandler.getControl(this.controls.role).value;
    let mainRole = '';

    if (!!role) {
      const usesSector = this.formHandler.getControl(this.controls.usesSector).value;
      const usesSubledger = this.formHandler.getControl(this.controls.usesSubledger).value;

      mainRole = getAccountMainRole(role, usesSector, usesSubledger);
    }
    this.formHandler.getControl(this.controls.mainRole).setValue(mainRole);
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
      role: getAccountMainRole(formModel.role, formModel.usesSector, formModel.usesSubledger),
      accountTypeUID: formModel.accountTypeUID ?? '',
      debtorCreditor: formModel.debtorCreditor ?? '',
    };

    return data;
  }

}
