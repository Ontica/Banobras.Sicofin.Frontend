/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest, of, Subject } from 'rxjs';

import { catchError, distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FinancialConceptsDataService } from '@app/data-services';

import { AccountsChartMasterData, DefaultEndDate, EmptyFinancialConcept, FinancialConcept,
         FinancialConceptDescriptor, FinancialConceptEditionCommand, FinancialConceptsGroup, PositioningRule,
         PositioningRuleList } from '@app/models';

import { AccountChartStateSelector,
         FinancialConceptsStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormHelper, sendEvent } from '@app/shared/utils';

export enum FinancialConceptHeaderEventType {
  CREATE_FINANCIAL_CONCEPT = 'FinancialConceptHeaderComponent.Event.CreateFinancialConcept',
  UPDATE_FINANCIAL_CONCEPT = 'FinancialConceptHeaderComponent.Event.UpdateFinancialConcept',
  REMOVE_FINANCIAL_CONCEPT = 'FinancialConceptHeaderComponent.Event.RemoveFinancialConcept',
}

interface FinancialConceptFormModel extends FormGroup<{
  accountsChartUID: FormControl<string>;
  groupUID: FormControl<string>;
  code: FormControl<string>;
  name: FormControl<string>;
  position: FormControl<number>;
  positioningRule: FormControl<PositioningRule>;
  positioningOffsetConceptUID: FormControl<string>;
  startDate: FormControl<DateString>;
  endDate: FormControl<DateString>;
  calculationScript: FormControl<string>;
  variableID: FormControl<string>;
}> { }

