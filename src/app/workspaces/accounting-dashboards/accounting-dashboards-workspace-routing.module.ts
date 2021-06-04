/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { AccountingDashboardsWorkspaceComponent } from './accounting-dashboards-workspace.component';

import { TrialBalanceMainPageComponent } from './trial-balance-main-page/trial-balance-main-page.component';


const routes: Routes = [
  { path: 'saldos-y-balanzas', component: TrialBalanceMainPageComponent },
  { path: 'calculo-de-agrupaciones', component: AccountingDashboardsWorkspaceComponent },
  { path: 'indicadores-financieros', component: AccountingDashboardsWorkspaceComponent },
  { path: 'alertas', component: AccountingDashboardsWorkspaceComponent },
  { path: '', redirectTo: 'saldos-y-balanzas', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingDashboardsWorkspaceRoutingModule { }
