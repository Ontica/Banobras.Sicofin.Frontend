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

import { VoucherCreatorComponent } from './voucher-creator/voucher-creator.component';
import { VoucherEditorComponent } from './voucher-editor/voucher-editor.component';
import { VoucherFilterComponent } from './voucher-filter/voucher-filter.component';
import { VoucherHeaderComponent } from './voucher-header/voucher-header.component';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { VoucherListItemComponent } from './voucher-list/voucher-list-item.component';
import { VouchersExplorerComponent } from './vouchers-explorer/vouchers-explorer.component';
import { VoucherTabbedViewComponent } from './voucher-tabbed-view/voucher-tabbed-view.component';


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
    VoucherCreatorComponent,
    VoucherEditorComponent,
    VoucherFilterComponent,
    VoucherHeaderComponent,
    VoucherListComponent,
    VoucherListItemComponent,
    VouchersExplorerComponent,
    VoucherTabbedViewComponent,
  ],
  exports: [
    VoucherCreatorComponent,
    VouchersExplorerComponent,
    VoucherTabbedViewComponent,
  ]
})
export class VouchersModule { }
