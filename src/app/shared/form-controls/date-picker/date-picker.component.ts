/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import {
  Component, EventEmitter,
  Input, Output, forwardRef
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateString, DateStringLibrary } from '@app/core/data-types/date-string-library';

import { isMoment } from 'moment';


@Component({
  selector: 'emp-ng-datepicker',
  templateUrl: 'date-picker.component.html',
  styleUrls: ['date-picker.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent), multi: true },
  ]
})
export class DatePickerComponent implements ControlValueAccessor {

  @Output() valueChange = new EventEmitter<DateString>();

  @Input()
  get value(): DateString { return this.date; }
  set value(value: DateString) {
    this.writeValue(value);
  }

  @Input() showError = false;

  disabled = false;
  date: Date;

  propagateChange = (_: any) => { };
  propagateTouch = () => { };


  onChange(value: any) {
    if (value) {
      const date = this.getDateInputValue(value);

      this.setDateAndPropagateChanges(date);
    } else {
      this.setDateAndPropagateChanges(null);
    }
  }


  onInputChange(value: string) {
    if (value) {
      const date = this.getDateInputValue(value);

      this.setDateAndPropagateChanges(date);
    } else {
      this.setDateAndPropagateChanges(null);
    }
  }


  onBlur() {
    this.propagateTouch();
  }


  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }


  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }


  setDisabledState?(isDisabled: boolean): void {
    if (this.disabled === isDisabled) {
      return;
    }
    this.disabled = isDisabled;
  }


  writeValue(obj: any): void {
    if (obj) {
      this.date = this.getDateInputValue(obj);
      if (!this.date) {
        console.log(`Invalid date value received in calendar component: '${obj}'.`);
      }
    } else {
      this.date = null;
    }
  }


  // private methods


  private getDateInputValue(obj: any): Date {
    if (!obj) {
      return null;
    }

    let date: Date;
    if (isMoment(obj)) {
      date = DateStringLibrary.toDate(obj.toDate());
    } else {
      date = DateStringLibrary.toDate(obj);
    }

    if (date) {
      return date;
    } else {
      return null;
    }
  }


  private setDateAndPropagateChanges(value: Date) {
    if (value && DateStringLibrary.compareDates(this.date, value) === 0) {
      return;
    }

    this.date = value;

    const emittedValue = DateStringLibrary.datePart(this.date);

    this.valueChange.emit(emittedValue);
    this.propagateChange(emittedValue);
  }

}
