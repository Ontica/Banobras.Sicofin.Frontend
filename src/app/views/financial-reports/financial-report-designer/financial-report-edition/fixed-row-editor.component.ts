/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { of, Subject } from 'rxjs';

import { catchError, distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FinancialConceptsDataService } from '@app/data-services';

import { FinancialConceptDescriptor, Positioning, PositioningRule, PositioningRuleList,
         FinancialReportEditionItemTypeList, FinancialReportRow, EmptyFinancialReportRow,
         FinancialReportEditionItemType, FormatTypeList, FormatType, FinancialReportConfig,
         EmptyFinancialReportConfig, FinancialReportEditionCommand, FinancialReportEditionFields,
         FinancialReportEditionType } from '@app/models';


export enum FixedRowEditorEventType {
  CLOSE_MODAL_CLICKED = 'FixedRowEditorComponent.Event.CloseModalClicked',
  INSERT_ROW          = 'FixedRowEditorComponent.Event.InsertRow',
  UPDATE_ROW          = 'FixedRowEditorComponent.Event.UpdateRow',
}


enum FixedRowEditorFormControls {
  type = 'type',
  group = 'group',
  concept = 'concept',
  label = 'label',
  positioningRule = 'positioningRule',
  positioningOffsetUID = 'positioningOffsetUID',
  position = 'position',
  format = 'format',
}

@Component({
  selector: 'emp-fa-fixed-row-editor',
  templateUrl: './fixed-row-editor.component.html',
})
export class FixedRowEditorComponent implements OnChanges, OnDestroy {

  @Input() financialReportConfig: FinancialReportConfig =  Object.assign({}, EmptyFinancialReportConfig);

  @Input() financialReportRow: FinancialReportRow = Object.assign({}, EmptyFinancialReportRow);

  @Input() row = 1;

  @Input() financialReportRowList: FinancialReportRow[] = [];

  @Output() fixedRowEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  formHandler: FormHandler;

  controls = FixedRowEditorFormControls;

  isLoading = false;

  fixedRowTypeList: Identifiable[] = FinancialReportEditionItemTypeList;

  conceptList: FinancialConceptDescriptor[] = [];

  formatList: string[] = FormatTypeList;

  positioningRuleList: Identifiable[] = [];

  private unsubscribeGroupUID: Subject<void> = new Subject();


  constructor(uiLayer: PresentationLayer,
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
    return FinancialReportEditionItemType.Concept ===
      this.formHandler.getControl(this.controls.type).value;
  }


  get isLabelType(): boolean {
    return FinancialReportEditionItemType.Label ===
      this.formHandler.getControl(this.controls.type).value;
  }


  get displayPositioningOffset(): boolean {
    return [PositioningRule.AfterOffset, PositioningRule.BeforeOffset]
      .includes(this.formHandler.getControl(this.controls.positioningRule).value);
  }


  get displayPosition(): boolean {
    return PositioningRule.ByPositionValue ===
      this.formHandler.getControl(this.controls.positioningRule).value;
  }


  onClose() {
    sendEvent(this.fixedRowEditorEvent, FixedRowEditorEventType.CLOSE_MODAL_CLICKED);
  }


  onTypeChanged() {
    this.setControlConfig(this.controls.group, this.isConceptType);
    this.setControlConfig(this.controls.concept, this.isConceptType);
    this.setControlConfig(this.controls.label, this.isLabelType);
  }


  onPositioningRuleChanged() {
    this.setControlConfig(this.controls.positioningOffsetUID, this.displayPositioningOffset);
    this.setControlConfig(this.controls.position, this.displayPosition);
  }


