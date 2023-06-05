/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { of, Subject } from 'rxjs';

import { catchError, distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { FormHelper, sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FinancialConceptsDataService } from '@app/data-services';

import { EmptyFinancialReportConfig, EmptyFinancialReportRow, FinancialConceptDescriptor,
         FinancialReportConfig, FinancialReportEditionCommand, FinancialReportEditionFields,
         FinancialReportEditionItemType, FinancialReportEditionItemTypeList, FinancialReportEditionType,
         FinancialReportRow, FormatType, FormatTypeList, Positioning, PositioningRule,
         PositioningRuleList } from '@app/models';


export enum FixedRowEditorEventType {
  CLOSE_MODAL_CLICKED = 'FixedRowEditorComponent.Event.CloseModalClicked',
  INSERT_ROW          = 'FixedRowEditorComponent.Event.InsertRow',
  UPDATE_ROW          = 'FixedRowEditorComponent.Event.UpdateRow',
}

interface FixedRowFormModel extends FormGroup<{
  type: FormControl<FinancialReportEditionItemType>;
  group: FormControl<string>;
  concept: FormControl<string>;
  label: FormControl<string>;
  positioningRule: FormControl<PositioningRule>;
  positioningOffsetUID: FormControl<string>;
  position: FormControl<number>;
  format: FormControl<FormatType>;
  startDate: FormControl<DateString>;
  endDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-fa-fixed-row-editor',
  templateUrl: './fixed-row-editor.component.html',
})
export class FixedRowEditorComponent implements OnChanges, OnDestroy {

  @Input() financialReportConfig: FinancialReportConfig =  Object.assign({}, EmptyFinancialReportConfig);

  @Input() financialReportRow: FinancialReportRow = Object.assign({}, EmptyFinancialReportRow);

  @Input() row = 1;

  @Input() financialReportRowList: FinancialReportRow[] = [];

  @Input() queryDate: DateString = null;

  @Output() fixedRowEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  form: FixedRowFormModel;

  formHelper = FormHelper;

  isLoading = false;

  fixedRowTypeList: Identifiable[] = FinancialReportEditionItemTypeList;

  conceptList: FinancialConceptDescriptor[] = [];

  formatList: string[] = FormatTypeList;

  positioningRuleList: Identifiable[] = [];

  private unsubscribeGroupUID: Subject<void> = new Subject();


  constructor(private uiLayer: PresentationLayer,
              private financialConceptsData: FinancialConceptsDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.financialReportRowList) {
      this.setPositionRuleListAndDefaultValue();
    }

    if (changes.row) {
      this.setPosition();
    }

