/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { isEmpty } from '@app/core';

import { Account, EmptyAccount } from '@app/models';

import { AccountsChartEventType } from '../accounts-chart/accounts-chart.component';


@Component({
  selector: 'emp-fa-accounts-chart-main-page',
  templateUrl: './accounts-chart-main-page.component.html',
})
export class AccountsChartMainPageComponent {

  displayAccountChartTabbed = false;

  selectedAccount: Account = EmptyAccount;


  onAccountsChartEvent(event) {
    switch (event.type as AccountsChartEventType) {
      case AccountsChartEventType.ACCOUNT_SELECTED:
        this.selectedAccount = isEmpty(event.payload.account) ? EmptyAccount : event.payload.account;
        this.displayAccountChartTabbed = !isEmpty(this.selectedAccount);

        console.log(this.selectedAccount);

        break;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

  onCloseAccountTabbedView() {
    this.selectedAccount = EmptyAccount;
    this.displayAccountChartTabbed = false;
  }

}
