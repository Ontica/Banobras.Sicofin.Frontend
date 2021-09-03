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
  AccountingCataloguesAndRulesWorkspaceComponent
} from './accounting-catalogues-and-rules-workspace.component';

import {
  AccountsChartMainPageComponent
} from './accounts-chart-main-page/accounts-chart-main-page.component';


const routes: Routes = [
  {
    data: { permission: ROUTES_LIBRARY.reglas_y_catalogos_catalogos_de_cuentas.permission },
    path: ROUTES_LIBRARY.reglas_y_catalogos_catalogos_de_cuentas.path,
    component: AccountsChartMainPageComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.reglas_y_catalogos_reglas_contabilizadoras.permission },
    path: ROUTES_LIBRARY.reglas_y_catalogos_reglas_contabilizadoras.path,
    component: AccountingCataloguesAndRulesWorkspaceComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.reglas_y_catalogos_agrupaciones.permission },
    path: ROUTES_LIBRARY.reglas_y_catalogos_agrupaciones.path,
    component: AccountingCataloguesAndRulesWorkspaceComponent,
  },
  {
    data: { permission: ROUTES_LIBRARY.reglas_y_catalogos_disenador_de_reportes.permission },
    path: ROUTES_LIBRARY.reglas_y_catalogos_disenador_de_reportes.path,
    component: AccountingCataloguesAndRulesWorkspaceComponent,
  },
  {
    path: '',
    redirectTo: ROUTES_LIBRARY.reglas_y_catalogos_catalogos_de_cuentas.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingCataloguesAndRulesWorkspaceRoutingModule { }
