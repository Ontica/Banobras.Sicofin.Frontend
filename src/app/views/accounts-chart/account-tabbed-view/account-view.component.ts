/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';

import { DateStringLibrary, EventInfo, Identifiable } from '@app/core';

import { PermissionsLibrary } from '@app/main-layout';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { Account, AccountEditionCommandType, AccountEditionTypeList, AccountRole,
         EmptyAccount } from '@app/models';

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

  editionMode = false;

  accountEditionTypeSelected: AccountEditionCommandType = null;

  accountEditionTypeList: Identifiable[] = [];

  displayAccountEditionWizard = false;


  constructor() {
    this.initForm();
  }

  ngOnChanges() {
    this.enableEditor(false);

    this.accountEditionTypeList = this.hasSectors ?
      AccountEditionTypeList : this.getAccountEditionTypeListWithoutSectors();
  }


  get hasSectors(): boolean {
    return this.account.role === AccountRole.Sectorizada ||
           this.account.sectorRules.length !== 0;
  }


  getAccountEditionTypeListWithoutSectors(): Identifiable[] {
    return AccountEditionTypeList.filter(x =>
      ![AccountEditionCommandType.AddSectors.toString(), AccountEditionCommandType.RemoveSectors.toString()].includes(x.uid))
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;
    this.setFormData();
    this.formHandler.disableForm(!this.editionMode);
  }


  onAccountEditionButtonClicked() {
    if (!!this.accountEditionTypeSelected) {
      this.displayAccountEditionWizard = true;
    }
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
        debtorCreditor: new FormControl('')
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
      role: this.account.role,
      type: this.account.type.name,
      debtorCreditor: this.account.debtorCreditor,
    });
  }

}
