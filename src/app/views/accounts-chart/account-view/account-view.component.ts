/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { DateStringLibrary } from '@app/core';

import { Account, EmptyAccount } from '@app/models';


import { FormHandler } from '@app/shared/utils';


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


  private setFormModel() {
    this.formHandler.form.reset({
      accountsChart: this.account.accountsChart.name,
      startDate: DateStringLibrary.format(this.account.startDate),
      endDate: DateStringLibrary.format(this.account.endDate),
      number: this.account.number,
      name: this.account.name,
      description: this.account.description,
      role: this.account.role,
      type: this.account.type,
      debtorCreditor: this.account.debtorCreditor,
    });
  }

}
