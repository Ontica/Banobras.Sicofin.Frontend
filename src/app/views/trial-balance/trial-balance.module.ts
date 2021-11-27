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

import { ReportsControlsModule } from '../reports-controls/reports-controls.module';

import { BalanceQuickFilterComponent } from './trial-balance-viewer/balance-quick-filter.component';
import { ExchangeRateSelectorComponent } from './exchange-rate-selector/exchange-rate-selector.component';
import { TrialBalanceExplorerComponent } from './trial-balance-explorer/trial-balance-explorer.component';
import { TrialBalanceFilterComponent } from './trial-balance-viewer/trial-balance-filter.component';
import { TrialBalanceViewerComponent } from './trial-balance-viewer/trial-balance-viewer.component';

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
    BalanceQuickFilterComponent,
    ExchangeRateSelectorComponent,
    TrialBalanceExplorerComponent,
    TrialBalanceFilterComponent,
    TrialBalanceViewerComponent,
  ],
  exports: [
    TrialBalanceExplorerComponent,
  ]
})
export class TrialBalanceModule { }
