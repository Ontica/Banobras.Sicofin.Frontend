/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive } from '@angular/core';

import { ShowHideDirective } from '@angular/flex-layout';

const selector = `[fxHide.xs.notebook]`;

const inputs = ['fxHide.xs.notebook'];

@Directive({selector, inputs})
export class BreakpointDirective extends ShowHideDirective {
  protected inputs = inputs;
}
