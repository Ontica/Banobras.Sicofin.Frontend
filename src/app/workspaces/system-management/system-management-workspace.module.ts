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
import { SharedModule } from '@app/shared/shared.module';

import { SystemManagementWorkspaceRoutingModule } from './system-management-workspace-routing.module';
import { AccessControlModule } from '@app/views/_access-control/access-control.module';
import { BalancesGenerationModule } from '@app/views/balances-generation/balances-generation.module';
import { ExchangeRatesModule } from '@app/views/exchange-rates/exchange-rates.module';
import { ProcessesModule } from '@app/views/processes/processes.module';
import { ReportingModule } from '@app/views/reporting/reporting.module';
import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';

import {
  AccessControlMainPageComponent
} from './access-control-main-page/access-control-main-page.component';

import {
  BalanceGenerationMainPageComponent
} from './balance-generation-main-page/balance-generation-main-page.component';

import {
  ControlPanelMainPageComponent
} from './control-panel-main-page/control-panel-page.component';

import {
  ExchangeRatesMainPageComponent
} from './exchange-rates-main-page/exchange-rates-main-page.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    SystemManagementWorkspaceRoutingModule,
    AccessControlModule,
    BalancesGenerationModule,
    ExchangeRatesModule,
    ProcessesModule,
    ReportingModule,
    ReportsControlsModule,
  ],

  declarations: [
    AccessControlMainPageComponent,
    BalanceGenerationMainPageComponent,
    ControlPanelMainPageComponent,
    ExchangeRatesMainPageComponent,
  ],

})
export class SystemManagementWorkspaceModule { }
