/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { DateStringLibrary, EventInfo } from '@app/core';

import { MatTableDataSource } from '@angular/material/table';

import { BalancesDataService } from '@app/data-services';

import { Account, AccountBalance, AccountHistory, AreaRule, CurrencyRule, EmptyAccount, LedgerRule,
         SectorRule } from '@app/models';

import { AccountViewEventType } from './account-view.component';

import { sendEvent } from '@app/shared/utils';

export enum AccountTabbedViewEventType {
  CLOSE_MODAL_CLICKED = 'AccountTabbedViewComponent.Event.CloseModalClicked',
  ACCOUNT_UPDATED = 'AccountTabbedViewComponent.Event.AccountUpdated',
}


@Component({
  selector: 'emp-fa-account-tabbed-view',
  templateUrl: './account-tabbed-view.component.html',
})
export class AccountTabbedViewComponent implements OnChanges {

  @Input() account: Account = EmptyAccount;

  @Output() accountTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';
  hint = '';
  selectedTabIndex = 0;

  areaRulesDS: MatTableDataSource<AreaRule>;
  currencyRulesDS: MatTableDataSource<CurrencyRule>;
  sectorRulesDS: MatTableDataSource<SectorRule>;
  ledgerRulesDS: MatTableDataSource<LedgerRule>;
  accountHistoryDS: MatTableDataSource<AccountHistory>;
  accountBalancesDS: MatTableDataSource<AccountBalance>;

  constructor(private balancesDataService: BalancesDataService) { }

  ngOnChanges() {
    this.setTitle();
    this.setDataSources();
  }


  onClose() {
    sendEvent(this.accountTabbedViewEvent, AccountTabbedViewEventType.CLOSE_MODAL_CLICKED);
  }


  calculateBalances() {
    this.balancesDataService.getLedgersAccountsBalances(this.account.uid)
                            .toPromise()
                            .then(x => this.accountBalancesDS = new MatTableDataSource(x));
  }


  onAccountViewEvent(event: EventInfo) {
    switch (event.type as AccountViewEventType) {

      case AccountViewEventType.ACCOUNT_UPDATED:
        sendEvent(this.accountTabbedViewEvent, AccountTabbedViewEventType.ACCOUNT_UPDATED, event.payload);
        break;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    this.title = `${this.account.number}: ${this.account.name}`;

    const startDate = DateStringLibrary.format(this.account.startDate);

    this.hint = `<strong>${this.account.accountsChart.name} &nbsp; &nbsp; | &nbsp; &nbsp; </strong>` +
      `${this.account.role} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${this.account.type.name} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${this.account.debtorCreditor} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${startDate}`;
  }


  private setDataSources() {
    this.areaRulesDS = new MatTableDataSource(this.account.areaRules);
    this.currencyRulesDS = new MatTableDataSource(this.account.currencyRules);
    this.sectorRulesDS = new MatTableDataSource(this.account.sectorRules);
    this.ledgerRulesDS = new MatTableDataSource(this.account.ledgerRules);
    this.accountHistoryDS = new MatTableDataSource(this.account.history);
  }

}
