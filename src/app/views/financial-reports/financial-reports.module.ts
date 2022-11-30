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

import { FinancialReportBreakdownTabbedViewComponent } from './financial-report-breakdown-tabbed-view/financial-report-breakdown-tabbed-view.component';
import { FinancialReportDesignerComponent } from './financial-report-designer/financial-report-designer/financial-report-designer.component';
import { FinancialReportDesignerControlsComponent } from './financial-report-designer/financial-report-designer/financial-report-designer-controls.component';
import { FinancialReportDesignerGridComponent } from './financial-report-designer/financial-report-designer/financial-report-designer-grid.component';
import { FinancialReportDesignerViewerComponent } from './financial-report-designer/financial-report-designer-viewer/financial-report-designer-viewer.component';
import { FinancialReportFilterComponent } from './financial-report-viewer/financial-report-filter.component';
import { FinancialReportSelectorComponent } from './financial-report-designer/financial-report-designer-viewer/financial-report-selector.component';
import { FinancialReportViewerComponent } from './financial-report-viewer/financial-report-viewer.component';
import { FixedCellEditorComponent } from './financial-report-designer/financial-report-edition/fixed-cell-editor.component';
import { FixedColumnEditorComponent } from './financial-report-designer/financial-report-edition/fixed-column-editor.component';
import { FixedRowEditorComponent } from './financial-report-designer/financial-report-edition/fixed-row-editor.component';
import { ItemMenuComponent } from './financial-report-designer/financial-report-edition/item-menu.component';


@NgModule({
  declarations: [
    FinancialReportBreakdownTabbedViewComponent,
    FinancialReportDesignerComponent,
    FinancialReportDesignerControlsComponent,
    FinancialReportDesignerGridComponent,
    FinancialReportDesignerViewerComponent,
    FinancialReportFilterComponent,
    FinancialReportSelectorComponent,
    FinancialReportViewerComponent,
    FixedCellEditorComponent,
    FixedColumnEditorComponent,
    FixedRowEditorComponent,
    ItemMenuComponent,
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
    FinancialReportDesignerViewerComponent,
    FinancialReportViewerComponent,
  ]
})
export class FinancialReportsModule { }
