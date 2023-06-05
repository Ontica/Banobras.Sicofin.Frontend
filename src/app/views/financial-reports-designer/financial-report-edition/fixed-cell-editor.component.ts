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

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FinancialConceptsDataService } from '@app/data-services';

import { EmptyFinancialReportCell, EmptyFinancialReportConfig, FinancialConceptDescriptor,
         FinancialReportCell, FinancialReportConfig, FinancialReportEditionCommand,
         FinancialReportEditionFields, FinancialReportEditionItemType, FinancialReportEditionItemTypeList,
         FinancialReportEditionType, FormatType, FormatTypeList } from '@app/models';

export enum FixedCellEditorEventType {
  CLOSE_MODAL_CLICKED = 'FixedCellEditorComponent.Event.CloseModalClicked',
  INSERT_CELL         = 'FixedCellEditorComponent.Event.InsertCell',
  UPDATE_CELL         = 'FixedCellEditorComponent.Event.UpdateCell',
  REMOVE_CELL         = 'FixedCellEditorComponent.Event.RemoveCell',
}

interface FixedCellFormModel extends FormGroup<{
  type: FormControl<FinancialReportEditionItemType>;
  group: FormControl<string>;
  concept: FormControl<string>;
  dataField: FormControl<string>;
  label: FormControl<string>;
  format: FormControl<FormatType>;
  startDate: FormControl<DateString>;
  endDate: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-fa-fixed-cell-editor',
  templateUrl: './fixed-cell-editor.component.html',
})
export class FixedCellEditorComponent implements OnChanges, OnDestroy {

  @Input() financialReportConfig: FinancialReportConfig = EmptyFinancialReportConfig;

  @Input() financialReportCell: FinancialReportCell = EmptyFinancialReportCell;

  @Input() queryDate: DateString = null;

  @Output() fixedCellEditorEvent = new EventEmitter<EventInfo>();

  title = 'Editar celda del reporte';

  helper: SubscriptionHelper;

  form: FixedCellFormModel;

  formHelper = FormHelper;

  isLoading = false;

  fixedCellTypeList: Identifiable[] = FinancialReportEditionItemTypeList;

  conceptList: FinancialConceptDescriptor[] = [];

  formatList: string[] = FormatTypeList;

  private unsubscribeGroupUID: Subject<void> = new Subject();


  constructor(private uiLayer: PresentationLayer,
              private financialConceptsData: FinancialConceptsDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.financialReportCell) {
      if (this.isSaved) {
        this.setFormData();
      }
    }

    this.setTitle();
  }


  ngOnDestroy() {
    this.helper.destroy();

    this.unsubscribeGroupUID.next();
    this.unsubscribeGroupUID.complete();
  }


  get isSaved(): boolean {
    return !isEmpty(this.financialReportCell);
  }


  get isConceptType(): boolean {
    return FinancialReportEditionItemType.Concept === this.form.controls.type.value;
  }


  get isLabelType(): boolean {
    return FinancialReportEditionItemType.Label === this.form.controls.type.value;
  }


  onClose() {
    sendEvent(this.fixedCellEditorEvent, FixedCellEditorEventType.CLOSE_MODAL_CLICKED);
  }


  onTypeChanged() {
    this.setControlConfig(this.form.controls.group, this.isConceptType);
    this.setControlConfig(this.form.controls.concept, this.isConceptType);
    this.setControlConfig(this.form.controls.dataField, this.isConceptType);
    this.setControlConfig(this.form.controls.label, this.isLabelType);
  }


  onSubmitDataClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? FixedCellEditorEventType.UPDATE_CELL :
        FixedCellEditorEventType.INSERT_CELL;

      let payload = {
        financialReportTypeUID: this.financialReportConfig.reportType.uid,
        cellUID: this.isSaved ? this.financialReportCell.uid : null,
        command: this.getFinancialReportEditionCommand(),
      };

      sendEvent(this.fixedCellEditorEvent, eventType, payload);
    }
  }


  onRemoveCellClicked() {
    this.showConfirmMessage();
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      type: [FinancialReportEditionItemType.Concept, Validators.required],
      group: ['', Validators.required],
      concept: ['', Validators.required],
      dataField: ['', Validators.required],
      label: [''],
      format: [FormatType.Default, Validators.required],
      startDate: ['' as DateString], // ('', Validators.required)
      endDate: ['' as DateString], // (DefaultEndDate, Validators.required)
    });

    this.setDisableFields();
    this.onSuscribeGroupChanges();
  }


  private setDisableFields() {
    this.formHelper.setDisableControl(this.form.controls.startDate);
    this.formHelper.setDisableControl(this.form.controls.endDate);
  }


  private setTitle() {
    const cell = `${this.financialReportCell.column}${this.financialReportCell.row}`;
    if (this.isSaved) {
      this.title = `Editar celda ${cell} del reporte`;
    } else {
      this.title = `Agregar celda ${cell} al reporte`;
    }
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
      type: this.isEmptyConcept(this.financialReportCell.financialConceptUID) ?
        FinancialReportEditionItemType.Label : FinancialReportEditionItemType.Concept,
      format: this.financialReportCell.format as FormatType || FormatType.Default,
      startDate: this.financialReportCell.startDate || '',
      endDate: this.financialReportCell.endDate || '',
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
      this.form.controls.group.reset(this.financialReportCell.financialConceptGroupUID);
      this.form.controls.concept.reset(this.financialReportCell.financialConceptUID);
      this.form.controls.dataField.reset(this.financialReportCell.dataField);
    } else {
      this.form.controls.label.reset(this.financialReportCell.label);
    }
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
      return FinancialReportEditionType.InsertLabelCell;
    }

    if (!this.isSaved && this.isConceptType) {
      return FinancialReportEditionType.InsertConceptCell;
    }

    if (this.isSaved && this.isLabelType) {
      return FinancialReportEditionType.UpdateLabelCell;
    }

    if (this.isSaved && this.isConceptType) {
      return FinancialReportEditionType.UpdateConceptCell;
    }

    return null;
  }


  private getFormData(): FinancialReportEditionFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    let data: FinancialReportEditionFields = {
      column: this.financialReportCell.column,
      row: this.financialReportCell.row,
      format: formModel.format ?? '',
      startDate: formModel.startDate ?? '',
      endDate: formModel.endDate ?? '',
    };

    this.validateFieldsByType(data);

    return data;
  }


  private validateFieldsByType(data: FinancialReportEditionFields) {
    const formModel = this.form.getRawValue();

    if (this.isConceptType) {
      data.financialConceptUID = formModel.concept ?? '';
      data.dataField = formModel.dataField ?? '';
    }

    if (this.isLabelType) {
      data.label = formModel.label ?? '';
    }
  }


  private setControlConfig(control: FormControl<any>, required: boolean) {
      if (required) {
      this.formHelper.setControlValidators(control, Validators.required);
    } else {
      this.formHelper.clearControlValidators(control);
    }
  }



  private showConfirmMessage() {
    let message = `Esta operación eliminara la información de la celda
                   <strong> ${this.financialReportCell.column}${this.financialReportCell.row}</strong>
                   del reporte.
                   <br><br>¿Elimino la celda?`;

    this.messageBox.confirm(message, 'Eliminar celda', 'DeleteCancel')
      .toPromise()
      .then(x => {
        if (x) {
          const payload = {
            financialReportTypeUID: this.financialReportConfig.reportType.uid,
            cellUID: this.financialReportCell.uid,
          }
          sendEvent(this.fixedCellEditorEvent, FixedCellEditorEventType.REMOVE_CELL, payload);
        }
      });
  }

}
