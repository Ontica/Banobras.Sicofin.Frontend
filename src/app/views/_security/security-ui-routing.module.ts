/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ROUTES } from '@app/main-layout';

import { UserLoginComponent } from './user-login/user-login.component';


const routes: Routes = [
  {
    path: ROUTES.security_login.path,
    component: UserLoginComponent,
  },
  {
    path: '',
    redirectTo: ROUTES.security_login.path,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityUIRoutingModule { }
