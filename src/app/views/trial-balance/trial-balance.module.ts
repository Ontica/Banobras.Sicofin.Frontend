/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';
import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { SharedModule } from '@app/shared/shared.module';

import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
import { TrialBalanceControlsComponent } from './trial-balance-table/trial-balance-controls.component';
import { TrialBalanceFilterComponent } from './trial-balance-filter/trial-balance-filter.component';
import { TrialBalanceTableComponent } from './trial-balance-table/trial-balance-table.component';

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
    TrialBalanceComponent,
    TrialBalanceControlsComponent,
    TrialBalanceFilterComponent,
    TrialBalanceTableComponent,
  ],
  exports: [
    TrialBalanceComponent,
  ]
})
export class TrialBalanceModule { }
