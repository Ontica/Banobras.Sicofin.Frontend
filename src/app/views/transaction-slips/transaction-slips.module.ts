/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';
import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { SharedModule } from '@app/shared/shared.module';

import { ReportsControlsModule } from '../reports-controls/reports-controls.module';

import { TransactionSlipsExplorerComponent } from './transaction-slips-explorer/transaction-slips-explorer.component';
import { TransactionSlipsFilterComponent } from './transaction-slips-explorer/transaction-slips-filter.component';
import { TransactionSlipsListComponent } from './transaction-slips-explorer/transaction-slips-list.component';
import { TransactionSlipsListItemComponent } from './transaction-slips-explorer/transaction-slips-list-item.component';


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
    TransactionSlipsExplorerComponent,
    TransactionSlipsFilterComponent,
    TransactionSlipsListComponent,
    TransactionSlipsListItemComponent,
  ],
  exports: [
    TransactionSlipsExplorerComponent,
  ]
})
export class TransactionSlipsModule { }
