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
import { ResizableDirective } from './resizable.directive';
import { BreakpointDirective } from './notebook-breakpoint.directive';
import { NotebookBreakPointsProvider } from './notebook-breakpoint';
import { EmpContextMenuDisabledDirective } from './context-menu-disabled.directive';


@NgModule({

  imports: [
    CommonModule,
  ],

  declarations: [
    BreakpointDirective,
    EmpContextMenuDisabledDirective,
    EmpCurrencyDirective,
    EmpIntegerDirective,
    EmpNumerationDirective,
    EmpTextareaAutoresizeDirective,
    HasPermissionDirective,
    ResizableDirective,
  ],

  exports: [
    BreakpointDirective,
    EmpContextMenuDisabledDirective,
    EmpCurrencyDirective,
    EmpIntegerDirective,
    EmpNumerationDirective,
    EmpTextareaAutoresizeDirective,
    HasPermissionDirective,
    ResizableDirective,
  ],

  providers: [
    NotebookBreakPointsProvider,
  ],

})
export class SharedDirectivesModule { }
