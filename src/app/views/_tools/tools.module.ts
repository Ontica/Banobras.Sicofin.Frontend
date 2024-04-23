/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { BalancesToolComponent } from './balances-tool/balances-tool.component';

import { TrialBalanceModule } from '../trial-balance/trial-balance.module';


@NgModule({
  declarations: [
    BalancesToolComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,

    TrialBalanceModule,
  ],
  exports: [
    BalancesToolComponent,
  ],
})
export class ToolsModule { }
