
/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsChartMainPageComponent } from './main-page/accounts-chart-main-page.component';
import { AccountsChartComponent } from './accounts-chart/accounts-chart.component';
import { SharedModule } from '@app/shared/shared.module';
import { AccountsChartFilterComponent } from './accounts-chart-filter/accounts-chart-filter.component';
import { AccountsChartListComponent } from './accounts-chart-list/accounts-chart-list.component';
import { AccountsChartControlsComponent } from './accounts-chart-list/accounts-chart-controls.component';
import { AccountsChartListEntryComponent } from './accounts-chart-list/accounts-chart-list-entry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,
  ],
  declarations: [
    AccountsChartMainPageComponent,
    AccountsChartComponent,
    AccountsChartFilterComponent,
    AccountsChartListComponent,
    AccountsChartControlsComponent,
    AccountsChartListEntryComponent,
  ],
  exports: [
    AccountsChartMainPageComponent,
  ]
})
export class AccountsChartModule { }
