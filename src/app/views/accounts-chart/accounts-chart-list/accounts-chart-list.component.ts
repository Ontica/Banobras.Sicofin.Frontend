/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewChild } from '@angular/core';

import { isEmpty } from '@app/core';

import { AccountsChart, EmptyAccountsChart } from '@app/models';

@Component({
  selector: 'emp-fa-accounts-chart-list',
  templateUrl: './accounts-chart-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsChartListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() accountsChart: AccountsChart = EmptyAccountsChart;

  ngOnChanges(): void {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }
  }

  get displayAccountsChartList() {
    return !isEmpty(this.accountsChart);
  }

}
