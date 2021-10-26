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

import { AccountingDashboardsWorkspaceRoutingModule } from './accounting-dashboards-workspace-routing.module';
import { FinancialReportsModule } from '@app/views/financial-reports/financial-reports.module';
import { OperationalReportsModule } from '@app/views/operational-reports/operational-reports.module';
import { TrialBalanceModule } from '@app/views/trial-balance/trial-balance.module';

import { AccountingDashboardsWorkspaceComponent } from './accounting-dashboards-workspace.component';
import { FinancialReportsMainPageComponent } from './financial-reports-main-page/financial-reports-main-page.component';
import { OperationalReportsMainPageComponent } from './operational-reports-main-page/operational-reports-main-page.component';
import { TrialBalanceMainPageComponent } from './trial-balance-main-page/trial-balance-main-page.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    AccountingDashboardsWorkspaceRoutingModule,
    FinancialReportsModule,
    OperationalReportsModule,
    TrialBalanceModule,
  ],

  declarations: [
    AccountingDashboardsWorkspaceComponent,
    FinancialReportsMainPageComponent,
    OperationalReportsMainPageComponent,
    TrialBalanceMainPageComponent,
  ],

  exports: [

  ]

})
export class AccountingDashboardsWorkspaceModule { }
