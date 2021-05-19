/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AccountDescriptor } from '@app/models';

@Component({
  selector: 'emp-fa-accounts-chart-list-entry',
  templateUrl: './accounts-chart-list-entry.component.html',
})
export class AccountsChartListEntryComponent {

  @Input() account: AccountDescriptor;

  @Input() maxLevel = 11;

  @Input() displayHeader = false;

  @Output() accountClicked = new EventEmitter<AccountDescriptor>();

  onAccountClicked(){
    this.accountClicked.emit(this.account);
  }


  get widthByMaxLevel() {
    return this.maxLevel >= 5 ? 22 * this.maxLevel : 110;
  }


  get marginLeftByLevel() {
    if (this.account.level >= 3) {
      return this.account.level * 8 - 8;
    }

    return 0;
  }

}
