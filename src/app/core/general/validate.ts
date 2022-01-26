/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AbstractControl, ValidationErrors } from '@angular/forms';

import { FormatLibrary } from '@app/shared/utils';


export class Validate {

  static hasValue(object: any): boolean {
    if (object === null) {
      return false;
    }
    if (typeof object === 'undefined') {
      return false;
    }
    if (object === {}) {
      return false;
    }
    if (typeof object === 'string' && object === '') {
      return false;
    }
    return true;
  }


  static isEmail(value: string): boolean {
    if (!this.hasValue(value)) {
      return false;
    }
    const regularExpresion = new RegExp(/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/);
    const test = regularExpresion.test(value);
    return test;
  }


  static isTrue(value: boolean): boolean {
    return value === true;
  }


  static notNull(value: any): boolean {
    if ((value === null) || (typeof value === 'undefined') || value === {}) {
      return false;
    }
    return true;
  }


  static isPositive(control: AbstractControl): ValidationErrors | null {
    if (typeof control.value === 'string' && FormatLibrary.stringToNumber(control.value) <= 0 ) {
      return { isPositive: true };
    }
    if (typeof control.value === 'number' && control.value <= 0 ) {
      return { isPositive: true };
    }
    return null;
  }


  static maxCurrencyValue(max: number): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && ( FormatLibrary.stringToNumber(control.value) > max )) {
        return { maxCurrencyValue: true };
      }
      return null;
    };
  }


  static minCurrencyValue(min: number): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && ( FormatLibrary.stringToNumber(control.value) < min )) {
        return { minCurrencyValue: true };
      }
      return null;
    };
  }


  static periodRequired(control: AbstractControl,
                        periodValidationType: 'both-dates' | 'one-date' | 'start-date' | 'end-date' = 'both-dates',
                        startDateLabel: string = 'fromDate',
                        endDateLabel: string = 'toDate'): ValidationErrors | null {
    let periodRequired = false;

    if (control.value) {
      const hasStartDate = !!control.value[startDateLabel];
      const hasEndDate = !!control.value[endDateLabel];

      switch (periodValidationType) {
        case 'one-date':
          periodRequired = !hasStartDate && !hasEndDate;
          break;
        case 'start-date':
          periodRequired = !hasStartDate;
          break;
        case 'end-date':
          periodRequired = !hasEndDate;
          break;
        case 'both-dates':
        default:
          periodRequired = !hasStartDate || !hasEndDate;
          break;
      }
    }
    return periodRequired ? { periodRequired } : null;
  }

}
