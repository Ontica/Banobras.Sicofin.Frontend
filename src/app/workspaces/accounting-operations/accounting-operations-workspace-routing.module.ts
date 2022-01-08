/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES_LIBRARY } from '@app/models';

import {
  TransactionSlipsMainPageComponent
} from './transaction-slips-main-page/transaction-slips-main-page.component';

import { VouchersMainPageComponent } from './vouchers-main-page/vouchers-main-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES_LIBRARY.operacion_contable_mis_polizas_pendientes.permission },
    path: ROUTES_LIBRARY.operacion_contable_mis_polizas_pendientes.path,
    component: VouchersMainPageComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.operacion_contable_mesa_de_control.permission },
    path: ROUTES_LIBRARY.operacion_contable_mesa_de_control.path,
    component: VouchersMainPageComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.operacion_contable_polizas_en_libros.permission },
    path: ROUTES_LIBRARY.operacion_contable_polizas_en_libros.path,
    component: VouchersMainPageComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.operacion_contable_todos_los_polizas.permission },
    path: ROUTES_LIBRARY.operacion_contable_todos_los_polizas.path,
    component: VouchersMainPageComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.operacion_contable_volantes.permission },
    path: ROUTES_LIBRARY.operacion_contable_volantes.path,
    component: TransactionSlipsMainPageComponent,
  },
  {
    path: '',
    redirectTo: ROUTES_LIBRARY.operacion_contable_mis_polizas_pendientes.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingOperationsWorkspaceRoutingModule { }
