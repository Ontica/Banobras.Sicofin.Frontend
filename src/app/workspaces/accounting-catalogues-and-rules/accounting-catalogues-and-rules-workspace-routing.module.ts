/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsChartMainPageComponent } from '@app/views/accounts-chart/main-page/accounts-chart-main-page.component';

import { AccountingCataloguesAndRulesWorkspaceComponent } from './accounting-catalogues-and-rules-workspace.component';


const routes: Routes = [
  { path: 'catalogos-de-cuentas', component: AccountsChartMainPageComponent },
  { path: 'reglas-contabilizadoras', component: AccountingCataloguesAndRulesWorkspaceComponent },
  { path: 'agrupaciones', component: AccountingCataloguesAndRulesWorkspaceComponent },
  { path: 'disenador-de-reportes', component: AccountingCataloguesAndRulesWorkspaceComponent },
  { path: '', redirectTo: 'catalogos-de-cuentas', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingCataloguesAndRulesWorkspaceRoutingModule { }
