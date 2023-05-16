/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, isEmpty, Validate } from '@app/core';

import { EmptyExternalVariable, ExternalVariable, ExternalVariableFields } from '@app/models';

import { FormHandler, sendEvent } from '@app/shared/utils';

export enum ExternalVariableEditorEventType {
  ADD_BUTTON_CLICKED    = 'ExternalVariableEditorComponent.Event.AddButtonClicked',
  CANCEL_BUTTON_CLICKED = 'ExternalVariableEditorComponent.Event.CancelButtonClicked',
  UPDATE_BUTTON_CLICKED = 'ExternalVariableEditorComponent.Event.UpdateButtonClicked',
}

enum ExternalVariableEditorFormControls {
  name = 'name',
  code = 'code',
  period = 'period',
}

@Component({
  selector: 'emp-fa-external-variable-editor',
  templateUrl: './external-variable-editor.component.html',
})
export class ExternalVariableEditorComponent implements OnChanges {

  @Input() externalVariablesSetUID = '';

  @Input() externalVariable: ExternalVariable = EmptyExternalVariable;

  @Input() canEdit = false;

  @Output() externalVariableEditorEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;

  controls = ExternalVariableEditorFormControls;


  constructor(){
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.canEdit) {
      this.validateCanEdit();
    }

    if (changes.externalVariable) {
      this.setFormData();
    }
  }


  get isSaved(): boolean {
    return !isEmpty(this.externalVariable);
  }


  get isFormValid(): boolean {
    return this.formHandler.isValid &&
           !!this.formHandler.getControl(this.controls.period).value.fromDate &&
           !!this.formHandler.getControl(this.controls.period).value.toDate;
  }


  onAddExternalVariableClicked() {
    if (!this.isFormValid) {
      this.formHandler.invalidateForm();
      return;
    }

    const payload = {
      externalVariablesSetUID: this.externalVariablesSetUID,
      externalVariableFields: this.getFormData()
    }

    sendEvent(this.externalVariableEditorEvent,
      ExternalVariableEditorEventType.ADD_BUTTON_CLICKED, payload);
  }


  onCancelEditionClicked() {
    sendEvent(this.externalVariableEditorEvent,
      ExternalVariableEditorEventType.CANCEL_BUTTON_CLICKED);
  }


  onUpdateExternalVariableClicked() {
    if (!this.isFormValid) {
      this.formHandler.invalidateForm();
      return;
    }

    const payload = {
      externalVariablesSetUID: this.externalVariablesSetUID,
      externalVariableUID: this.externalVariable.uid,
      externalVariableFields: this.getFormData()
    }

    sendEvent(this.externalVariableEditorEvent,
      ExternalVariableEditorEventType.UPDATE_BUTTON_CLICKED, payload);
  }


  resetFormData() {
    this.formHandler.resetForm();
    this.validateCanEdit();
  }


  private validateCanEdit() {
    if (this.canEdit) {
      this.formHandler.disableForm(false);
    } else {
      this.formHandler.resetForm();
      this.formHandler.disableForm(true);
    }
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new UntypedFormGroup({
        code: new UntypedFormControl(null, Validators.required),
        name: new UntypedFormControl('', Validators.required),
        period: new UntypedFormControl(null, [Validators.required, Validate.periodRequired]),
      })
    );

    this.formHandler.disableForm(true);
  }



  private setFormData() {
    this.formHandler.form.reset({
      code: this.externalVariable.code,
      name: this.externalVariable.name,
      period: {fromDate: this.externalVariable.startDate, toDate: this.externalVariable.endDate},
    });
  }


  private getFormData(): ExternalVariableFields {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: ExternalVariableFields = {
      code: formModel.code ?? '',
      name: formModel.name ?? '',
      startDate: formModel.period?.fromDate ?? '',
      endDate: formModel.period?.toDate ?? '',
    };

    return data;
  }

}
