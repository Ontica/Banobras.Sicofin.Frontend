/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { Account, EmptyAccount } from '@app/models';

import {
  AccountTabbedViewEventType
} from '@app/views/accounts-chart/account-tabbed-view/account-tabbed-view.component';

import { AccountsChartEventType } from '@app/views/accounts-chart/accounts-chart/accounts-chart.component';


@Component({
  selector: 'emp-fa-accounts-chart-main-page',
  templateUrl: './accounts-chart-main-page.component.html',
})
export class AccountsChartMainPageComponent {

  displayAccountChartTabbed = false;

  selectedAccount: Account = EmptyAccount;


  onAccountsChartEvent(event: EventInfo) {
    switch (event.type as AccountsChartEventType) {
      case AccountsChartEventType.ACCOUNT_SELECTED:
        this.selectedAccount = isEmpty(event.payload.account) ? EmptyAccount : event.payload.account;
        this.displayAccountChartTabbed = !isEmpty(this.selectedAccount);

        break;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAccountTabbedViewEvent(event: EventInfo) {
    switch (event.type as AccountTabbedViewEventType) {
      case AccountTabbedViewEventType.CLOSE_MODAL_CLICKED:
        this.setSelectedAccount(EmptyAccount);
        break;

      case AccountTabbedViewEventType.ACCOUNT_UPDATED:
        Assertion.assertValue(event.payload.account, 'event.payload.account');
        this.setSelectedAccount(event.payload.account);
        break;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setSelectedAccount(account: Account) {
    this.selectedAccount = isEmpty(account) ? EmptyAccount : account;
    this.displayAccountChartTabbed = !isEmpty(this.selectedAccount);
  }

}
