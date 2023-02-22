/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES_LIBRARY } from '@app/main-layout';

import {
  AccessControlMainPageComponent
} from './access-control-main-page/access-control-main-page.component';

import {
  BalanceGenerationMainPageComponent
} from './balance-generation-main-page/balance-generation-main-page.component';

import { ControlPanelMainPageComponent } from './control-panel-main-page/control-panel-page.component';

import {
  ExchangeRatesMainPageComponent
} from './exchange-rates-main-page/exchange-rates-main-page.component';


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
    data: { permission: ROUTES_LIBRARY.administracion_tipos_de_cambio.permission },
    path: ROUTES_LIBRARY.administracion_tipos_de_cambio.path,
    component: ExchangeRatesMainPageComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.administracion_control_de_accesos.permission },
    path: ROUTES_LIBRARY.administracion_control_de_accesos.path,
    component: AccessControlMainPageComponent,
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
