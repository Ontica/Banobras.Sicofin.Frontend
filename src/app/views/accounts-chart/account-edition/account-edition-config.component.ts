/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DateString, DateStringLibrary, EventInfo, Identifiable } from '@app/core';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { Account, AccountDataToBeUpdated, AccountDataToBeUpdatedList, AccountRole, EmptyAccount,
         getAccountMainRole } from '@app/models';


export enum AccountEditionConfigEventType {
  FORM_CHANGED = 'AccountEditionConfigComponent.Event.FormChanged',
}

enum AccountEditionConfigFormControls {
  applicationDate = 'applicationDate',
  dataToUpdate = 'dataToUpdate',
}


@Component({
  selector: 'emp-fa-account-edition-config',
  templateUrl: './account-edition-config.component.html',
})
export class AccountEditionConfigComponent implements OnInit {

  @Input() account: Account = EmptyAccount;

  @Output() accountEditionConfigEvent = new EventEmitter<EventInfo>();

  controls = AccountEditionConfigFormControls;

  formHandler: FormHandler;

  accountDataToUpdateList: Identifiable[] = AccountDataToBeUpdatedList;

  selection = new SelectionModel<Identifiable>(true, []);

  minDate: DateString = null;

  maxDate: DateString = null;

  constructor() {
    this.initForm();
  }


  ngOnInit() {
    this.setMinAndMaxDates();
    this.setAccountDataToUpdateList();
  }


  invalidateForm() {
    this.formHandler.invalidateForm();
  }


  onDataToUpdateChanged(data: Identifiable){
    this.selection.toggle(data);
    this.setFormSelection();
    this.emitChanges();
  }


  onApplicationDateChanged() {
    setTimeout(() => this.emitChanges());
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        applicationDate: new FormControl('', Validators.required),
        dataToUpdate: new FormControl([], [Validators.required, Validators.minLength(1)]),
      })
    );
  }


  private setMinAndMaxDates(){
    this.minDate = DateStringLibrary.todayAddDays(1);
    this.maxDate = DateStringLibrary.todayAddDays(8);
  }


  private setFormSelection() {
    this.formHandler.getControl(this.controls.dataToUpdate).reset(this.selection.selected);
  }


  private setAccountDataToUpdateList() {
    const role = getAccountMainRole(this.account.role, this.account.usesSector, this.account.usesSubledger);

    if (role === AccountRole.Sumaria) {
      this.accountDataToUpdateList = AccountDataToBeUpdatedList.filter(x =>
        ![AccountDataToBeUpdated.Sectors,
          AccountDataToBeUpdated.SubledgerRole,
          AccountDataToBeUpdated.Currencies].includes(x.uid as AccountDataToBeUpdated));
      return;
    }

    if (role === AccountRole.Sectorizada) {
      this.accountDataToUpdateList = AccountDataToBeUpdatedList;
      return
    }

    this.accountDataToUpdateList =
      AccountDataToBeUpdatedList.filter(x => x.uid !== AccountDataToBeUpdated.Sectors);
  }


  private emitChanges() {
    const payload = {
      applicationDate: this.formHandler.getControl(this.controls.applicationDate).value,
      dataToUpdate: this.selection.selected.map(x => x.uid),
    };

    sendEvent(this.accountEditionConfigEvent, AccountEditionConfigEventType.FORM_CHANGED, payload);
  }

}
