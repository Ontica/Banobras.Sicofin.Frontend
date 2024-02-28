/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@app/shared/angular-material.module';

import { UserLoginComponent } from './user-login/user-login.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';


@NgModule({

  imports: [
    CommonModule,
    ReactiveFormsModule,

    AngularMaterialModule,
  ],

  declarations: [
    UserLoginComponent,
    UnauthorizedComponent,
  ],

  exports: [
    UserLoginComponent,
    UnauthorizedComponent,
  ]

})
export class SecurityModule { }
