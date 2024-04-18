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

import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

import { FinancialConceptCreatorComponent } from './financial-concept-edition/financial-concept-creator.component';
import { FinancialConceptEditorComponent } from './financial-concept-edition/financial-concept-editor.component';
import { FinancialConceptEntriesTableComponent } from './financial-concept-integration-edition/financial-concept-entries-table.component';
import { FinancialConceptEntryEditorComponent } from './financial-concept-integration-edition/financial-concept-entry-editor.component';
import { FinancialConceptHeaderComponent } from './financial-concept-edition/financial-concept-header.component';
import { FinancialConceptIntegrationEditionComponent } from './financial-concept-integration-edition/financial-concept-integration-edition.component';
import { FinancialConceptsFilterComponent } from './financial-concepts-viewer/financial-concepts-filter.component';
import { FinancialConceptsTableComponent } from './financial-concepts-viewer/financial-concepts-table.component';
import { FinancialConceptsViewerComponent } from './financial-concepts-viewer/financial-concepts-viewer.component';
import { FinancialConceptTabbedViewComponent } from './financial-concept-tabbed-view/financial-concept-tabbed-view.component';
import { ConfirmEditionResultModalComponent } from './financial-concept-integration-edition/confirm-edition-result-modal.component';


@NgModule({
  declarations: [
    FinancialConceptCreatorComponent,
    FinancialConceptEditorComponent,
    FinancialConceptEntriesTableComponent,
    FinancialConceptEntryEditorComponent,
    FinancialConceptHeaderComponent,
    FinancialConceptIntegrationEditionComponent,
    FinancialConceptsFilterComponent,
    FinancialConceptsTableComponent,
    FinancialConceptsViewerComponent,
    FinancialConceptTabbedViewComponent,
    ConfirmEditionResultModalComponent,
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
    FinancialConceptCreatorComponent,
    FinancialConceptsViewerComponent,
    FinancialConceptTabbedViewComponent,
  ]
})
export class FinancialConceptsModule { }
