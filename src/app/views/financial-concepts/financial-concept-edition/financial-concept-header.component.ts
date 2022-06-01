/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest, of, Subject } from 'rxjs';

import { catchError, distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { FinancialConceptsDataService } from '@app/data-services';

import { AccountsChartMasterData, EmptyFinancialConcept, FinancialConcept, FinancialConceptDescriptor,
         FinancialConceptEditionCommand, FinancialConceptsGroup, PositioningRule,
         PositioningRuleList } from '@app/models';

import { AccountChartStateSelector,
         FinancialConceptsStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormHandler, sendEvent } from '@app/shared/utils';

export enum FinancialConceptHeaderEventType {
  CREATE_FINANCIAL_CONCEPT = 'FinancialConceptHeaderComponent.Event.CreateFinancialConcept',
  UPDATE_FINANCIAL_CONCEPT = 'FinancialConceptHeaderComponent.Event.UpdateFinancialConcept',
  REMOVE_FINANCIAL_CONCEPT = 'FinancialConceptHeaderComponent.Event.RemoveFinancialConcept',
}

enum FinancialConceptHeaderFormControls {
  accountsChartUID = 'accountsChartUID',
  groupUID = 'groupUID',
  code = 'code',
  name = 'name',
  position = 'position',
  positioningRule = 'positioningRule',
  positioningOffsetConceptUID = 'positioningOffsetConceptUID',
  startDate = 'startDate',
  endDate = 'endDate',
}

@Component({
  selector: 'emp-fa-financial-concept-header',
  templateUrl: './financial-concept-header.component.html',
})
export class FinancialConceptHeaderComponent implements OnInit, OnChanges, OnDestroy {

  @Input() accountsChartUID = '';

  @Input() groupUID = '';

  @Input() financialConcept: FinancialConcept = EmptyFinancialConcept;

  @Output() financialConceptHeaderEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;

  controls = FinancialConceptHeaderFormControls;

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


  ngOnChanges(changes: SimpleChanges): void {
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
             .includes(this.formHandler.getControl(this.controls.positioningRule).value);
  }

  get displayPosition(): boolean {
    return PositioningRule.ByPositionValue ===
      this.formHandler.getControl(this.controls.positioningRule).value;
  }


  enableEditor(enable) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.validateFieldsDisabled();
  }


  onAccountsChartChanged(accountChart: AccountsChartMasterData) {
    this.formHandler.getControl(this.controls.groupUID).reset();
    this.validateAccountsChartChanged(accountChart?.uid);
    this.resetFinancialConceptsData();
  }


  onPositioningRuleChanged() {
    if (this.displayPositioningOffsetConcept) {
      this.formHandler.setControlValidators(this.controls.positioningOffsetConceptUID, Validators.required);
    } else {
      this.formHandler.clearControlValidators(this.controls.positioningOffsetConceptUID);
    }

    if (this.displayPosition) {
      this.formHandler.setControlValidators(this.controls.position, [Validators.required]);
    } else {
      this.formHandler.clearControlValidators(this.controls.position);
    }
  }


  onSubmitForm() {
    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    let eventType = FinancialConceptHeaderEventType.CREATE_FINANCIAL_CONCEPT;

    if (this.isSaved) {
      eventType = FinancialConceptHeaderEventType.UPDATE_FINANCIAL_CONCEPT;
    }

    sendEvent(this.financialConceptHeaderEvent, eventType, {financialConcept: this.getFormData()});
  }


  onRemoveButtonClicked() {
    this.showConfirmMessage();
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        accountsChartUID: new FormControl('', Validators.required),
        groupUID: new FormControl('', Validators.required),
        code: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        positioningRule: new FormControl(PositioningRule.AtEnd, Validators.required),
        positioningOffsetConceptUID: new FormControl(''),
        position: new FormControl(''),
        startDate: new FormControl('', Validators.required),
        endDate: new FormControl('2049-12-31', Validators.required),
      })
    );

    this.onSuscribeGroupChanges();
  }


  private setFormData() {
    this.formHandler.form.reset({
      accountsChartUID: this.financialConcept.accountsChart.uid || '',
      groupUID: this.financialConcept.group.uid || '',
      code: this.financialConcept.code || '',
      name: this.financialConcept.name || '',
      positioningRule: PositioningRule.ByPositionValue,
      position: this.financialConcept.position || '',
      positioningOffsetConceptUID: '',
      startDate: this.financialConcept.startDate || '',
      endDate: this.financialConcept.endDate || '',
    });

    this.validateAccountsChartChanged(this.financialConcept.accountsChart.uid);
  }


  private getFormData(): FinancialConceptEditionCommand {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: FinancialConceptEditionCommand = {
      groupUID: formModel.groupUID ?? '',
      code: formModel.code ?? '',
      name: formModel.name ?? '',
      positioningRule: formModel.positioningRule ?? '',
      startDate: formModel.startDate ?? '',
      endDate: formModel.endDate ?? '',
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
    this.formHandler.disableForm(!this.editionMode);

    if(this.isSaved) {
      this.formHandler.disableControl(this.controls.accountsChartUID);
      this.formHandler.disableControl(this.controls.groupUID);
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
    this.formHandler.getControl(this.controls.groupUID).valueChanges
      .pipe(
        takeUntil(this.unsubscribeGroupUID),
        filter(groupUID => !!groupUID),
        distinctUntilChanged(),
        tap(() => {
          this.resetFinancialConceptsData()
          this.isLoadingFinancialConcepts = true;
        }),
        switchMap(groupUID => this.financialConceptsData.getFinancialConceptsInGroup(groupUID)
          .pipe(
            catchError(() => of([])),
            tap(() => this.isLoadingFinancialConcepts = false)
          )),
      )
    .subscribe(x => this.financialConceptsList = x);
  }


  private resetFinancialConceptsData() {
    this.formHandler.getControl(this.controls.positioningOffsetConceptUID).reset();
    this.financialConceptsList = [];
  }


  private setAccountsChartDefault() {
    let accountsChartUID = this.accountsChartMasterDataList.length === 0 ? null :
        this.accountsChartMasterDataList[0].uid;;

    if (this.isSaved) {
      accountsChartUID = this.financialConcept.accountsChart.uid;
    } else {
      accountsChartUID = !!this.accountsChartUID ? this.accountsChartUID : accountsChartUID;
    }


    this.formHandler.getControl(this.controls.accountsChartUID).reset(accountsChartUID);

    if (!!accountsChartUID) {
      this.filterFinancialConceptsGroups(accountsChartUID);
    }
  }


  private setGroupUIDDefault() {
    this.formHandler.getControl(this.controls.groupUID).reset(this.groupUID);
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
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.financialConceptHeaderEvent,
            FinancialConceptHeaderEventType.REMOVE_FINANCIAL_CONCEPT, {financialConcept: this.financialConcept});
        }
      });
  }

}
