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

import { AccountsChartModule } from '@app/views/accounts-chart/accounts-chart.module';


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
  ],

  declarations: [
    AccountingCataloguesAndRulesWorkspaceComponent
  ],

  exports: [

  ]

})
export class AccountingCataloguesAndRulesWorkplaceModule { }
