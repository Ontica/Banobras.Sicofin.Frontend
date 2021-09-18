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

import {
  FinancialReportBreakdownTabbedViewComponent
} from './financial-report-breakdown-tabbed-view/financial-report-breakdown-tabbed-view.component';
import { FinancialReportFilterComponent } from './financial-report-viewer/financial-report-filter.component';
import { FinancialReportViewerComponent } from './financial-report-viewer/financial-report-viewer.component';

@NgModule({
  declarations: [
    FinancialReportBreakdownTabbedViewComponent,
    FinancialReportFilterComponent,
    FinancialReportViewerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    ReportsControlsModule,
  ],
  exports: [
    FinancialReportBreakdownTabbedViewComponent,
    FinancialReportViewerComponent,
  ]
})
export class FinancialReportsModule { }
