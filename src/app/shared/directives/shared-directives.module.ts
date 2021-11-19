/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpCurrencyDirective } from './currency.directive';
import { EmpIntegerDirective } from './integer.directive';
import { EmpNumerationDirective } from './numeration.directive';
import { EmpTextareaAutoresizeDirective } from './text-area-autoresize.directive';
import { HasPermissionDirective } from './has-permission.directive';
import { PeriodRequiredValidatorDirective } from './period-required-validator.directive';
import { ResizableDirective } from './resizable.directive';


@NgModule({

  imports: [
    CommonModule,
  ],

  declarations: [
    EmpCurrencyDirective,
    EmpIntegerDirective,
    EmpNumerationDirective,
    EmpTextareaAutoresizeDirective,
    HasPermissionDirective,
    PeriodRequiredValidatorDirective,
    ResizableDirective,
  ],

  exports: [
    EmpCurrencyDirective,
    EmpIntegerDirective,
    EmpNumerationDirective,
    EmpTextareaAutoresizeDirective,
    HasPermissionDirective,
    PeriodRequiredValidatorDirective,
    ResizableDirective,
  ],

})
export class SharedDirectivesModule { }
