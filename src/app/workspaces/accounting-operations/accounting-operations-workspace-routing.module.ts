/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES_LIBRARY } from '@app/models';

import { AccountingOperationsWorkspaceComponent } from './accounting-operations-workspace.component';


const routes: Routes = [
  {
    data: { permission: ROUTES_LIBRARY.operacion_contable_mis_volantes_pendientes.permission },
    path: ROUTES_LIBRARY.operacion_contable_mis_volantes_pendientes.path,
    component: AccountingOperationsWorkspaceComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.operacion_contable_mesa_de_control.permission },
    path: ROUTES_LIBRARY.operacion_contable_mesa_de_control.path,
    component: AccountingOperationsWorkspaceComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.operacion_contable_volantes_en_libros.permission },
    path: ROUTES_LIBRARY.operacion_contable_volantes_en_libros.path,
    component: AccountingOperationsWorkspaceComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.operacion_contable_todos_los_volantes.permission },
    path: ROUTES_LIBRARY.operacion_contable_todos_los_volantes.path,
    component: AccountingOperationsWorkspaceComponent,
  },
  {
    path: '',
    redirectTo: ROUTES_LIBRARY.operacion_contable_mis_volantes_pendientes.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingOperationsWorkspaceRoutingModule { }
