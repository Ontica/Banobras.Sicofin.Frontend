/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES_LIBRARY } from '@app/workspaces/main-layout';

import {
  BalanceGenerationMainPageComponent
} from './balance-generation-main-page/balance-generation-main-page.component';

import { ControlPanelMainPageComponent } from './control-panel-main-page/control-panel-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES_LIBRARY.administracion_panel_de_control.permission },
    path: ROUTES_LIBRARY.administracion_panel_de_control.path,
    component: ControlPanelMainPageComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.administracion_generacion_de_saldos.permission },
    path: ROUTES_LIBRARY.administracion_generacion_de_saldos.path,
    component: BalanceGenerationMainPageComponent,
  },
  {
    path: '',
    redirectTo: ROUTES_LIBRARY.administracion_panel_de_control.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemManagementWorkspaceRoutingModule { }
