/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Directive } from '@angular/core';

import { NG_VALIDATORS } from '@angular/forms';

import { Validate } from '@app/core';

@Directive({
  selector: '[empNgPeriodRequired][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useValue: Validate.periodRequired(),
      multi: true,
    }
  ]
})
export class PeriodRequiredValidatorDirective { }
