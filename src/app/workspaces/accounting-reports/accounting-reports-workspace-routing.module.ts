/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountingReportsWorkspaceComponent } from './accounting-reports-workspace.component';


const routes: Routes = [
  { path: 'regulatorios', component: AccountingReportsWorkspaceComponent },
  { path: 'operativos', component: AccountingReportsWorkspaceComponent },
  { path: 'financieros', component: AccountingReportsWorkspaceComponent },
  { path: 'todos', component: AccountingReportsWorkspaceComponent },
  { path: '', redirectTo: 'regulatorios', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingReportsWorkspaceRoutingModule { }
