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

import {
  AccountingCataloguesAndRulesWorkspaceRoutingModule
} from './accounting-catalogues-and-rules-workspace-routing.module';
import { AccountsChartModule } from '@app/views/accounts-chart/accounts-chart.module';
import { AccountsListsModule } from '@app/views/accounts-lists/accounts-lists.module';
import { ExternalVariablesModule } from '@app/views/external-variables/external-variables.module';
import { FinancialConceptsModule } from '@app/views/financial-concepts/financial-concepts.module';
import {
  FinancialReportsDesignerModule
} from '@app/views/financial-reports-designer/financial-reports-designer.module';
import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';
import { SubledgerAccountsModule } from '@app/views/subledger-accounts/subledger-accounts.module';

import {
  AccountsChartMainPageComponent
} from './accounts-chart-main-page/accounts-chart-main-page.component';
import {
  AccountsListsMainPageComponent
} from './accounts-lists-main-page/accounts-lists-main-page.component';
import {
  ExternalVariablesMainPageComponent
} from './external-variables-main-page/external-variables-main-page.component';
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
    SharedModule,

    AccountingCataloguesAndRulesWorkspaceRoutingModule,
    AccountsChartModule,
    AccountsListsModule,
    ExternalVariablesModule,
    FinancialConceptsModule,
    FinancialReportsDesignerModule,
    ReportsControlsModule,
    SubledgerAccountsModule,
  ],

  declarations: [
    AccountsChartMainPageComponent,
    AccountsListsMainPageComponent,
    ExternalVariablesMainPageComponent,
    FinancialConceptsMainPageComponent,
    ReportDesignerMainPageComponent,
    SubledgerAccountsMainPageComponent,
  ],

})
export class AccountingCataloguesAndRulesWorkplaceModule { }