  onSubmitDataClicked() {
    if (!this.formHandler.isReadyForSubmit) {
      this.formHandler.invalidateForm();
      return;
    }

    const eventType = this.isSaved ? FixedRowEditorEventType.UPDATE_ROW : FixedRowEditorEventType.INSERT_ROW;

    const payload = {
      financialReportTypeUID: this.financialReportConfig.reportType.uid,
      rowUID: this.isSaved ? this.financialReportRow.uid : null,
      command: this.getFinancialReportEditionCommand(),
    };

    sendEvent(this.fixedRowEditorEvent, eventType, payload);
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        type: new FormControl(FinancialReportEditionItemType.Concept, Validators.required),
        group: new FormControl('', Validators.required),
        concept: new FormControl('', Validators.required),
        label: new FormControl(''),
        positioningRule: new FormControl(PositioningRule.ByPositionValue, Validators.required),
        positioningOffsetUID: new FormControl(''),
        position: new FormControl('', Validators.required),
        format: new FormControl(FormatType.Default, Validators.required),
      })
    );

    this.onSuscribeGroupChanges();
  }


  private onSuscribeGroupChanges() {
    this.formHandler.getControl(this.controls.group).valueChanges
      .pipe(
        takeUntil(this.unsubscribeGroupUID),
        filter(groupUID => !!groupUID),
        distinctUntilChanged(),
        tap(() => {
          this.resetConceptData()
          this.isLoading = true;
        }),
        switchMap(groupUID => this.financialConceptsData.getFinancialConceptsInGroup(groupUID)
          .pipe(
            catchError(() => of([])),
            tap(() => this.isLoading = false)
          )),
      )
    .subscribe(x => this.conceptList = x);
  }


  private resetConceptData() {
    this.formHandler.getControl(this.controls.concept).reset();
    this.conceptList = [];
  }


  private setFormData() {
    this.formHandler.form.reset({
      type: this.isEmptyConcept(this.financialReportRow.financialConceptUID) ?
        FinancialReportEditionItemType.Label : FinancialReportEditionItemType.Concept,
      positioningRule: PositioningRule.ByPositionValue,
      position: this.financialReportRow.row || '',
      format: this.financialReportRow.format || FormatType.Default,
    });

    this.setFieldsDataByType();

    this.onTypeChanged();
    this.formHandler.disableControl(this.controls.type);
  }


  private isEmptyConcept(financialConceptUID: string) {
    return isEmpty({uid: financialConceptUID});
  }


  private setFieldsDataByType() {
    if (this.isConceptType) {
      this.formHandler.getControl(this.controls.group)
        .reset(this.financialReportRow.financialConceptGroupUID);
      this.formHandler.getControl(this.controls.concept)
        .reset(this.financialReportRow.financialConceptUID);
    } else {
      this.formHandler.getControl(this.controls.label)
        .reset(this.financialReportRow.concept);
    }
  }


  private setPosition() {
    this.formHandler.getControl(this.controls.positioningRule).reset(PositioningRule.ByPositionValue);
    this.formHandler.getControl(this.controls.position).reset(this.row);
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
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    let data: FinancialReportEditionFields = {
      format: formModel.format ?? '',
    };

    this.validateFieldsByType(data);
    this.validatePositionsFields(data);

    return data;
  }


  private validateFieldsByType(data: FinancialReportEditionFields) {
    const formModel = this.formHandler.form.getRawValue();

    if (this.isConceptType) {
      data.financialConceptUID = formModel.concept ?? '';
    }

    if (this.isLabelType) {
      data.label = formModel.label ?? '';
    }
  }


  private validatePositionsFields(data: FinancialReportEditionFields) {
    const formModel = this.formHandler.form.getRawValue();

    const positioning: Positioning = {
      rule: formModel.positioningRule ?? '',
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

    this.formHandler.getControl(this.controls.positioningRule).reset(PositioningRule.ByPositionValue);
  }


  private setControlConfig(control: FixedRowEditorFormControls, required: boolean) {
      if (required) {
      this.formHandler.setControlValidators(control, Validators.required);
    } else {
      this.formHandler.clearControlValidators(control);
    }
  }

}
