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

import {
  StoredBalanceSetsTableComponent
} from './stored-balance-sets-table/stored-balance-sets-table.component';
import {
  StoredBalanceSetTabbedViewComponent
} from './stored-balance-set-tabbed-view/stored-balance-set-tabbed-view.component';


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
    StoredBalanceSetsTableComponent,
    StoredBalanceSetTabbedViewComponent,
  ],
  exports: [
    StoredBalanceSetsTableComponent,
    StoredBalanceSetTabbedViewComponent,
  ],
})
export class BalancesGenerationModule { }
