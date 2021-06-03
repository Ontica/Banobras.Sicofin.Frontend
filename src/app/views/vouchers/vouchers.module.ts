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

import { VoucherFilterComponent } from './voucher-filter/voucher-filter.component';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { VoucherListItemComponent } from './voucher-list/voucher-list-item.component';
import { VouchersExplorerComponent } from './vouchers-explorer/vouchers-explorer.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,
  ],
  declarations: [
    VoucherFilterComponent,
    VoucherListComponent,
    VoucherListItemComponent,
    VouchersExplorerComponent,
  ],
  exports: [
    VouchersExplorerComponent,
  ]
})
export class VouchersModule { }
