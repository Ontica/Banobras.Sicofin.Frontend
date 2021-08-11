/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecurityGuard } from './core';
import { MainLayoutComponent, NoContentComponent } from './workspaces/main-layout';

const routes: Routes = [
  { path: 'operacion-contable',
    component: MainLayoutComponent,
    canActivate: [SecurityGuard],
    loadChildren: () => import('./workspaces/accounting-operations/accounting-operations-workspace.module')
                              .then((m) => m.AccountingOperationsWorkspaceModule)
  },
  { path: 'tableros',
    component: MainLayoutComponent,
    canActivate: [SecurityGuard],
    loadChildren: () => import('./workspaces/accounting-dashboards/accounting-dashboards-workspace.module')
                              .then((m) => m.AccountingDashboardsWorkspaceModule)
  },
  { path: 'reportes',
    component: MainLayoutComponent,
    canActivate: [SecurityGuard],
    loadChildren: () => import('./workspaces/accounting-reports/accounting-reports-workspace.module')
                              .then((m) => m.AccountingReportsWorkspaceModule)
  },
  { path: 'reglas-y-catalogos',
    component: MainLayoutComponent,
    canActivate: [SecurityGuard],
    loadChildren: () => import('./workspaces/accounting-catalogues-and-rules/accounting-catalogues-and-rules-workspace.module')
                               .then((m) => m.AccountingCataloguesAndRulesWorkplaceModule)
  },
  { path: 'administracion',
    component: MainLayoutComponent,
    canActivate: [SecurityGuard],
    loadChildren: () => import('./workspaces/system-management/system-management-workspace.module')
                             .then((m) => m.SystemManagementWorkspaceModule)
  },
  { path: 'security',
    loadChildren: () => import('./views/security/security-ui.module')
                              .then(m => m.SecurityUIModule)
  },
  { path: '', redirectTo: 'operacion-contable', pathMatch: 'full' },
  { path: '**', component: NoContentComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
