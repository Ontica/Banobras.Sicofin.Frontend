/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';

import { Account, EmptyAccount } from '@app/models';

import { FormHandler } from '@app/shared/utils';

enum AccountViewFormControls {
  accountsChart = 'accountsChart',
  date = 'date',
  number = 'number',
  name = 'name',
  role = 'role',
  type = 'type',
  debtorCreditor = 'debtorCreditor',
  notes = 'notes',
}

@Component({
  selector: 'emp-fa-account-view',
  templateUrl: './account-view.component.html',
})
export class AccountViewComponent implements OnChanges {

  @Input() account: Account = EmptyAccount;

  formHandler: FormHandler;

  controls = AccountViewFormControls;

  editionMode = false;

  optionSelected: any = null;

  constructor() {
    this.initForm();
  }

  ngOnChanges(): void {
    this.enableEditor(false);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;
    this.setFormModel();
    this.formHandler.disableForm(!this.editionMode);
  }


  onWizardClicked() {
    if (this.optionSelected && this.formHandler.isReadyForSubmit) {
      console.log(this.optionSelected, this.account);
    }
  }


  private initForm() {
    this.formHandler = new FormHandler(
      new FormGroup({
        accountsChart: new FormControl(''),
        date: new FormControl(''),
        number: new FormControl(''),
        name: new FormControl(''),
        role: new FormControl(''),
        type: new FormControl(''),
        debtorCreditor: new FormControl(''),
        notes: new FormControl(''),
      })
    );
  }


  private setFormModel() {
    this.formHandler.form.reset({
      accountsChart: this.account.accountsChart.name,
      date: '', // this.account.date,
      number: this.account.number,
      name: this.account.name,
      role: this.account.role,
      type: this.account.type,
      debtorCreditor: this.account.debtorCreditor,
      notes: '', // this.account.notes,
    });
  }

}
