/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, isEmpty, Validate } from '@app/core';

import { DateRange, EmptyExternalVariable, ExternalVariable, ExternalVariableFields } from '@app/models';

import { FormHelper, sendEvent } from '@app/shared/utils';

export enum ExternalVariableEditorEventType {
  ADD_BUTTON_CLICKED    = 'ExternalVariableEditorComponent.Event.AddButtonClicked',
  CANCEL_BUTTON_CLICKED = 'ExternalVariableEditorComponent.Event.CancelButtonClicked',
  UPDATE_BUTTON_CLICKED = 'ExternalVariableEditorComponent.Event.UpdateButtonClicked',
}

interface ExternalVariableFormModel extends FormGroup<{
  name: FormControl<string>;
  code: FormControl<string>;
  period: FormControl<DateRange>;
}> { }

@Component({
  selector: 'emp-fa-external-variable-editor',
  templateUrl: './external-variable-editor.component.html',
})
export class ExternalVariableEditorComponent implements OnChanges {

  @Input() externalVariablesSetUID = '';

  @Input() externalVariable: ExternalVariable = EmptyExternalVariable;

  @Input() canEdit = false;

  @Output() externalVariableEditorEvent = new EventEmitter<EventInfo>();

  form: ExternalVariableFormModel;

  formHelper = FormHelper;


  constructor(){
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
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
    return this.formHelper.isFormReady(this.form) &&
           !!this.form.controls.period.value.fromDate &&
           !!this.form.controls.period.value.toDate;
  }


  onAddExternalVariableClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        externalVariablesSetUID: this.externalVariablesSetUID,
        externalVariableFields: this.getFormData()
      };

      sendEvent(this.externalVariableEditorEvent,
        ExternalVariableEditorEventType.ADD_BUTTON_CLICKED, payload);
    }
  }


  onCancelEditionClicked() {
    sendEvent(this.externalVariableEditorEvent,
      ExternalVariableEditorEventType.CANCEL_BUTTON_CLICKED);
  }


  onUpdateExternalVariableClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const payload = {
        externalVariablesSetUID: this.externalVariablesSetUID,
        externalVariableUID: this.externalVariable.uid,
        externalVariableFields: this.getFormData()
      }

      sendEvent(this.externalVariableEditorEvent,
        ExternalVariableEditorEventType.UPDATE_BUTTON_CLICKED, payload);
    }
  }


  resetFormData() {
    this.form.reset();
    this.validateCanEdit();
  }


  private validateCanEdit() {
    if (this.canEdit) {
      this.formHelper.setDisableForm(this.form, false);
    } else {
      this.form.reset();
      this.formHelper.setDisableForm(this.form, true);
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      code: [null as string, Validators.required],
      name: ['', Validators.required],
      period: [null as DateRange, [Validators.required, Validate.periodRequired]],
    });

    this.form.disable()
  }



  private setFormData() {
    this.form.reset({
      code: this.externalVariable.code,
      name: this.externalVariable.name,
      period: {fromDate: this.externalVariable.startDate, toDate: this.externalVariable.endDate},
    });
  }


  private getFormData(): ExternalVariableFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: ExternalVariableFields = {
      code: formModel.code ?? '',
      name: formModel.name ?? '',
      startDate: formModel.period?.fromDate ?? '',
      endDate: formModel.period?.toDate ?? '',
    };

    return data;
  }

}
