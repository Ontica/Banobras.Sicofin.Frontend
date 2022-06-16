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

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FinancialConceptsDataService } from '@app/data-services';

import { FinancialConceptDescriptor, FinancialReportEditionItemTypeList, FinancialReportEditionItemType,
         FormatTypeList, FormatType, FinancialReportConfig, EmptyFinancialReportConfig, FinancialReportCell,
         EmptyFinancialReportCell, FinancialReportEditionCommand, FinancialReportEditionType,
         FinancialReportEditionFields } from '@app/models';


export enum FixedCellEditorEventType {
  CLOSE_MODAL_CLICKED = 'FixedCellEditorComponent.Event.CloseModalClicked',
  INSERT_CELL         = 'FixedCellEditorComponent.Event.InsertCell',
  UPDATE_CELL         = 'FixedCellEditorComponent.Event.UpdateCell',
  REMOVE_CELL         = 'FixedCellEditorComponent.Event.RemoveCell',
}


enum FixedCellEditorFormControls {
  type = 'type',
  group = 'group',
  concept = 'concept',
  dataField = 'dataField',
  label = 'label',
  format = 'format',
}

@Component({
  selector: 'emp-fa-fixed-cell-editor',
  templateUrl: './fixed-cell-editor.component.html',
})
export class FixedCellEditorComponent implements OnChanges, OnDestroy {

  @Input() financialReportConfig: FinancialReportConfig = EmptyFinancialReportConfig;

  @Input() financialReportCell: FinancialReportCell = EmptyFinancialReportCell;

  @Output() fixedCellEditorEvent = new EventEmitter<EventInfo>();

  title = 'Editar celda del reporte';

  helper: SubscriptionHelper;

  formHandler: FormHandler;

  controls = FixedCellEditorFormControls;

  isLoading = false;

  fixedCellTypeList: Identifiable[] = FinancialReportEditionItemTypeList;

  conceptList: FinancialConceptDescriptor[] = [];

  formatList: string[] = FormatTypeList;

  private unsubscribeGroupUID: Subject<void> = new Subject();


  constructor(uiLayer: PresentationLayer,
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
    return FinancialReportEditionItemType.Concept ===
      this.formHandler.getControl(this.controls.type).value;
  }


  get isLabelType(): boolean {
    return FinancialReportEditionItemType.Label ===
      this.formHandler.getControl(this.controls.type).value;
  }


  onClose() {
    sendEvent(this.fixedCellEditorEvent, FixedCellEditorEventType.CLOSE_MODAL_CLICKED);
  }


  onTypeChanged() {
    this.setControlConfig(this.controls.group, this.isConceptType);
    this.setControlConfig(this.controls.concept, this.isConceptType);
    this.setControlConfig(this.controls.dataField, this.isConceptType);
    this.setControlConfig(this.controls.label, this.isLabelType);
  }


  onSubmitDataClicked() {
    if (!this.formHandler.isReadyForSubmit) {
      this.formHandler.invalidateForm();
      return;
    }

    const eventType = this.isSaved ? FixedCellEditorEventType.UPDATE_CELL :
      FixedCellEditorEventType.INSERT_CELL;

    let payload = {
      financialReportTypeUID: this.financialReportConfig.reportType.uid,
      cellUID: this.isSaved ? this.financialReportCell.uid : null,
      command: this.getFinancialReportEditionCommand(),
    };

    sendEvent(this.fixedCellEditorEvent, eventType, payload);
  }


  onRemoveCellClicked() {
    this.showConfirmMessage();
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
        dataField: new FormControl('', Validators.required),
        label: new FormControl(''),
        format: new FormControl(FormatType.Default, Validators.required),
      })
    );

    this.onSuscribeGroupChanges();
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
      type: this.isEmptyConcept(this.financialReportCell.financialConceptUID) ?
        FinancialReportEditionItemType.Label : FinancialReportEditionItemType.Concept,
      format: this.financialReportCell.format || FormatType.Default,
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
        .reset(this.financialReportCell.financialConceptGroupUID);
      this.formHandler.getControl(this.controls.concept)
        .reset(this.financialReportCell.financialConceptUID);
      this.formHandler.getControl(this.controls.dataField)
        .reset(this.financialReportCell.dataField);
    } else {
      this.formHandler.getControl(this.controls.label)
        .reset(this.financialReportCell.label);
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
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    let data: FinancialReportEditionFields = {
      cell: {
        column: this.financialReportCell.column,
        row: this.financialReportCell.row,
      },
      format: formModel.format ?? '',
    };

    this.validateFieldsByType(data);

    return data;
  }


  private validateFieldsByType(data: FinancialReportEditionFields) {
    const formModel = this.formHandler.form.getRawValue();

    if (this.isConceptType) {
      data.conceptUID = formModel.concept ?? '';
      data.dataField = formModel.dataField ?? '';
    }

    if (this.isLabelType) {
      data.label = formModel.label ?? '';
    }
  }


  private setControlConfig(control: FixedCellEditorFormControls, required: boolean) {
      if (required) {
      this.formHandler.setControlValidators(control, Validators.required);
    } else {
      this.formHandler.clearControlValidators(control);
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
