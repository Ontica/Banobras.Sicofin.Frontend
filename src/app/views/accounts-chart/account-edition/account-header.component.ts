/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { DateString, DateStringLibrary, EventInfo, isEmpty, Validate } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { Account, AccountDataToBeUpdated, AccountEditionCommandType, AccountFields, AccountRole,
         AccountRoleList, AccountsChartMasterData, DebtorCreditorType, DebtorCreditorTypesList, EmptyAccount,
         getAccountRole, getAccountMainRole } from '@app/models';


export enum AccountHeaderEventType {
  FORM_CHANGED = 'AccountHeaderComponent.Event.FormChanged',
}

interface AccountFormModel extends FormGroup<{
  accountsChartUID: FormControl<string>;
  startDate: FormControl<DateString>;
  applicationDate: FormControl<DateString>;
  accountNumber: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  role: FormControl<AccountRole>;
  mainRole: FormControl<AccountRole>;
  accountTypeUID: FormControl<string>;
  debtorCreditor: FormControl<DebtorCreditorType>;
  usesSubledger: FormControl<boolean>;
  usesSector: FormControl<boolean>;
}> { }

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

  form: AccountFormModel;

  formHelper = FormHelper;

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


  get isFormValid(): boolean {
    return this.formHelper.isFormReady(this.form);
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
    return this.form.controls.mainRole.value ?? '';
  }


  onAccountChartChanges() {
    this.form.controls.accountTypeUID.reset('');
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
    this.formHelper.markFormControlsAsTouched(this.form);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      accountsChartUID: ['', Validators.required],
      startDate: ['' as DateString],
      applicationDate: ['' as DateString, Validators.required],
      accountNumber: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      role: [null as AccountRole, Validators.required],
      mainRole: [null as AccountRole, Validators.required],
      accountTypeUID: ['', Validators.required],
      debtorCreditor: [null as DebtorCreditorType, Validators.required],
      usesSubledger: [false],
      usesSector: [false],
    });
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
    this.form.reset({
      accountsChartUID: this.selectedAccountChart?.uid ?? '',
      applicationDate: DateStringLibrary.today(),
    });
  }


  private setFormData() {
    const isRoleSumaria = this.account.role === AccountRole.Sumaria;

    this.form.reset({
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
    this.formHelper.clearControlValidators(this.form.controls.applicationDate);
    this.formHelper.clearControlValidators(this.form.controls.name);
    this.formHelper.clearControlValidators(this.form.controls.mainRole);
    this.formHelper.clearControlValidators(this.form.controls.role);
    this.formHelper.clearControlValidators(this.form.controls.usesSector);
    this.formHelper.clearControlValidators(this.form.controls.usesSubledger);
    this.formHelper.clearControlValidators(this.form.controls.accountTypeUID);
    this.formHelper.clearControlValidators(this.form.controls.debtorCreditor);

    if (this.canEditName) {
      this.formHelper.setControlValidators(this.form.controls.name,
        [Validators.required, Validate.changeRequired(this.account.name)]);
    }

    if (this.canEditRole) {
      const initMainRole =
        getAccountMainRole(this.account.role, this.account.usesSector, this.account.usesSubledger);
      this.formHelper.setControlValidators(this.form.controls.role, [Validators.required]);
      this.formHelper.setControlValidators(this.form.controls.mainRole,
        [Validators.required, Validate.changeRequired(initMainRole)]);
    }

    if (this.canEditType) {
      this.formHelper.setControlValidators(this.form.controls.accountTypeUID,
        [Validators.required, Validate.changeRequired(this.account.type.uid)]);
    }

    if (this.canEditDebtorCreditor) {
      this.formHelper.setControlValidators(this.form.controls.debtorCreditor,
        [Validators.required, Validate.changeRequired(this.account.debtorCreditor)]);
    }

    if (this.canEditSubledgerRole) {
      this.formHelper.setControlValidators(this.form.controls.usesSubledger,
        [Validators.required, Validate.changeRequired(this.account.usesSubledger)]);
    }
  }


  private validateDisabledFields() {
    this.form.disable();

    if (this.canEditName) {
      this.form.controls.name.enable();
      this.form.controls.description.enable();
    }

    if (this.canEditRole) {
      this.form.controls.role.enable();
      this.form.controls.mainRole.enable();

      this.validateDisableSectorsAndSubledgers();
    }

    if (this.canEditType) {
      this.form.controls.accountTypeUID.enable();
    }

    if (this.canEditDebtorCreditor) {
      this.form.controls.debtorCreditor.enable();
    }

    if (this.canEditSubledgerRole) {
      this.form.controls.usesSubledger.enable();
    }
  }


  private setSectorsAndSubledgersAfterRoleChanges(role: AccountRole) {
    const useAccountData = this.isSaved && role !== AccountRole.Sumaria &&
      this.account.role !== AccountRole.Sumaria;

    this.form.controls.usesSector
      .reset(useAccountData ? this.account.usesSector : false);

    this.form.controls.usesSubledger
      .reset(useAccountData ? this.account.usesSubledger : false);
  }


  private validateDisableSectorsAndSubledgers() {
    const role = this.form.controls.role.value;
    const showSectorsAndSubledgersChecks = !!role && role !== AccountRole.Sumaria;

    this.formHelper.setDisableControl(this.form.controls.usesSector, !showSectorsAndSubledgersChecks);
    this.formHelper.setDisableControl(this.form.controls.usesSubledger, !showSectorsAndSubledgersChecks);
  }


  private suscribeToFormChangesForEmit() {
    this.form.valueChanges.subscribe(x => this.emitChanges());
  }


  private setMainRole() {
    const role = this.form.controls.role.value;
    let mainRole: AccountRole = null;

    if (!!role) {
      const usesSector = this.form.controls.usesSector.value;
      const usesSubledger = this.form.controls.usesSubledger.value;

      mainRole = getAccountMainRole(role, usesSector, usesSubledger);
    }
    this.form.controls.mainRole.setValue(mainRole);
  }


  private emitChanges() {
    const payload = {
      accountFields: this.getFormData(),
      accountChartUID: this.form.controls.accountsChartUID.value,
      applicationDate: this.form.controls.applicationDate.value,
      usesSector: this.form.controls.usesSector.value,
      usesSubledger: this.form.controls.usesSubledger.value,
    };

    sendEvent(this.accountHeaderEvent, AccountHeaderEventType.FORM_CHANGED, payload);
  }


  private getFormData(): AccountFields {
    const formModel = this.form.getRawValue();

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
