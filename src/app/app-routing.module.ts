/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { ChildRouteGuard, ParentRouteGuard } from './core';

import { DEFAULT_PATH, LOGIN_PATH, MainLayoutComponent, NoContentComponent, OLD_LOGIN_PATH,
         ROUTES } from '@app/main-layout';

const routes: Routes = [
  {
    data: { permission: ROUTES.operacion_contable.permission },
    path: ROUTES.operacion_contable.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/accounting-operations/accounting-operations-workspace.module')
                              .then((m) => m.AccountingOperationsWorkspaceModule)
  },
  {
    data: { permission: ROUTES.tableros.permission },
    path: ROUTES.tableros.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/accounting-dashboards/accounting-dashboards-workspace.module')
                              .then((m) => m.AccountingDashboardsWorkspaceModule)
  },
  {
    data: { permission: ROUTES.reglas_y_catalogos.permission },
    path: ROUTES.reglas_y_catalogos.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/accounting-catalogues-and-rules/accounting-catalogues-and-rules-workspace.module')
                               .then((m) => m.AccountingCataloguesAndRulesWorkplaceModule)
  },
  {
    data: { permission: ROUTES.administracion.permission },
    path: ROUTES.administracion.path,
    component: MainLayoutComponent,
    canActivate: [ParentRouteGuard],
    canActivateChild: [ChildRouteGuard],
    loadChildren: () => import('./workspaces/system-management/system-management-workspace.module')
                             .then((m) => m.SystemManagementWorkspaceModule)
  },
  {
    path: ROUTES.unauthorized.path,
    canActivate: [ParentRouteGuard],
    component: MainLayoutComponent,
    loadChildren: () => import('./workspaces/_system-security/unauthorized.module')
                              .then(m => m.UnauthorizedModule)
  },
  {
    path: ROUTES.security.path,
    loadChildren: () => import('./workspaces/_system-security/authentication.module')
                              .then(m => m.AuthenticationModule)
  },
  { path: '', redirectTo: DEFAULT_PATH, pathMatch: 'full' },
  { path: OLD_LOGIN_PATH, redirectTo: LOGIN_PATH },
  { path: '**', component: NoContentComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
