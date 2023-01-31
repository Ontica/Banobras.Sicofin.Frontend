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

import { FinancialReportDesignerComponent } from './financial-report-designer/financial-report-designer.component';
import { FinancialReportDesignerControlsComponent } from './financial-report-designer/financial-report-designer-controls.component';
import { FinancialReportDesignerGridComponent } from './financial-report-designer/financial-report-designer-grid.component';
import { FinancialReportDesignerViewerComponent } from './financial-report-designer-viewer/financial-report-designer-viewer.component';
import { FinancialReportSelectorComponent } from './financial-report-designer-viewer/financial-report-selector.component';
import { FixedCellEditorComponent } from './financial-report-edition/fixed-cell-editor.component';
import { FixedColumnEditorComponent } from './financial-report-edition/fixed-column-editor.component';
import { FixedRowEditorComponent } from './financial-report-edition/fixed-row-editor.component';
import { ItemMenuComponent } from './financial-report-edition/item-menu.component';


@NgModule({
  declarations: [
    FinancialReportDesignerComponent,
    FinancialReportDesignerControlsComponent,
    FinancialReportDesignerGridComponent,
    FinancialReportDesignerViewerComponent,
    FinancialReportSelectorComponent,
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
    FinancialReportDesignerViewerComponent,
  ]
})
export class FinancialReportsDesignerModule { }
