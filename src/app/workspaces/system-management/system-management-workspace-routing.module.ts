/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES_LIBRARY } from '@app/models';

import { SystemManagementWorkspaceComponent } from './system-management-workspace.component';


const routes: Routes = [
  {
    data: { permission: ROUTES_LIBRARY.administracion_generacion_de_saldos.permission },
    path: ROUTES_LIBRARY.administracion_generacion_de_saldos.path,
    component: SystemManagementWorkspaceComponent,
  },
  {
    path: '',
    redirectTo: ROUTES_LIBRARY.administracion_generacion_de_saldos.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemManagementWorkspaceRoutingModule { }
