/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountingDashboardsWorkspaceComponent } from './accounting-dashboards-workspace.component';


const routes: Routes = [
  { path: 'saldos', component: AccountingDashboardsWorkspaceComponent },
  { path: 'balanzas', component: AccountingDashboardsWorkspaceComponent },
  { path: 'calculo-de-agrupaciones', component: AccountingDashboardsWorkspaceComponent },
  { path: 'indicadores-financieros', component: AccountingDashboardsWorkspaceComponent },
  { path: 'alertas', component: AccountingDashboardsWorkspaceComponent },
  { path: '', redirectTo: 'saldos', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingDashboardsWorkspaceRoutingModule { }
