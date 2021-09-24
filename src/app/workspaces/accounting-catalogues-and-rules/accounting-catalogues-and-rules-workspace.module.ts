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
  AccountingCataloguesAndRulesWorkspaceComponent
} from './accounting-catalogues-and-rules-workspace.component';

import {
  AccountingCataloguesAndRulesWorkspaceRoutingModule
} from './accounting-catalogues-and-rules-workspace-routing.module';
import { FinancialReportsModule } from '@app/views/financial-reports/financial-reports.module';

import {
  AccountsChartMainPageComponent
} from './accounts-chart-main-page/accounts-chart-main-page.component';

import { AccountsChartModule } from '@app/views/accounts-chart/accounts-chart.module';
import { GroupingRulesModule } from '@app/views/grouping-rules/grouping-rules.module';
import {
  GroupingRulesMainPageComponent
} from './grouping-rules-main-page/grouping-rules-main-page.component';
import { ReportDesignerMainPageComponent } from './reports-designer-main-page/reports-designer-main-page.component';


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
  ],

  declarations: [
    AccountingCataloguesAndRulesWorkspaceComponent,
    AccountsChartMainPageComponent,
    GroupingRulesMainPageComponent,
    ReportDesignerMainPageComponent,
  ],

  exports: [

  ]

})
export class AccountingCataloguesAndRulesWorkplaceModule { }
