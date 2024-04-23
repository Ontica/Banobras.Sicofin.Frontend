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
import { VouchersModule } from '../vouchers/vouchers.module';

import { TransactionSlipEntryTableComponent } from './transaction-slip-tabbed-view/transaction-slip-entry-table.component';
import { TransactionSlipIssuesTableComponent } from './transaction-slip-tabbed-view/transaction-slip-issues-table.component';
import { TransactionSlipsExplorerComponent } from './transaction-slips-explorer/transaction-slips-explorer.component';
import { TransactionSlipsFilterComponent } from './transaction-slips-explorer/transaction-slips-filter.component';
import { TransactionSlipsListComponent } from './transaction-slips-explorer/transaction-slips-list.component';
import { TransactionSlipsListItemComponent } from './transaction-slips-explorer/transaction-slips-list-item.component';
import { TransactionSlipTabbedViewComponent } from './transaction-slip-tabbed-view/transaction-slip-tabbed-view.component';
import { TransactionSlipViewComponent } from './transaction-slip-tabbed-view/transaction-slip-view.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,

    ReportsControlsModule,
    VouchersModule,
  ],
  declarations: [
    TransactionSlipEntryTableComponent,
    TransactionSlipIssuesTableComponent,
    TransactionSlipsExplorerComponent,
    TransactionSlipsFilterComponent,
    TransactionSlipsListComponent,
    TransactionSlipsListItemComponent,
    TransactionSlipTabbedViewComponent,
    TransactionSlipViewComponent,
  ],
  exports: [
    TransactionSlipsExplorerComponent,
    TransactionSlipTabbedViewComponent,
  ]
})
export class TransactionSlipsModule { }
