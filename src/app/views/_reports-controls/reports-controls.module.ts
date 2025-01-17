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

import { DataImporterComponent } from './imported-data-viewer/data-importer.component';
import { DataTableComponent } from './data-table/data-table.component';
import { DataTableControlsComponent } from './data-table/data-table-controls.component';
import { ExportReportModalComponent } from './export-report-modal/export-report-modal.component';
import { ImportedDataFilterComponent } from './imported-data-viewer/imported-data-filter.component';
import { ImportedDataViewerComponent } from './imported-data-viewer/imported-data-viewer.component';
import { ListControlsComponent } from './explorer/list-controls.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,
  ],
  declarations: [
    DataImporterComponent,
    DataTableComponent,
    DataTableControlsComponent,
    ExportReportModalComponent,
    ImportedDataFilterComponent,
    ImportedDataViewerComponent,
    ListControlsComponent,
  ],
  exports: [
    DataTableComponent,
    DataTableControlsComponent,
    ExportReportModalComponent,
    ImportedDataViewerComponent,
    ListControlsComponent,
  ]
})
export class ReportsControlsModule { }
