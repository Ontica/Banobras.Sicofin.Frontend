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
import { SecurityUIRoutingModule } from './security-ui-routing.module';
import { UserLoginComponent } from './user-login/user-login.component';


@NgModule({

  imports: [
    CommonModule,
    ReactiveFormsModule,

    SecurityUIRoutingModule,
    AngularMaterialModule,
  ],

  declarations: [
    UserLoginComponent,
  ],

  exports: []

})
export class SecurityUIModule { }
