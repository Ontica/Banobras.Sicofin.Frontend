/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DateString, DateStringLibrary, EventInfo } from '@app/core';

import { PERMISSIONS } from '@app/main-layout';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { Account, AccountEditionCommandType, AccountRole, DebtorCreditorType, EmptyAccount,
         getAccountRole } from '@app/models';

import { AccountEditionWizardEventType } from '../account-edition/account-edition-wizard.component';

export enum AccountViewEventType {
  ACCOUNT_UPDATED = 'AccountViewComponent.Event.AccountUpdated',
}

interface AccountViewFormModel extends FormGroup<{
  accountsChart: FormControl<string>;
  startDate: FormControl<DateString>;
  endDate: FormControl<DateString>;
  number: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  role: FormControl<AccountRole>;
  type: FormControl<string>;
  debtorCreditor: FormControl<DebtorCreditorType>;
  usesSubledger: FormControl<boolean>;
  usesSector: FormControl<boolean>;
}> { }

@Component({
  selector: 'emp-fa-account-view',
  templateUrl: './account-view.component.html',
})
export class AccountViewComponent implements OnChanges {

  @Input() account: Account = EmptyAccount;

  @Output() accountViewEvent = new EventEmitter<EventInfo>();

  permissions = PERMISSIONS;

  form: AccountViewFormModel;

  formHelper = FormHelper;

  displayAccountEditionWizard = false;

  accountEditionCommandType = AccountEditionCommandType.UpdateAccount;


  constructor() {
    this.initForm();
  }


  ngOnChanges() {
    this.setFormData();
  }


  onFixAccountNameButtonClicked() {
    this.displayAccountEditionWizard = true;
    this.accountEditionCommandType = AccountEditionCommandType.FixAccountName;
  }


  onUnpdateAccountButtonClicked() {
    this.displayAccountEditionWizard = true;
    this.accountEditionCommandType = AccountEditionCommandType.UpdateAccount;
  }


  onAccountEditionWizardEvent(event: EventInfo) {
    switch (event.type as AccountEditionWizardEventType) {
      case AccountEditionWizardEventType.CLOSE_MODAL_CLICKED:
        this.displayAccountEditionWizard = false;
        return;

      case AccountEditionWizardEventType.ACCOUNT_EDITED:
        sendEvent(this.accountViewEvent, AccountViewEventType.ACCOUNT_UPDATED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      accountsChart: [''],
      startDate: [null],
      endDate: [null],
      number: [''],
      name: [''],
      description: [''],
      role: [null],
      type: [''],
      debtorCreditor: [null],
      usesSubledger: [false],
      usesSector: [false],
    });
  }


  private setFormData() {
    this.form.reset({
      accountsChart: this.account.accountsChart.name,
      startDate: DateStringLibrary.format(this.account.startDate),
      endDate: DateStringLibrary.format(this.account.endDate),
      number: this.account.number,
      name: this.account.name,
      description: this.account.description,
      role: getAccountRole(this.account.role),
      type: this.account.type.name,
      debtorCreditor: this.account.debtorCreditor,
      usesSubledger: this.account.usesSubledger,
      usesSector: this.account.usesSector,
    });

    this.formHelper.setDisableForm(this.form, true);
  }

}
