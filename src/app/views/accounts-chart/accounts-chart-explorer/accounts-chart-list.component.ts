/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output,
         SimpleChanges, ViewChild } from '@angular/core';

import { EventInfo, isEmpty } from '@app/core';

import { Account, AccountDescriptor, AccountsChart, EmptyAccount, EmptyAccountsChart } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { AccountsChartControlsEventType } from './accounts-chart-controls.component';

export enum AccountsChartListEventType {
  ACCOUNT_CLICKED = 'AccountsChartList.Event.AccountClicked',
  EXPORT_ACCOUNTS = 'AccountsChartList.Event.ExportAccounts',
}

@Component({
  selector: 'emp-fa-accounts-chart-list',
  templateUrl: './accounts-chart-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsChartListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() accountsChart: AccountsChart = EmptyAccountsChart;

  @Input() selectedAccount: Account = EmptyAccount;

  @Output() accountsChartListEvent = new EventEmitter<EventInfo>();

  maxLevel = 11;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.accountsChart) {
      if (this.virtualScroll) {
        this.virtualScroll.scrollToIndex(0);
      }

      if (this.displayAccountsChartList && this.accountsChart.accounts.length > 0) {
        this.maxLevel = this.accountsChart.accounts
                        .reduce((prev, current) => (prev.level > current.level) ? prev : current).level;
      }
    }
  }


  get displayAccountsChartList() {
    return !isEmpty(this.accountsChart);
  }


  isSelected(account: Account) {
    return (this.selectedAccount.uid === account.uid);
  }


  onAccountClicked(account: AccountDescriptor) {
    sendEvent(this.accountsChartListEvent, AccountsChartListEventType.ACCOUNT_CLICKED, { account });
  }


  onAccountsChartControlsEvent(event: EventInfo) {
   switch (event.type as AccountsChartControlsEventType) {

      case AccountsChartControlsEventType.EXPORT_BUTTON_CLICKED:

        sendEvent(this.accountsChartListEvent, AccountsChartListEventType.EXPORT_ACCOUNTS);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
