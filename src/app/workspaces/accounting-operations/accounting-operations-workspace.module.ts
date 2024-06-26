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

import { ReportsControlsModule } from '@app/views/_reports-controls/reports-controls.module';
import { TransactionSlipsModule } from '@app/views/transaction-slips/transaction-slips.module';
import { VouchersModule } from '@app/views/vouchers/vouchers.module';

import { AccountingOperationsWorkspaceRoutingModule } from './accounting-operations-workspace-routing.module';

import {
  TransactionSlipsMainPageComponent
} from './transaction-slips-main-page/transaction-slips-main-page.component';

import { VouchersMainPageComponent } from './vouchers-main-page/vouchers-main-page.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    SharedModule,

    AccountingOperationsWorkspaceRoutingModule,
    ReportsControlsModule,
    TransactionSlipsModule,
    VouchersModule,
  ],

  declarations: [
    TransactionSlipsMainPageComponent,
    VouchersMainPageComponent,
  ],

})
export class AccountingOperationsWorkspaceModule { }
