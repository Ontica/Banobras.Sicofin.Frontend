/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { AccountDescriptor } from '@app/models';


@Component({
  selector: 'emp-fa-accounts-chart-list-entry',
  templateUrl: './accounts-chart-list-entry.component.html',
})
export class AccountsChartListEntryComponent {

  @Input() account: AccountDescriptor;

}
