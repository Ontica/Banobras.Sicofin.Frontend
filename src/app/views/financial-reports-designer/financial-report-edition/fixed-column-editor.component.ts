/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, EventInfo, Identifiable } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { EmptyFinancialReportColumn, EmptyFinancialReportConfig, FinancialReportColumn,
         FinancialReportColumnEditionItemTypeList, FinancialReportConfig, FinancialReportEditionCommand,
         FinancialReportEditionFields, FinancialReportEditionItemType, FinancialReportEditionType,
         Positioning, PositioningRule, PositioningRuleList } from '@app/models';

export enum FixedColumnEditorEventType {
  CLOSE_MODAL_CLICKED = 'FixedColumnEditorComponent.Event.CloseModalClicked',
  INSERT_COLUMN       = 'FixedColumnEditorComponent.Event.InsertColumn',
  UPDATE_COLUMN       = 'FixedColumnEditorComponent.Event.UpdateColumn',
}

interface FixedColumnFormModel extends FormGroup<{
  type: FormControl<FinancialReportEditionItemType>;
  name: FormControl<string>;
  formula: FormControl<string>;
  isHide: FormControl<boolean>;
  positioningRule: FormControl<PositioningRule>;
  positioningOffsetUID: FormControl<string>;
  position: FormControl<string>;
  startDate: FormControl<DateString>;
  endDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-fa-fixed-column-editor',
  templateUrl: './fixed-column-editor.component.html',
})
export class FixedColumnEditorComponent implements OnChanges {

  @Input() financialReportConfig: FinancialReportConfig =  Object.assign({}, EmptyFinancialReportConfig);

  @Input() financialReportColumn: FinancialReportColumn = Object.assign({}, EmptyFinancialReportColumn);

  @Input() column = 'A';

  @Input() financialReportColumnsList: FinancialReportColumn[] = [];

  @Output() fixedColumnEditorEvent = new EventEmitter<EventInfo>();

  form: FixedColumnFormModel;

  formHelper = FormHelper;

  isLoading = false;

  fixedColumnTypeList: Identifiable[] = FinancialReportColumnEditionItemTypeList;

  positioningRuleList: Identifiable[] = [];


  constructor() {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.financialReportColumnsList) {
      this.setPositionRuleListAndDefaultValue();
    }

    if (changes.column) {
      this.setPosition();
    }

    if (changes.financialReportColumn) {
      this.setFormData();
    }
  }


  get isSaved(): boolean {
    return !!this.financialReportColumn.field;
  }


  get isDataFieldType(): boolean {
    return FinancialReportEditionItemType.DataField === this.form.controls.type.value;
  }


  get isFormulaType(): boolean {
    return FinancialReportEditionItemType.Formula === this.form.controls.type.value;
  }


  get displayPositingSection(): boolean {
    return !this.form.controls.isHide.value;
  }


  get displayPositioningOffset(): boolean {
    return this.displayPositingSection && [PositioningRule.AfterOffset, PositioningRule.BeforeOffset]
      .includes(this.form.controls.positioningRule.value);
  }


  get displayPosition(): boolean {
    return PositioningRule.ByPositionValue === this.form.controls.positioningRule.value;
  }


  onClose() {
    sendEvent(this.fixedColumnEditorEvent, FixedColumnEditorEventType.CLOSE_MODAL_CLICKED);
  }


  onTypeChanged() {
    this.setControlConfig(this.form.controls.formula, this.isFormulaType);
  }


  onPositioningRuleChanged() {
    this.setControlConfig(this.form.controls.positioningOffsetUID, this.displayPositioningOffset);
    this.setControlConfig(this.form.controls.position, this.displayPosition);
  }


  onSubmitDataClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ?
        FixedColumnEditorEventType.UPDATE_COLUMN :
        FixedColumnEditorEventType.INSERT_COLUMN;

      const payload = {
        reportTypeUID: this.financialReportConfig.reportType.uid,
        columnUID: this.isSaved ? this.financialReportColumn.column : null,// TODO: check how to identify column
        command: this.getFinancialReportEditionCommand(),
      };

      sendEvent(this.fixedColumnEditorEvent, eventType, payload);
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      type: [FinancialReportEditionItemType.DataField, Validators.required],
      name: ['', Validators.required],
      formula: [''],
      isHide: [false],
      positioningRule: [PositioningRule.ByPositionValue, Validators.required],
      positioningOffsetUID: [''],
      position: ['', Validators.required],
      startDate: [null as DateString], // ['', Validators.required],
      endDate: [null as DateString], // [DefaultEndDate, Validators.required],
    });

    this.setDisableFields();
  }


  private setDisableFields() {
    this.formHelper.setDisableControl(this.form.controls.startDate);
    this.formHelper.setDisableControl(this.form.controls.endDate);
  }


  private setFormData() {
    if (!this.isSaved) {
      return;
    }

    this.form.reset({
      type: !!this.financialReportColumn.formula ? // TODO: check this for a new field type?
        FinancialReportEditionItemType.Formula : FinancialReportEditionItemType.DataField,
      name: this.financialReportColumn.title || '',
      formula: this.financialReportColumn.formula || '',
      isHide: !this.financialReportColumn.show,
      positioningRule: PositioningRule.ByPositionValue,
      position: this.financialReportColumn.column || '',
      startDate: this.financialReportColumn.startDate || '',
      endDate: this.financialReportColumn.endDate || '',
    });

    this.onTypeChanged();
    this.formHelper.setDisableControl(this.form.controls.type);
  }


  private setPosition() {
    this.form.controls.positioningRule.reset(PositioningRule.ByPositionValue);
    this.form.controls.position.reset(this.column);
  }


  // TODO: redefine command interface
  private getFinancialReportEditionCommand(): FinancialReportEditionCommand {
    const command: FinancialReportEditionCommand = {
      type: this.getFinancialReportEditionType(),
      payload: this.getFormData(),
    }

    return command;
  }


  private getFinancialReportEditionType(): FinancialReportEditionType {
    if (!this.isSaved && this.isDataFieldType) {
      return FinancialReportEditionType.InsertDataFieldColumn;
    }

    if (!this.isSaved && this.isFormulaType) {
      return FinancialReportEditionType.InsertFormulaColumn;
    }

    if (this.isSaved && this.isDataFieldType) {
      return FinancialReportEditionType.UpdateDataFieldColumn;
    }

    if (this.isSaved && this.isFormulaType) {
      return FinancialReportEditionType.UpdateFormulaColumn;
    }

    return null;
  }

  // TODO: Rfx data interface
  private getFormData(): FinancialReportEditionFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    let data: FinancialReportEditionFields = {
      columnName: formModel.name ?? '',
      isHideColumn: formModel.isHide,
      startDate: formModel.startDate ?? '',
      endDate: formModel.endDate ?? '',
    };

    this.validateFieldsByType(data);
    this.validatePositionsFields(data);

    return data;
  }


  private validateFieldsByType(data: FinancialReportEditionFields) {
    const formModel = this.form.getRawValue();

    if (this.isFormulaType) {
      data.formula = formModel.formula ?? '';
    }
  }


  private validatePositionsFields(data: FinancialReportEditionFields) {
    const formModel = this.form.getRawValue();

    if (!this.displayPositingSection) {
      return;
    }

    const positioning: Positioning = {
      rule: formModel.positioningRule ?? null,
    }

    if (this.displayPositioningOffset) {
      positioning.offsetUID = formModel.positioningOffsetUID;
    }

    if (this.displayPosition) {
      positioning.position = formModel.position as any; // TODO: check field to send column position
    }

    data.positioning = positioning;
  }


  private setPositionRuleListAndDefaultValue() {
    const hasRules = this.financialReportColumnsList.length > 0;

    if (hasRules) {
      this.positioningRuleList = [...[], ...PositioningRuleList];
    } else {
      this.positioningRuleList = PositioningRuleList.filter(x =>
        [PositioningRule.AtStart, PositioningRule.ByPositionValue].includes(x.uid as PositioningRule));
    }

    this.form.controls.positioningRule.reset(PositioningRule.ByPositionValue);
  }


  private setControlConfig(control: FormControl<any>, required: boolean) {
      if (required) {
      this.formHelper.setControlValidators(control, Validators.required);
    } else {
      this.formHelper.clearControlValidators(control);
    }
  }

}
