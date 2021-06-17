
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

import { ReportsControlsModule } from '../reports-controls/reports-controls.module';

import { AccountsChartComponent } from './accounts-chart/accounts-chart.component';
import { AccountsChartControlsComponent } from './accounts-chart-list/accounts-chart-controls.component';
import { AccountsChartFilterComponent } from './accounts-chart-filter/accounts-chart-filter.component';
import { AccountsChartListComponent } from './accounts-chart-list/accounts-chart-list.component';
import { AccountsChartListEntryComponent } from './accounts-chart-list/accounts-chart-list-entry.component';
import { AccountTabbedViewComponent } from './account-tabbed-view/account-tabbed-view.component';
import { AccountViewComponent } from './account-view/account-view.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    ReportsControlsModule,
  ],
  declarations: [
    AccountsChartComponent,
    AccountsChartControlsComponent,
    AccountsChartFilterComponent,
    AccountsChartListComponent,
    AccountsChartListEntryComponent,
    AccountTabbedViewComponent,
    AccountViewComponent,
  ],
  exports: [
    AccountsChartComponent,
    AccountTabbedViewComponent,
  ]
})
export class AccountsChartModule { }
