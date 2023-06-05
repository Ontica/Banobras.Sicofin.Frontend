/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { DateString, DateStringLibrary, EventInfo, Identifiable } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { Account, AccountDataToBeUpdated, AccountDataToBeUpdatedList, AccountRole, EmptyAccount,
         getAccountMainRole } from '@app/models';

export enum AccountEditionConfigEventType {
  FORM_CHANGED = 'AccountEditionConfigComponent.Event.FormChanged',
}

interface AccountEditionConfigFormModel extends FormGroup<{
  applicationDate: FormControl<DateString>;
  dataToUpdate: FormControl<Identifiable[]>;
}> { }

@Component({
  selector: 'emp-fa-account-edition-config',
  templateUrl: './account-edition-config.component.html',
})
export class AccountEditionConfigComponent implements OnInit {

  @Input() account: Account = EmptyAccount;

  @Output() accountEditionConfigEvent = new EventEmitter<EventInfo>();

  form: AccountEditionConfigFormModel;

  formHelper = FormHelper;

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


  get isFormValid(): boolean {
    return this.formHelper.isFormReady(this.form);
  }


  invalidateForm() {
    this.formHelper.markFormControlsAsTouched(this.form);
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
    const fb = new FormBuilder();

    this.form = fb.group({
      applicationDate: ['' as DateString, Validators.required],
      dataToUpdate: [[] as Identifiable[], [Validators.required, Validators.minLength(1)]],
    });
  }


  private setMinAndMaxDates(){
    this.minDate = DateStringLibrary.todayAddDays(1);
    this.maxDate = DateStringLibrary.todayAddDays(8);
  }


  private setFormSelection() {
    this.form.controls.dataToUpdate.reset(this.selection.selected);
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
      applicationDate: this.form.controls.applicationDate.value,
      dataToUpdate: this.selection.selected.map(x => x.uid),
    };

    sendEvent(this.accountEditionConfigEvent, AccountEditionConfigEventType.FORM_CHANGED, payload);
  }

}
