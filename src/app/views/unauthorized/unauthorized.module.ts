/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { UnauthorizedComponent } from './unauthorized.component';

const routes: Routes = [
  {
    path: '',
    component: UnauthorizedComponent,
    pathMatch: 'full',
  },
];


@NgModule({

  imports: [
    RouterModule.forChild(routes),
  ],

  declarations: [
    UnauthorizedComponent,
  ],

  exports: []

})
export class UnauthorizedModule { }