@Component({
  selector: 'emp-fa-financial-concept-header',
  templateUrl: './financial-concept-header.component.html',
})
export class FinancialConceptHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() accountsChartUID = '';

  @Input() groupUID = '';

  @Input() queryDate: DateString = null;

  @Input() financialConcept: FinancialConcept = EmptyFinancialConcept;

  @Input() canEdit = false;

  @Output() financialConceptHeaderEvent = new EventEmitter<EventInfo>();

  form: FinancialConceptFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLoading = false;

  isLoadingGroups = false;

  isLoadingFinancialConcepts = false;

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  groupsList: FinancialConceptsGroup[] = [];

  filteredGroupsList: FinancialConceptsGroup[] = [];

  positioningRuleList: Identifiable[] = PositioningRuleList;

  financialConceptsList: FinancialConceptDescriptor[] = [];

  private unsubscribeGroupUID: Subject<void> = new Subject();

  private helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private financialConceptsData: FinancialConceptsDataService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.accountsChartUID) {
      this.setAccountsChartDefault();
    }

    if (changes.groupUID) {
      this.setGroupUIDDefault();
    }

    if (this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
    this.unsubscribeGroupUID.next();
    this.unsubscribeGroupUID.complete();
  }


  get isSaved(): boolean {
    return !isEmpty(this.financialConcept);
  }


  get displayPositioningOffsetConcept(): boolean {
    return [PositioningRule.AfterOffset, PositioningRule.BeforeOffset]
      .includes(this.form.controls.positioningRule.value);
  }

  get displayPosition(): boolean {
    return PositioningRule.ByPositionValue === this.form.controls.positioningRule.value;
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.validateFieldsDisabled();
  }


  onAccountsChartChanged(accountChart: AccountsChartMasterData) {
    this.form.controls.groupUID.reset();
    this.validateAccountsChartChanged(accountChart?.uid);
    this.resetFinancialConceptsData();
  }


  onPositioningRuleChanged() {
    if (this.displayPositioningOffsetConcept) {
      this.formHelper.setControlValidators(this.form.controls.positioningOffsetConceptUID, Validators.required);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.positioningOffsetConceptUID);
    }

    if (this.displayPosition) {
      this.formHelper.setControlValidators(this.form.controls.position, [Validators.required]);
    } else {
      this.formHelper.clearControlValidators(this.form.controls.position);
    }
  }


  onSubmitForm() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? FinancialConceptHeaderEventType.UPDATE_FINANCIAL_CONCEPT :
        FinancialConceptHeaderEventType.CREATE_FINANCIAL_CONCEPT;

      sendEvent(this.financialConceptHeaderEvent, eventType, {financialConcept: this.getFormData()});
    }
  }


  onRemoveButtonClicked() {
    this.showConfirmMessage();
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      accountsChartUID: ['', Validators.required],
      groupUID: ['', Validators.required],
      code: ['', Validators.required],
      name: ['', Validators.required],
      positioningRule: [PositioningRule.AtEnd, Validators.required],
      positioningOffsetConceptUID: [''],
      position: [null as number],
      startDate: [null as DateString, Validators.required],
      endDate: [DefaultEndDate, Validators.required],
      calculationScript: [''],
      variableID: ['', Validators.pattern('[A-Z0-9_]*')],
    });

    this.onSuscribeGroupChanges();
  }


  private setFormData() {
    this.form.reset({
      accountsChartUID: this.financialConcept.accountsChart.uid || '',
      groupUID: this.financialConcept.group.uid || '',
      code: this.financialConcept.code || '',
      name: this.financialConcept.name || '',
      positioningRule: PositioningRule.ByPositionValue,
      position: this.financialConcept.position || null,
      positioningOffsetConceptUID: '',
      startDate: this.financialConcept.startDate || null,
      endDate: this.financialConcept.endDate || null,
      calculationScript: this.financialConcept.calculationScript || '',
      variableID: this.financialConcept.variableID || '',
    });

    this.validateAccountsChartChanged(this.financialConcept.accountsChart.uid);
  }


  private getFormData(): FinancialConceptEditionCommand {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: FinancialConceptEditionCommand = {
      groupUID: formModel.groupUID ?? '',
      code: formModel.code ?? '',
      name: formModel.name ?? '',
      positioningRule: formModel.positioningRule ?? null,
      startDate: formModel.startDate ?? '',
      endDate: formModel.endDate ?? '',
      calculationScript: formModel.calculationScript ?? '',
      variableID: formModel.variableID ?? '',
    };

    if (this.isSaved) {
      data.financialConceptUID = this.financialConcept.uid;
    }

    if (this.displayPositioningOffsetConcept) {
      data.positioningOffsetConceptUID = formModel.positioningOffsetConceptUID;
    }

    if (this.displayPosition) {
      data.position = +formModel.position;
    }

    return data;
  }


  private validateFieldsDisabled() {
    this.formHelper.setDisableForm(this.form, !this.editionMode);

    if(this.isSaved) {
      this.formHelper.setDisableControl(this.form.controls.accountsChartUID);
      this.formHelper.setDisableControl(this.form.controls.groupUID);
    }
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<AccountsChartMasterData[]>
        (AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
      this.helper.select<FinancialConceptsGroup[]>
        (FinancialConceptsStateSelector.FINANCIAL_CONCEPTS_GROUPS_LIST),
    ])
    .subscribe(([x, y]) => {
      this.accountsChartMasterDataList = x;
      this.groupsList = y;
      this.setAccountsChartDefault();
      this.isLoading = false;
    });
  }


  private onSuscribeGroupChanges() {
    this.form.controls.groupUID.valueChanges
      .pipe(
        takeUntil(this.unsubscribeGroupUID),
        filter(groupUID => !!groupUID),
        distinctUntilChanged(),
        tap(() => {
          this.resetFinancialConceptsData()
          this.isLoadingFinancialConcepts = true;
        }),
        switchMap(groupUID =>
          this.financialConceptsData.getFinancialConceptsInGroup(groupUID, this.queryDate)
          .pipe(
            catchError(() => of([])),
            tap(() => this.isLoadingFinancialConcepts = false)
          )),
      )
    .subscribe(x => this.financialConceptsList = x);
  }


  private resetFinancialConceptsData() {
    this.form.controls.positioningOffsetConceptUID.reset();
    this.financialConceptsList = [];
  }


  private setAccountsChartDefault() {
    let accountsChartUID = this.accountsChartMasterDataList.length === 0 ? null :
        this.accountsChartMasterDataList[0].uid;

    if (this.isSaved) {
      accountsChartUID = this.financialConcept.accountsChart.uid;
    } else {
      accountsChartUID = !!this.accountsChartUID ? this.accountsChartUID : accountsChartUID;
    }


    this.form.controls.accountsChartUID.reset(accountsChartUID);

    if (!!accountsChartUID) {
      this.filterFinancialConceptsGroups(accountsChartUID);
    }
  }


  private setGroupUIDDefault() {
    this.form.controls.groupUID.reset(this.groupUID);
  }


  private validateAccountsChartChanged(accountsChartUID: string) {
    this.filteredGroupsList = [];

    if (!!accountsChartUID) {
      this.filterFinancialConceptsGroups(accountsChartUID);
    }
  }


  private filterFinancialConceptsGroups(accountsChartUID: string) {
    this.filteredGroupsList = this.groupsList.filter(x => x.accountsChart.uid === accountsChartUID);
  }


  private showConfirmMessage() {
    let message = `Esta operación eliminara el concepto
                   <strong> ${this.financialConcept.code}: ${this.financialConcept.name}</strong>
                   de la agrupación <strong> ${this.financialConcept.group.name}</strong>.
                   <br><br>¿Elimino el concepto?`;

    this.messageBox.confirm(message, 'Eliminar concepto', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.financialConceptHeaderEvent,
            FinancialConceptHeaderEventType.REMOVE_FINANCIAL_CONCEPT, {financialConcept: this.financialConcept});
        }
      });
  }

}
