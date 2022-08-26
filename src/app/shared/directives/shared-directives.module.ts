/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpBreakpointDirective } from './notebook-breakpoint.directive';
import { EmpContextMenuDisabledDirective } from './context-menu-disabled.directive';
import { EmpCurrencyDirective } from './currency.directive';
import { EmpFormKeyDownEnterDirective } from './form-keydown-enter.directive';
import { EmpHasPermissionDirective } from './has-permission.directive';
import { EmpIntegerDirective } from './integer.directive';
import { EmpNumerationDirective } from './numeration.directive';
import { EmpResizableDirective } from './resizable.directive';
import { EmpTextareaAutoresizeDirective } from './text-area-autoresize.directive';

import { EmpNotebookBreakPointsProvider } from './notebook-breakpoint';


@NgModule({

  imports: [
    CommonModule,
  ],

  declarations: [
    EmpBreakpointDirective,
    EmpContextMenuDisabledDirective,
    EmpCurrencyDirective,
    EmpFormKeyDownEnterDirective,
    EmpHasPermissionDirective,
    EmpIntegerDirective,
    EmpNumerationDirective,
    EmpResizableDirective,
    EmpTextareaAutoresizeDirective,
  ],

  exports: [
    EmpBreakpointDirective,
    EmpContextMenuDisabledDirective,
    EmpCurrencyDirective,
    EmpFormKeyDownEnterDirective,
    EmpHasPermissionDirective,
    EmpIntegerDirective,
    EmpNumerationDirective,
    EmpResizableDirective,
    EmpTextareaAutoresizeDirective,
  ],

  providers: [
    EmpNotebookBreakPointsProvider,
  ],

})
export class SharedDirectivesModule { }
