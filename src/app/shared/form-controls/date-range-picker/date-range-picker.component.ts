/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateString, DateStringLibrary } from '@app/core/data-types/date-string-library';

import * as moment from 'moment';


@Component({
  selector: 'emp-ng-date-range-picker',
  templateUrl: 'date-range-picker.component.html',
  styleUrls: ['date-range-picker.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateRangePickerComponent), multi: true },
  ]
})
export class DateRangePickerComponent implements ControlValueAccessor {

  @Input() bindValueStartDate = 'fromDate';

  @Input() bindValueEndDate = 'toDate';

  @Input() startView: 'month' | 'year' | 'multi-year' = 'year';

  @Input() showError = false;

  @Input()
  get value(): any {
    return Object.assign({}, this.completeValue, {
        [this.bindValueStartDate]: this.startDate,
        [this.bindValueEndDate]: this.endDate
      });
  }

  set value(value: any) {
    this.writeValue(value);
  }

  @Input() startDate: DateString;

  @Input() endDate: DateString;

  @Input() comparisonStartDate: DateString;

  @Input() comparisonEndDate: DateString;

  @Output() valueChange = new EventEmitter<any>();

  @Output() startDateChange = new EventEmitter<any>();

  @Output() endDateChange = new EventEmitter<any>();

  completeValue: any;

  disabled = false;

  propagateChange = (_: any) => { };

  propagateTouch = () => { };

  onInputsChange(startDateValue: string, endDateValue: string) {
    this.validateChange(startDateValue, endDateValue);
  }


  onChange(startDateValue: string, endDateValue: string) {
    this.validateChange(startDateValue, endDateValue);
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
      this.completeValue = obj;
      this.startDate = this.getDateInputValue(obj[this.bindValueStartDate]);
      this.endDate = this.getDateInputValue(obj[this.bindValueEndDate]);

      if (!this.startDate || !this.endDate) {
        console.log(`Invalid date value received in calendar component: '${obj}'.`);
      }
    } else {
      this.completeValue = null;
      this.startDate = null;
      this.endDate = null;
    }
  }


  getDateForComparison(date: DateString): any {
    return date ? moment(date) : null;
  }


  // private methods


  private getDateInputValue(obj: any): Date {
    return DateStringLibrary.validateDateValue(obj);
  }


  private validateChange(startDateValue: string, endDateValue: string) {
    if (!startDateValue && !endDateValue) {
      this.setDatesAndPropagateChanges(null, null);
    } else {
      const startDate = this.getDateInputValue(startDateValue);
      const endDate = this.getDateInputValue(endDateValue);

      this.setDatesAndPropagateChanges(startDate, endDate);
    }
  }


  private setDatesAndPropagateChanges(startDate: Date, endDate: Date) {
    if (startDate && DateStringLibrary.compareDates(this.startDate, startDate) === 0 &&
        endDate && DateStringLibrary.compareDates(this.endDate, endDate) === 0) {
      return;
    }

    this.startDate = startDate;
    this.endDate = endDate;

    const emittedStartValue = DateStringLibrary.datePart(this.startDate);
    const emittedEndValue = DateStringLibrary.datePart(this.endDate);

    const emittedValue = Object.assign({}, this.value, {
      [this.bindValueStartDate]: emittedStartValue,
      [this.bindValueEndDate]: emittedEndValue
    });

    this.valueChange.emit(emittedValue);
    this.startDateChange.emit(emittedStartValue);
    this.endDateChange.emit(emittedEndValue);
    this.propagateChange(emittedValue);
  }

}