    if (changes.financialReportRow) {
      if (this.isSaved) {
        this.setFormData();
      }
    }
  }


  ngOnDestroy() {
    this.helper.destroy();

    this.unsubscribeGroupUID.next();
    this.unsubscribeGroupUID.complete();
  }


  get isSaved(): boolean {
    return !isEmpty(this.financialReportRow);
  }


  get isConceptType(): boolean {
    return FinancialReportEditionItemType.Concept === this.form.controls.type.value;
  }


  get isLabelType(): boolean {
    return FinancialReportEditionItemType.Label === this.form.controls.type.value;
  }


  get displayPositioningOffset(): boolean {
    return [PositioningRule.AfterOffset, PositioningRule.BeforeOffset]
      .includes(this.form.controls.positioningRule.value);
  }


  get displayPosition(): boolean {
    return PositioningRule.ByPositionValue === this.form.controls.positioningRule.value;
  }


  onClose() {
    sendEvent(this.fixedRowEditorEvent, FixedRowEditorEventType.CLOSE_MODAL_CLICKED);
  }


  onTypeChanged() {
    this.setControlConfig(this.form.controls.group, this.isConceptType);
    this.setControlConfig(this.form.controls.concept, this.isConceptType);
    this.setControlConfig(this.form.controls.label, this.isLabelType);
  }


  onPositioningRuleChanged() {
    this.setControlConfig(this.form.controls.positioningOffsetUID, this.displayPositioningOffset);
    this.setControlConfig(this.form.controls.position, this.displayPosition);
  }


  onSubmitDataClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? FixedRowEditorEventType.UPDATE_ROW : FixedRowEditorEventType.INSERT_ROW;

      const payload = {
        financialReportTypeUID: this.financialReportConfig.reportType.uid,
        rowUID: this.isSaved ? this.financialReportRow.uid : null,
        command: this.getFinancialReportEditionCommand(),
      };

      sendEvent(this.fixedRowEditorEvent, eventType, payload);
    }
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      type: [FinancialReportEditionItemType.Concept, Validators.required],
      group: ['', Validators.required],
      concept: ['', Validators.required],
      label: [''],
      positioningRule: [PositioningRule.ByPositionValue, Validators.required],
      positioningOffsetUID: [''],
      position: [null as number, Validators.required],
      format: [FormatType.Default, Validators.required],
      startDate: ['' as DateString], // ['', Validators.required],
      endDate: ['' as DateString], // [DefaultEndDate, Validators.required],
    });

    this.setDisableFields();
    this.onSuscribeGroupChanges();
  }


  private setDisableFields() {
    this.formHelper.setDisableControl(this.form.controls.startDate);
    this.formHelper.setDisableControl(this.form.controls.endDate);
  }


  private onSuscribeGroupChanges() {
    this.form.controls.group.valueChanges
      .pipe(
        takeUntil(this.unsubscribeGroupUID),
        filter(groupUID => !!groupUID),
        distinctUntilChanged(),
        tap(() => {
          this.resetConceptData()
          this.isLoading = true;
        }),
        switchMap(groupUID =>
          this.financialConceptsData.getFinancialConceptsInGroup(groupUID, this.queryDate)
          .pipe(
            catchError(() => of([])),
            tap(() => this.isLoading = false)
          )),
      )
    .subscribe(x => this.conceptList = x);
  }


  private resetConceptData() {
    this.form.controls.concept.reset();
    this.conceptList = [];
  }


  private setFormData() {
    this.form.reset({
      type: this.isEmptyConcept(this.financialReportRow.financialConceptUID) ?
        FinancialReportEditionItemType.Label : FinancialReportEditionItemType.Concept,
      positioningRule: PositioningRule.ByPositionValue,
      position: this.financialReportRow.row || null,
      format: this.financialReportRow.format as FormatType || FormatType.Default,
      startDate: this.financialReportRow.startDate || '',
      endDate: this.financialReportRow.endDate || '',
    });

    this.setFieldsDataByType();

    this.onTypeChanged();
    this.formHelper.setDisableControl(this.form.controls.type);
  }


  private isEmptyConcept(financialConceptUID: string) {
    return isEmpty({uid: financialConceptUID});
  }


  private setFieldsDataByType() {
    if (this.isConceptType) {
      this.form.controls.group.reset(this.financialReportRow.financialConceptGroupUID);
      this.form.controls.concept.reset(this.financialReportRow.financialConceptUID);
    } else {
      this.form.controls.label.reset(this.financialReportRow.concept);
    }
  }


  private setPosition() {
    this.form.controls.positioningRule.reset(PositioningRule.ByPositionValue);
    this.form.controls.position.reset(this.row);
  }


  private getFinancialReportEditionCommand(): FinancialReportEditionCommand {
    const command: FinancialReportEditionCommand = {
      type: this.getFinancialReportEditionType(),
      payload: this.getFormData(),
    }

    return command;
  }


  private getFinancialReportEditionType(): FinancialReportEditionType {
    if (!this.isSaved && this.isLabelType) {
      return FinancialReportEditionType.InsertLabelRow;
    }

    if (!this.isSaved && this.isConceptType) {
      return FinancialReportEditionType.InsertConceptRow;
    }

    if (this.isSaved && this.isLabelType) {
      return FinancialReportEditionType.UpdateLabelRow;
    }

    if (this.isSaved && this.isConceptType) {
      return FinancialReportEditionType.UpdateConceptRow;
    }

    return null;
  }


  private getFormData(): FinancialReportEditionFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    let data: FinancialReportEditionFields = {
      format: formModel.format ?? '',
      startDate: formModel.startDate ?? '',
      endDate: formModel.endDate ?? '',
    };

    this.validateFieldsByType(data);
    this.validatePositionsFields(data);

    return data;
  }


  private validateFieldsByType(data: FinancialReportEditionFields) {
    const formModel = this.form.getRawValue();

    if (this.isConceptType) {
      data.financialConceptUID = formModel.concept ?? '';
    }

    if (this.isLabelType) {
      data.label = formModel.label ?? '';
    }
  }


  private validatePositionsFields(data: FinancialReportEditionFields) {
    const formModel = this.form.getRawValue();

    const positioning: Positioning = {
      rule: formModel.positioningRule ?? null,
    }

    if (this.displayPositioningOffset) {
      positioning.offsetUID = formModel.positioningOffsetUID;
    }

    if (this.displayPosition) {
      positioning.position = +formModel.position;
    }

    data.positioning = positioning;
  }


  private setPositionRuleListAndDefaultValue() {
    const hasRules = this.financialReportRowList.length > 0;

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
