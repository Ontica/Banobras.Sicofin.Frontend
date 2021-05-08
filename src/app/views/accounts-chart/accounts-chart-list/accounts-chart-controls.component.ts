/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';
import { AccountsChart, EmptyAccountsChart } from '@app/models';


@Component({
  selector: 'emp-fa-accounts-chart-controls',
  templateUrl: './accounts-chart-controls.component.html',
})
export class AccountsChartControlsComponent{

  @Input() accountsChart: AccountsChart = EmptyAccountsChart;

}
