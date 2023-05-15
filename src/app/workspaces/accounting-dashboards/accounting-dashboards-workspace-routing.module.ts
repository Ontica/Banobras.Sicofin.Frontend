/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES } from '@app/main-layout';

import {
  BalanceReconciliationMainPageComponent
} from './balance-reconciliation-main-page/balance-reconciliation-main-page.component';

import { TrialBalanceMainPageComponent } from './trial-balance-main-page/trial-balance-main-page.component';

import { ReportBuilderComponent } from '@app/views/reporting/report-builder/report-builder.component';


const routes: Routes = [
  {
    data: { permission: ROUTES.tableros_saldos_y_balanzas.permission },
    path: ROUTES.tableros_saldos_y_balanzas.path,
    component: TrialBalanceMainPageComponent,
  },
  {
    data: { permission: ROUTES.tableros_reportes_regulatorios.permission },
    path: ROUTES.tableros_reportes_regulatorios.path,
    component: ReportBuilderComponent,
  },
  {
    data: { permission: ROUTES.tableros_reportes_operativos.permission },
    path: ROUTES.tableros_reportes_operativos.path,
    component: ReportBuilderComponent,
  },
  {
    data: { permission: ROUTES.tableros_reportes_fiscales.permission },
    path: ROUTES.tableros_reportes_fiscales.path,
    component: ReportBuilderComponent,
  },
  {
    data: { permission: ROUTES.tableros_conciliaciones.permission },
    path: ROUTES.tableros_conciliaciones.path,
    component: BalanceReconciliationMainPageComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.tableros_saldos_y_balanzas.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingDashboardsWorkspaceRoutingModule { }
