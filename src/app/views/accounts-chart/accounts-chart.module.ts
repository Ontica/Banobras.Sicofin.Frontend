
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

import { AccountEditionConfigComponent } from './account-edition/account-edition-config.component';
import { AccountEditionWizardComponent } from './account-edition/account-edition-wizard.component';
import { AccountHeaderComponent } from './account-edition/account-header.component';
import { AccountItemsTableComponent } from './account-edition/account-items-table.component';
import { AccountsChartControlsComponent } from './accounts-chart-explorer/accounts-chart-controls.component';
import { AccountsChartExplorerComponent } from './accounts-chart-explorer/accounts-chart-explorer.component';
import { AccountsChartFilterComponent } from './accounts-chart-explorer/accounts-chart-filter.component';
import { AccountsChartListComponent } from './accounts-chart-explorer/accounts-chart-list.component';
import { AccountsChartListEntryComponent } from './accounts-chart-explorer/accounts-chart-list-entry.component';
import { AccountsImporterComponent } from './accounts-importer/accounts-importer.component';
import { AccountsImporterDetailsTableComponent } from './accounts-importer/importer-details-table.component';
import { AccountTabbedViewComponent } from './account-tabbed-view/account-tabbed-view.component';
import { AccountViewComponent } from './account-tabbed-view/account-view.component';


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
    AccountEditionConfigComponent,
    AccountEditionWizardComponent,
    AccountHeaderComponent,
    AccountItemsTableComponent,
    AccountsChartControlsComponent,
    AccountsChartExplorerComponent,
    AccountsChartFilterComponent,
    AccountsChartListComponent,
    AccountsChartListEntryComponent,
    AccountsImporterComponent,
    AccountsImporterDetailsTableComponent,
    AccountTabbedViewComponent,
    AccountViewComponent,
  ],
  exports: [
    AccountsChartExplorerComponent,
    AccountTabbedViewComponent,
  ]
})
export class AccountsChartModule { }
