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
import { FinancialConceptsModule } from '@app/views/financial-concepts/financial-concepts.module';
import { FinancialReportsModule } from '@app/views/financial-reports/financial-reports.module';
import { ReportsControlsModule } from '@app/views/reports-controls/reports-controls.module';
import { SubledgerAccountsModule } from '@app/views/subledger-accounts/subledger-accounts.module';

import {
  AccountingCataloguesAndRulesWorkspaceComponent
} from './accounting-catalogues-and-rules-workspace.component';
import {
  AccountsChartMainPageComponent
} from './accounts-chart-main-page/accounts-chart-main-page.component';
import {
  FinancialConceptsMainPageComponent
} from './financial-concepts-main-page/financial-concepts-main-page.component';
import {
  ReportDesignerMainPageComponent
} from './reports-designer-main-page/reports-designer-main-page.component';
import {
  SubledgerAccountsMainPageComponent
} from './subledger-accounts-main-page/subledger-accounts-main-page.component';


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
    FinancialConceptsModule,
    FinancialReportsModule,
    ReportsControlsModule,
    SubledgerAccountsModule,
  ],

  declarations: [
    AccountingCataloguesAndRulesWorkspaceComponent,
    AccountsChartMainPageComponent,
    FinancialConceptsMainPageComponent,
    ReportDesignerMainPageComponent,
    SubledgerAccountsMainPageComponent,
  ],

  exports: [

  ]

})
export class AccountingCataloguesAndRulesWorkplaceModule { }
