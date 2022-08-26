/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive } from '@angular/core';

import { ShowHideDirective } from '@angular/flex-layout';

const selector = `[fxHide.notebook]`;

const inputs = ['fxHide.notebook'];

// eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
@Directive({selector, inputs})
export class EmpBreakpointDirective extends ShowHideDirective {
  protected inputs = inputs;
}
