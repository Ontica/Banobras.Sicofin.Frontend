/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { Account, AccountHistory, AccountRole, AreaRule, CurrencyRule,
         EmptyAccount, LedgerRule, SectorRule } from '@app/models';

@Component({
  selector: 'emp-fa-account-tabbed-view',
  templateUrl: './account-tabbed-view.component.html',
})
export class AccountTabbedViewComponent implements OnChanges {

  @Input() account: Account = EmptyAccount;

  @Output() closeEvent = new EventEmitter<void>();

  title = '';
  hint = '';
  selectedTabIndex = 0;

  areaRulesDS: MatTableDataSource<AreaRule>;
  currencyRulesDS: MatTableDataSource<CurrencyRule>;
  sectorRulesDS: MatTableDataSource<SectorRule>;
  ledgerRulesDS: MatTableDataSource<LedgerRule>;
  accountHistoryDS: MatTableDataSource<AccountHistory>;

  ngOnChanges() {
    this.setTitle();
    this.setDataSources();
  }


  onClose() {
    this.closeEvent.emit();
  }


  showSectors() {
    return this.account.role === AccountRole.Sectorizada ||
           this.account.sectorRules.length !== 0;
  }


  private setTitle() {
    this.title = `${this.account.number}: ${this.account.name}`;
    this.hint = this.account.accountsChart.name;
  }


  private setDataSources() {
    this.areaRulesDS = new MatTableDataSource(this.account.areaRules);
    this.currencyRulesDS = new MatTableDataSource(this.account.currencyRules);
    this.sectorRulesDS = new MatTableDataSource(this.account.sectorRules);
    this.ledgerRulesDS = new MatTableDataSource(this.account.ledgerRules);
    this.accountHistoryDS = new MatTableDataSource(this.account.history);
  }


  private setSelectedTabIndex() {
    this.selectedTabIndex = 0;
  }

}
