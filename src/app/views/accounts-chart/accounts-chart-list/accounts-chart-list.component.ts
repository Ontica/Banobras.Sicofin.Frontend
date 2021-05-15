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

  maxLevel = 11;

  ngOnChanges(): void {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }

    if (this.displayAccountsChartList) {
      this.maxLevel = this.accountsChart.accounts
                      .reduce((prev, current) => (prev.level > current.level) ? prev : current).level;
    }
  }

  get displayAccountsChartList() {
    return !isEmpty(this.accountsChart);
  }


  getBorderColorByLevel(level) {
    return '3px solid ' + colorGradient((1 / this.maxLevel) * (this.maxLevel / level),
                                        {red: 255, green: 255, blue: 255},
                                        {red: 35, green: 91, blue: 78},
                                        {red: 16, green: 49, blue: 43});
  }

}


function colorGradient(fadeFraction, rgbColor1, rgbColor2, rgbColor3) {
  let color1 = rgbColor1;
  let color2 = rgbColor2;
  let fade = fadeFraction;

  if (rgbColor3) {
    fade = fade * 2;

    if (fade >= 1) {
      fade -= 1;
      color1 = rgbColor2;
      color2 = rgbColor3;
    }
  }

  const diffRed = color2.red - color1.red;
  const diffGreen = color2.green - color1.green;
  const diffBlue = color2.blue - color1.blue;

  const gradient = {
    red: parseInt(Math.floor(color1.red + (diffRed * fade)).toString(), 10),
    green: parseInt(Math.floor(color1.green + (diffGreen * fade)).toString(), 10),
    blue: parseInt(Math.floor(color1.blue + (diffBlue * fade)).toString(), 10),
  };

  return 'rgb(' + gradient.red + ',' + gradient.green + ',' + gradient.blue + ')';
}
