/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { BalancesStoreDataService } from '@app/data-services';

import { AccountsChartMasterData, EmptyStoredBalanceSet, StoredBalance, StoredBalanceSet } from '@app/models';

import {
  StoredBalanceSetsTableEventType
} from '@app/views/balances-generation/stored-balance-sets-table/stored-balance-sets-table.component';


@Component({
  selector: 'emp-fa-system-management-workspace',
  templateUrl: './system-management-workspace.component.html'
})
export class SystemManagementWorkspaceComponent {

  storedBalanceSetList: StoredBalanceSet[] = [];

  selectedStoredBalanceSet: StoredBalanceSet = EmptyStoredBalanceSet;

  isLoading = false;

  displayBalanceSetTabbedView = false;

  accountChartSelected: AccountsChartMasterData = null;


  constructor(private balancesStoreData: BalancesStoreDataService) {

  }


  onStoredBalanceSetsTableEvent(event: EventInfo): void {

    switch (event.type as StoredBalanceSetsTableEventType) {

      case StoredBalanceSetsTableEventType.SEARCH_BALANCES_SET:
        Assertion.assertValue(event.payload.accountsChart, 'event.payload.accountsChart');
        this.accountChartSelected = event.payload.accountsChart as AccountsChartMasterData;
        this.getBalancesSetsList();
        return;

      case StoredBalanceSetsTableEventType.SELECT_BALANCES_SET:
        Assertion.assertValue(event.payload.storedBalanceSet, 'event.payload.storedBalanceSet');
        Assertion.assertValue(event.payload.storedBalanceSet.uid, 'event.payload.storedBalanceSet.uid');

        this.getStoredBalanceSet(event.payload.storedBalanceSet.uid);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseStoredBalanceSetTabbedView() {
    this.displayBalanceSetTabbedView = false;
    this.selectedStoredBalanceSet = EmptyStoredBalanceSet;
  }


  private getBalancesSetsList() {
    if (isEmpty(this.accountChartSelected)) {
      return;
    }

    this.balancesStoreData.getBalancesSetsList(this.accountChartSelected.uid)
      .toPromise()
      .then(x => {
        this.storedBalanceSetList = x;
      });
  }


  private getStoredBalanceSet(balanceSetUID: string) {
    if (isEmpty(this.accountChartSelected) || !balanceSetUID) {
      return;
    }

    this.isLoading = true;

    this.balancesStoreData.getStoredBalanceSet(this.accountChartSelected.uid, balanceSetUID)
      .toPromise()
      .then(x => {
        this.selectedStoredBalanceSet = x;
        this.displayBalanceSetTabbedView = true;
      })
      .finally(() => this.isLoading = false);
  }

}
