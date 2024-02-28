/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@app/shared/angular-material.module';
import { AngularFlexLayoutModule } from '@app/shared/angular-flex-layout.module';
import { SharedModule } from '@app/shared/shared.module';

import { UserLoginComponent } from './user-login/user-login.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ChangePasswordFormComponent } from './change-password/change-password-form.component';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AngularMaterialModule,
    AngularFlexLayoutModule,
    SharedModule,

    AngularMaterialModule,
  ],

  declarations: [
    UserLoginComponent,
    UnauthorizedComponent,
    ChangePasswordFormComponent,
  ],

  exports: [
    UserLoginComponent,
    UnauthorizedComponent,
    ChangePasswordFormComponent,
  ]

})
export class SecurityModule { }
