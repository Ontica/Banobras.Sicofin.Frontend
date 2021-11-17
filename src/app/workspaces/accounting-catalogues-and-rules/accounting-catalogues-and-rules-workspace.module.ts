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

import {
  AccountingCataloguesAndRulesWorkspaceRoutingModule
} from './accounting-catalogues-and-rules-workspace-routing.module';
import { AccountsChartModule } from '@app/views/accounts-chart/accounts-chart.module';
import { FinancialReportsModule } from '@app/views/financial-reports/financial-reports.module';
import { GroupingRulesModule } from '@app/views/grouping-rules/grouping-rules.module';

import {
  AccountingCataloguesAndRulesWorkspaceComponent
} from './accounting-catalogues-and-rules-workspace.component';
import {
  AccountsChartMainPageComponent
} from './accounts-chart-main-page/accounts-chart-main-page.component';
import {
  GroupingRulesMainPageComponent
} from './grouping-rules-main-page/grouping-rules-main-page.component';
import {
  ReportDesignerMainPageComponent
} from './reports-designer-main-page/reports-designer-main-page.component';
import {
  SubledgerAccountsMainPageComponent
} from './subledger-accounts-main-page/subledger-accounts-main-page.component';
import { ReportsControlsModule } from '@app/views/reports-controls/reports-controls.module';
import { SubledgerAccountsModule } from '@app/views/subledger-accounts/subledger-accounts.module';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    AccountingCataloguesAndRulesWorkspaceRoutingModule,
    AccountsChartModule,
    FinancialReportsModule,
    GroupingRulesModule,
    ReportsControlsModule,
    SubledgerAccountsModule,
  ],

  declarations: [
    AccountingCataloguesAndRulesWorkspaceComponent,
    AccountsChartMainPageComponent,
    GroupingRulesMainPageComponent,
    ReportDesignerMainPageComponent,
    SubledgerAccountsMainPageComponent,
  ],

  exports: [

  ]

})
export class AccountingCataloguesAndRulesWorkplaceModule { }
