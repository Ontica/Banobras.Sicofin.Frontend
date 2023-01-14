/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, ViewChild } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { Account, EmptyAccount } from '@app/models';

import {
  AccountTabbedViewEventType
} from '@app/views/accounts-chart/account-tabbed-view/account-tabbed-view.component';

import {
  AccountsChartExplorerComponent,
  AccountsChartExplorerEventType
} from '@app/views/accounts-chart/accounts-chart-explorer/accounts-chart-explorer.component';


@Component({
  selector: 'emp-fa-accounts-chart-main-page',
  templateUrl: './accounts-chart-main-page.component.html',
})
export class AccountsChartMainPageComponent {

  @ViewChild('accountChartExplorer') accountChartExplorer: AccountsChartExplorerComponent;

  displayAccountChartTabbed = false;

  selectedAccount: Account = EmptyAccount;


  onAccountsChartExplorerEvent(event: EventInfo) {
    switch (event.type as AccountsChartExplorerEventType) {
      case AccountsChartExplorerEventType.ACCOUNT_SELECTED:
        Assertion.assertValue(event.payload.account, 'event.payload.account');
        this.setSelectedAccount(event.payload.account as Account);
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
        this.setSelectedAccount(event.payload.account as Account);
        this.refreshAccountChartExplorer()
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


  private refreshAccountChartExplorer() {
    this.accountChartExplorer.refreshSearchAccounts();
  }

}
