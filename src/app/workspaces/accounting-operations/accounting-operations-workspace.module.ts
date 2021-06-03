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

import { AccountingOperationsWorkspaceComponent } from './accounting-operations-workspace.component';
import { AccountingOperationsWorkspaceRoutingModule } from './accounting-operations-workspace-routing.module';
import { VouchersModule } from '@app/views/vouchers/vouchers.module';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    AccountingOperationsWorkspaceRoutingModule,
    VouchersModule,
  ],

  declarations: [
    AccountingOperationsWorkspaceComponent
  ],

  exports: [

  ]

})
export class AccountingOperationsWorkspaceModule { }
