/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { EmptyFinancialReportColumn, EmptyFinancialReportConfig, FinancialReportColumn,
         FinancialReportColumnEditionItemTypeList, FinancialReportConfig, FinancialReportEditionCommand,
         FinancialReportEditionItemType, FinancialReportEditionType, Positioning, PositioningRule,
         PositioningRuleList } from '@app/models';

export enum FixedColumnEditorEventType {
  CLOSE_MODAL_CLICKED = 'FixedColumnEditorComponent.Event.CloseModalClicked',
  INSERT_COLUMN       = 'FixedColumnEditorComponent.Event.InsertColumn',
  UPDATE_COLUMN       = 'FixedColumnEditorComponent.Event.UpdateColumn',
}

enum FixedColumnEditorFormControls {
  type = 'type',
  name = 'name',
  formula = 'formula',
  isHide = 'isHide',
  positioningRule = 'positioningRule',
  positioningOffsetUID = 'positioningOffsetUID',
  position = 'position',
  startDate = 'startDate',
  endDate = 'endDate',
}

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

  formHandler: FormHandler;

  controls = FixedColumnEditorFormControls;

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
    return FinancialReportEditionItemType.DataField ===
      this.formHandler.getControl(this.controls.type).value;
  }


  get isFormulaType(): boolean {
    return FinancialReportEditionItemType.Formula ===
      this.formHandler.getControl(this.controls.type).value;
  }


  get displayPositingSection(): boolean {
    return !this.formHandler.getControl(this.controls.isHide).value;
  }


  get displayPositioningOffset(): boolean {
    return this.displayPositingSection && [PositioningRule.AfterOffset, PositioningRule.BeforeOffset]
      .includes(this.formHandler.getControl(this.controls.positioningRule).value);
  }


  get displayPosition(): boolean {
    return PositioningRule.ByPositionValue ===
      this.formHandler.getControl(this.controls.positioningRule).value;
  }


  onClose() {
    sendEvent(this.fixedColumnEditorEvent, FixedColumnEditorEventType.CLOSE_MODAL_CLICKED);
  }


  onTypeChanged() {
    this.setControlConfig(this.controls.formula, this.isFormulaType);
  }


  onPositioningRuleChanged() {
    this.setControlConfig(this.controls.positioningOffsetUID, this.displayPositioningOffset);
    this.setControlConfig(this.controls.position, this.displayPosition);
  }


  onSubmitDataClicked() {
    if (!this.formHandler.isValid) {
      this.formHandler.invalidateForm();
      return;
    }

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


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new UntypedFormGroup({
        type: new UntypedFormControl(FinancialReportEditionItemType.DataField, Validators.required),
        name: new UntypedFormControl('', Validators.required),
        formula: new UntypedFormControl(''),
        isHide: new UntypedFormControl(false),
        positioningRule: new UntypedFormControl(PositioningRule.ByPositionValue, Validators.required),
        positioningOffsetUID: new UntypedFormControl(''),
        position: new UntypedFormControl('', Validators.required),
        startDate: new UntypedFormControl(''), // ('', Validators.required)
        endDate: new UntypedFormControl(''), // (DefaultEndDate, Validators.required)
      })
    );

    this.setDisableFields();
  }


  private setDisableFields() {
    this.formHandler.disableControl(this.controls.startDate);
    this.formHandler.disableControl(this.controls.endDate);
  }


  private setFormData() {
    if (!this.isSaved) {
      return;
    }

    this.formHandler.form.reset({
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
    this.formHandler.disableControl(this.controls.type);
  }


  private setPosition() {
    this.formHandler.getControl(this.controls.positioningRule).reset(PositioningRule.ByPositionValue);
    this.formHandler.getControl(this.controls.position).reset(this.column);
  }


  // TODO: define command interface
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

  // TODO: define data interface
  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    let data: any = {
      name: formModel.name ?? '',
      isHide: formModel.isHide ?? '',
      startDate: formModel.startDate ?? '',
      endDate: formModel.endDate ?? '',
    };

    this.validateFieldsByType(data);
    this.validatePositionsFields(data);

    return data;
  }


  private validateFieldsByType(data: any) {
    const formModel = this.formHandler.form.getRawValue();

    if (this.isFormulaType) {
      data.formula = formModel.formula ?? '';
    }
  }


  private validatePositionsFields(data: any) {
    const formModel = this.formHandler.form.getRawValue();

    if (!this.displayPositingSection) {
      return;
    }

    const positioning: Positioning = {
      rule: formModel.positioningRule ?? '',
    }

    if (this.displayPositioningOffset) {
      positioning.offsetUID = formModel.positioningOffsetUID;
    }

    if (this.displayPosition) {
      positioning.position = formModel.position;
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

    this.formHandler.getControl(this.controls.positioningRule).reset(PositioningRule.ByPositionValue);
  }


  private setControlConfig(control: FixedColumnEditorFormControls, required: boolean) {
      if (required) {
      this.formHandler.setControlValidators(control, Validators.required);
    } else {
      this.formHandler.clearControlValidators(control);
    }
  }

}
