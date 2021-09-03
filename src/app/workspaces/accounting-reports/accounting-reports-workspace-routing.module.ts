/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES_LIBRARY } from '@app/models';

import { AccountingReportsWorkspaceComponent } from './accounting-reports-workspace.component';


const routes: Routes = [
  {
    data: { permission: ROUTES_LIBRARY.reportes_regulatorios.permission },
    path: ROUTES_LIBRARY.reportes_regulatorios.path,
    component: AccountingReportsWorkspaceComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.reportes_operativos.permission },
    path: ROUTES_LIBRARY.reportes_operativos.path,
    component: AccountingReportsWorkspaceComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.reportes_financieros.permission },
    path: ROUTES_LIBRARY.reportes_financieros.path,
    component: AccountingReportsWorkspaceComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.reportes_todos.permission },
    path: ROUTES_LIBRARY.reportes_todos.path,
    component: AccountingReportsWorkspaceComponent,
  },
  {
    path: '',
    redirectTo: ROUTES_LIBRARY.reportes_regulatorios.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingReportsWorkspaceRoutingModule { }
