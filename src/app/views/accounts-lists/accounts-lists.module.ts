
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

import { ReportsControlsModule } from '../_reports-controls/reports-controls.module';

import {
  AccountListEntryCreatorComponent
} from './account-list-entry-creator/account-list-entry-creator.component';
import {
  AccountListEntryEditorComponent
} from './account-list-entry-editor/account-list-entry-editor.component';
import {
  AccountListEntryTabbedViewComponent
} from './account-list-entry-tabbed-view/account-list-entry-tabbed-view.component';
import { AccountsListsFilterComponent } from './accounts-lists-viewer/accounts-lists-filter.component';
import { AccountsListsViewerComponent } from './accounts-lists-viewer/accounts-lists-viewer.component';
import {
  ConciliacionDerivadosEntryHeaderComponent
} from './account-list-entry-edition/conciliacion-derivados-entry-header.component';
import {
  DepreciacionActivoFijoEntryHeaderComponent
} from './account-list-entry-edition/depreciacion-activo-fijo-entry-header.component';
import {
  PrestamosInterbancariosEntryHeaderComponent
} from './account-list-entry-edition/prestamos-interbancarios-entry-header.component';
import {
  SwapsCoberturaEntryHeaderComponent
} from './account-list-entry-edition/swaps-cobertura-entry-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
  ],
  declarations: [
    AccountListEntryCreatorComponent,
    AccountListEntryEditorComponent,
    AccountListEntryTabbedViewComponent,
    AccountsListsFilterComponent,
    AccountsListsViewerComponent,
    ConciliacionDerivadosEntryHeaderComponent,
    DepreciacionActivoFijoEntryHeaderComponent,
    PrestamosInterbancariosEntryHeaderComponent,
    SwapsCoberturaEntryHeaderComponent,
  ],
  exports: [
    AccountListEntryCreatorComponent,
    AccountListEntryTabbedViewComponent,
    AccountsListsViewerComponent,
  ]
})
export class AccountsListsModule { }
