/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { EmptyTrialBalance, TrialBalance } from '@app/models';

@Component({
  selector: 'emp-fa-trial-balance-controls',
  templateUrl: './trial-balance-controls.component.html',
})
export class TrialBalanceControlsComponent {

  @Input() trialBalance: TrialBalance = EmptyTrialBalance;

}
