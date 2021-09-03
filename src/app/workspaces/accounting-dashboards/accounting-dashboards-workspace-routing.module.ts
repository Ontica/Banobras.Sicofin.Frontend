/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES_LIBRARY } from '@app/models';

import { AccountingDashboardsWorkspaceComponent } from './accounting-dashboards-workspace.component';

import { TrialBalanceMainPageComponent } from './trial-balance-main-page/trial-balance-main-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES_LIBRARY.tableros_saldos_y_balanzas.permission },
    path: ROUTES_LIBRARY.tableros_saldos_y_balanzas.path,
    component: TrialBalanceMainPageComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.tableros_calculo_de_agrupaciones.permission },
    path: ROUTES_LIBRARY.tableros_calculo_de_agrupaciones.path,
    component: AccountingDashboardsWorkspaceComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.tableros_indicadores_financieros.permission },
    path: ROUTES_LIBRARY.tableros_indicadores_financieros.path,
    component: AccountingDashboardsWorkspaceComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.tableros_alertas.permission },
    path: ROUTES_LIBRARY.tableros_alertas.path,
    component: AccountingDashboardsWorkspaceComponent,
  },
  {
    path: '',
    redirectTo: ROUTES_LIBRARY.tableros_saldos_y_balanzas.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingDashboardsWorkspaceRoutingModule { }
