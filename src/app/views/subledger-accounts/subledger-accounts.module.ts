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

import { SubledgerAccountCreatorComponent } from './subledger-account-creator/subledger-account-creator.component';
import { SubledgerAccountEditorComponent } from './subledger-account-editor/subledger-account-editor.component';
import { SubledgerAccountHeaderComponent } from './subledger-account-header/subledger-account-header.component';
import { SubledgerAccountsFilterComponent } from './subledger-accounts-viewer/subledger-accounts-filter.component';
import { SubledgerAccountsViewerComponent } from './subledger-accounts-viewer/subledger-accounts-viewer.component';
import { SubledgerAccountTabbedViewComponent } from './subledger-account-tabbed-view/subledger-account-tabbed-view.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFlexLayoutModule,
    AngularMaterialModule,
    SharedModule,
    ReportsControlsModule,
  ],
  declarations: [
    SubledgerAccountCreatorComponent,
    SubledgerAccountEditorComponent,
    SubledgerAccountHeaderComponent,
    SubledgerAccountsFilterComponent,
    SubledgerAccountsViewerComponent,
    SubledgerAccountTabbedViewComponent,
  ],
  exports: [
    SubledgerAccountCreatorComponent,
    SubledgerAccountsViewerComponent,
    SubledgerAccountTabbedViewComponent,
  ],
})
export class SubledgerAccountsModule { }
