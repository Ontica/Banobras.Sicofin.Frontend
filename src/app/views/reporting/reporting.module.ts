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

import { LockedUpBalancesFilterComponent } from './locked-up-balances/locked-up-balances-filter.component';
import { LockedUpBalancesModalComponent } from './locked-up-balances/locked-up-balances-modal.component';
import { FinancialReportBreakdownTabbedViewComponent } from './report-builder/reports-breakdown/financial-report-breakdown-tabbed-view.component';
import { FinancialReportFilterComponent } from './report-builder/reports-filters/financial-report-filter.component';
import { OperationalReportFilterComponent } from './report-builder/reports-filters/operational-report-filter.component';
import { ReportBuilderComponent } from './report-builder/report-builder.component';
import { ReportViewerComponent } from './report-builder/report-viewer.component';


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
    LockedUpBalancesFilterComponent,
    LockedUpBalancesModalComponent,

    FinancialReportBreakdownTabbedViewComponent,
    FinancialReportFilterComponent,
    OperationalReportFilterComponent,
    ReportBuilderComponent,
    ReportViewerComponent,
  ],
  exports: [
    LockedUpBalancesModalComponent,
    ReportBuilderComponent,
  ]
})
export class ReportingModule { }
