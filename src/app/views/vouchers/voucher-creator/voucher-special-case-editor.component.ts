/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { EventInfo } from '@app/core';

import { VoucherSpecialCaseType } from '@app/models';

import { FormHandler, sendEvent } from '@app/shared/utils';

export enum VoucherSpecialCaseEditorEventType {
  FIELDS_CHANGED = 'VoucherSpecialCaseEditorComponent.Event.FieldsChanged',
}

enum VoucherSpecialCaseEditorFormControls {
  calculationDate = 'calculationDate',
  onVoucherNumber = 'onVoucherNumber',
}

@Component({
  selector: 'emp-fa-voucher-special-case-editor',
  templateUrl: './voucher-special-case-editor.component.html',
})
export class VoucherSpecialCaseEditorComponent implements OnChanges {

  @Input() voucherSpecialCaseType: VoucherSpecialCaseType;

  @Output() voucherSpecialCaseEditorEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;

  controls = VoucherSpecialCaseEditorFormControls;

  constructor() {
    this.initForm();
  }


  ngOnChanges() {
    this.formHandler.form.reset();
    this.validateRequiredFormFields();
  }


  invalidateForm() {
    this.formHandler.invalidateForm();
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new UntypedFormGroup({
        calculationDate: new UntypedFormControl('', Validators.required),
        onVoucherNumber: new UntypedFormControl('', Validators.required),
      })
    );

    this.formHandler.form.valueChanges.subscribe(v => this.emitChanges());
  }


  private validateRequiredFormFields() {
    if (this.voucherSpecialCaseType?.askForCalculationDateField) {
      this.formHandler.setControlValidators(this.controls.calculationDate, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.calculationDate);
    }

    if (this.voucherSpecialCaseType?.askForVoucherNumberField) {
      this.formHandler.setControlValidators(this.controls.onVoucherNumber, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.onVoucherNumber);
    }
  }


  private emitChanges() {
    const payload = {
      isFormValid: this.formHandler.form.valid,
      voucherSpecialCase: this.getFormData(),
    };

    setTimeout(() => {
      sendEvent(this.voucherSpecialCaseEditorEvent,
        VoucherSpecialCaseEditorEventType.FIELDS_CHANGED, payload);
    });
  }


  private getFormData() {
    const formModel = this.formHandler.form.getRawValue();

    const data = {
      calculationDate: formModel.calculationDate ?? null,
      onVoucherNumber: formModel.onVoucherNumber ?? '',
    };

    return data;
  }

}
