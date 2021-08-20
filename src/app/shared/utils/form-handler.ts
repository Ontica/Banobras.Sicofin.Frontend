/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { FormGroup } from '@angular/forms';


export class FormHandler {

  form: FormGroup;

  constructor(formGroup: FormGroup) {
    this.form = formGroup;
  }

  get isValid() {
    return this.form.valid && this.form.dirty;
  }

  get isReadyForSubmit() {
    return this.isValid;
  }

  getControl(name: string) {
    return this.form.get(name);
  }

  setFormModel(values: any) {
    this.form.reset(values);
  }

  showInvalidControl(name: string) {
    return this.getControl(name).touched &&
           this.getControl(name).enabled &&
           this.getControl(name).invalid;
  }

  validateReadyForSubmit() {
    if (!this.isReadyForSubmit) {
      this.invalidateForm();
    }
    return this.isReadyForSubmit;
  }

  invalidateForm() {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  resetForm() {
    this.form.reset();
  }

  disableForm(disable: boolean = true) {
    if (disable) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  disableControl(name: string, disable: boolean = true) {
    if (disable) {
      this.getControl(name).disable();
    } else {
      this.getControl(name).enable();
    }
  }

  setControlValidators(name: string, validator: any | any[]) {
    this.getControl(name).clearValidators();
    this.getControl(name).setValidators(validator);
    this.getControl(name).updateValueAndValidity();
  }

  clearControlValidators(name: string) {
    this.getControl(name).clearValidators();
    this.getControl(name).updateValueAndValidity();
  }

}
