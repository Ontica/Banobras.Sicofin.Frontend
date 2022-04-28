/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';

import { SharedModule } from '@app/shared/shared.module';

import { SystemManagementWorkspaceRoutingModule } from './system-management-workspace-routing.module';
import { BalancesGenerationModule } from '@app/views/balances-generation/balances-generation.module';
import { ProcessesModule } from '@app/views/processes/processes.module';
import { ReportsControlsModule } from '@app/views/reports-controls/reports-controls.module';

import {
  BalanceGenerationMainPageComponent
} from './balance-generation-main-page/balance-generation-main-page.component';

import { ControlPanelMainPageComponent } from './control-panel-main-page/control-panel-page.component';

import {
  ExchangeRatesMainPageComponent
} from './exchange-rates-main-page/exchange-rates-main-page.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    SystemManagementWorkspaceRoutingModule,
    BalancesGenerationModule,
    ProcessesModule,
    ReportsControlsModule,
  ],

  declarations: [
    BalanceGenerationMainPageComponent,
    ControlPanelMainPageComponent,
    ExchangeRatesMainPageComponent,
  ],

  exports: [

  ]

})
export class SystemManagementWorkspaceModule { }
