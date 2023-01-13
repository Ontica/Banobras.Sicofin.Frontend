/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';

import { DateStringLibrary, EventInfo } from '@app/core';

import { PermissionsLibrary } from '@app/main-layout';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { Account, AccountEditionCommandType, EmptyAccount, getAccountRole } from '@app/models';

import { AccountEditionWizardEventType } from '../account-edition/account-edition-wizard.component';

export enum AccountViewEventType {
  ACCOUNT_UPDATED = 'AccountViewComponent.Event.AccountUpdated',
}

enum AccountViewFormControls {
  accountsChart = 'accountsChart',
  startDate = 'startDate',
  endDate = 'endDate',
  number = 'number',
  name = 'name',
  description = 'description',
  role = 'role',
  type = 'type',
  debtorCreditor = 'debtorCreditor',
  usesSubledger = 'usesSubledger',
  usesSector = 'usesSector',
}

@Component({
  selector: 'emp-fa-account-view',
  templateUrl: './account-view.component.html',
})
export class AccountViewComponent implements OnChanges {

  @Input() account: Account = EmptyAccount;

  @Output() accountViewEvent = new EventEmitter<EventInfo>();

  permissions = PermissionsLibrary;

  formHandler: FormHandler;

  controls = AccountViewFormControls;

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
        break;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        accountsChart: new FormControl(''),
        startDate: new FormControl(''),
        endDate: new FormControl(''),
        number: new FormControl(''),
        name: new FormControl(''),
        description: new FormControl(''),
        role: new FormControl(''),
        type: new FormControl(''),
        debtorCreditor: new FormControl(''),
        usesSubledger: new FormControl(false),
        usesSector: new FormControl(false),
      })
    );
  }


  private setFormData() {
    this.formHandler.form.reset({
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

    this.formHandler.disableForm(true);
  }

}
