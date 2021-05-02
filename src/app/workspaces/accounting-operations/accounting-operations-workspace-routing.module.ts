/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountingOperationsWorkspaceComponent } from './accounting-operations-workspace.component';


const routes: Routes = [
  { path: 'mis-volantes-pendientes', component: AccountingOperationsWorkspaceComponent },
  { path: 'mesa-de-control', component: AccountingOperationsWorkspaceComponent },
  { path: 'volantes-en-libros', component: AccountingOperationsWorkspaceComponent },
  { path: 'todos-los-volantes', component: AccountingOperationsWorkspaceComponent },
  { path: '', redirectTo: 'mis-volantes-pendientes', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingOperationsWorkspaceRoutingModule { }
