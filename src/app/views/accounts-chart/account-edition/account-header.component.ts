/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DateStringLibrary, EventInfo, isEmpty } from '@app/core';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { Account, AccountFields, AccountsChartMasterData, DebtorCreditorTypesList,
         EmptyAccount } from '@app/models';


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
}


@Component({
  selector: 'emp-fa-account-header',
  templateUrl: './account-header.component.html',
})
export class AccountHeaderComponent implements OnInit {

  @Input() account: Account = EmptyAccount;

  @Input() accountsChartMasterDataList: AccountsChartMasterData[] = [];

  @Input() selectedAccountChart: AccountsChartMasterData = null;

  @Input() roleEditionMode = true;

  @Output() accountHeaderEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;

  controls = AccountHeaderFormControls;

  debtorCreditorTypesList: string[] = DebtorCreditorTypesList;


  constructor() {
    this.initForm();
  }


  ngOnInit() {
    setTimeout(() => {
      this.enableEditor();
      this.suscribeToFormChangesForEmit();
    });
  }


  get isSaved() {
    return !isEmpty(this.account);
  }


  onAccountChartChanges() {
    this.formHandler.getControl(this.controls.role).reset('');
    this.formHandler.getControl(this.controls.accountTypeUID).reset('');
  }


  onApplicationDateChanges(applicationDate) {
    if (this.isSaved && !this.roleEditionMode) {
      const isSameDate = DateStringLibrary.compareDates(
        this.formHandler.getControl(this.controls.startDate).value,
        applicationDate
        ) === 0;

      this.formHandler.disableControl(this.controls.accountNumber, !isSameDate);
      this.formHandler.disableControl(this.controls.role, !isSameDate);

      if (!isSameDate) {
        this.formHandler.getControl(this.controls.accountNumber).reset(this.account.number);
        this.formHandler.getControl(this.controls.role).reset(this.account.role);
      }
    }
  }


  invalidateForm() {
    this.formHandler.invalidateForm();
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        accountsChartUID: new FormControl('', Validators.required),
        startDate: new FormControl(''),
        applicationDate: new FormControl(DateStringLibrary.today(), Validators.required),
        accountNumber: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        role: new FormControl('', Validators.required),
        accountTypeUID: new FormControl('', Validators.required),
        debtorCreditor: new FormControl('', Validators.required)
      })
    );

  }


  private enableEditor() {
    this.setFormModel();
    this.validateDisabledFields();
  }


  private setFormModel() {
    this.formHandler.form.reset({
      accountsChartUID: this.selectedAccountChart?.uid ?? '',
      startDate: DateStringLibrary.format(this.account.startDate),
      applicationDate: '',
      accountNumber: this.account.number,
      name: this.account.name,
      description: this.account.description,
      role: this.account.role,
      accountTypeUID: this.account.type.uid,
      debtorCreditor: this.account.debtorCreditor,
    });
  }


  private validateDisabledFields() {
    if (this.isSaved) {
      this.formHandler.disableControl(this.controls.accountsChartUID);
      this.formHandler.disableControl(this.controls.startDate);
      this.formHandler.disableControl(this.controls.accountNumber);

      if (this.roleEditionMode) {
        this.formHandler.disableControl(this.controls.name);
        this.formHandler.disableControl(this.controls.description);
        this.formHandler.disableControl(this.controls.accountTypeUID);
        this.formHandler.disableControl(this.controls.debtorCreditor);
      } else {
        this.formHandler.disableControl(this.controls.role);
      }
    }
  }


  private suscribeToFormChangesForEmit() {
    this.formHandler.form.valueChanges.subscribe(x => this.emitChanges());
  }


  private emitChanges() {
    const payload = {
      account: this.getFormData(),
      accountChartUID: this.formHandler.getControl(this.controls.accountsChartUID).value,
      applicationDate: this.formHandler.getControl(this.controls.applicationDate).value,
    };

    sendEvent(this.accountHeaderEvent, AccountHeaderEventType.FORM_CHANGED, payload);
  }


  private getFormData(): AccountFields {
    const formModel = this.formHandler.form.getRawValue();

    const data: AccountFields = {
      accountNumber: formModel.accountNumber ?? '',
      name: formModel.name ?? '',
      description: formModel.description ?? '',
      role: formModel.role ?? '',
      accountTypeUID: formModel.accountTypeUID ?? '',
      debtorCreditor: formModel.debtorCreditor ?? '',
    };

    return data;
  }

}
