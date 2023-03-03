/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { combineLatest, concat, Observable, of, Subject } from 'rxjs';

import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil,
         tap } from 'rxjs/operators';

import { Assertion, DateString, EventInfo, Identifiable, isEmpty } from '@app/core';

import { FormHandler, sendEvent } from '@app/shared/utils';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartDataService, ExternalVariablesDataService, FinancialConceptsDataService,
         SubledgerDataService } from '@app/data-services';

import { AccountDescriptor, AccountsChartMasterData, AccountsQuery, EmptyFinancialConcept,
         EmptyFinancialConceptEntry, ExternalVariable, FinancialConcept, FinancialConceptDescriptor,
         FinancialConceptEntryEditionCommand, FinancialConceptEntryFields, FinancialConceptEntryType,
         FinancialConceptEntryTypeList, FinancialConceptsGroup, OperatorTypeList, Positioning,
         PositioningRule, PositioningRuleList, SubledgerAccountQuery, SubledgerAccountDescriptor,
         FinancialConceptEntryEditionType, FinancialConceptEntry } from '@app/models';

import { AccountChartStateSelector,
         FinancialConceptsStateSelector } from '@app/presentation/exported.presentation.types';


export enum FinancialConceptEntryEditorEventType {
  CLOSE_MODAL_CLICKED = 'FinancialConceptEntryEditorComponent.Event.CloseModalClicked',
  INSERT_ENTRY        = 'FinancialConceptEntryEditorComponent.Event.InsertEntry',
  UPDATE_ENTRY        = 'FinancialConceptEntryEditorComponent.Event.UpdateEntry',
}


enum FinancialConceptEntryEditorFormControls {
  entryType = 'entryType',
  referencedGroup = 'referencedGroup',
  referencedFinancialConcept = 'referencedFinancialConcept',
  externalVariableSet = 'externalVariableSet',
  externalVariable = 'externalVariable',
  account = 'account',
  subledgerAccount = 'subledgerAccount',
  sector = 'sector',
  currency = 'currency',
  positioningRule = 'positioningRule',
  positioningOffsetEntryUID = 'positioningOffsetEntryUID',
  position = 'position',
  operator = 'operator',
  calculationRule = 'calculationRule',
  dataColumn = 'dataColumn',
}

@Component({
  selector: 'emp-fa-financial-concept-entry-editor',
  templateUrl: './financial-concept-entry-editor.component.html',
})
export class FinancialConceptEntryEditorComponent implements OnChanges, OnInit, OnDestroy {

  @Input() financialConceptEntry: FinancialConceptEntry = EmptyFinancialConceptEntry;

  @Input() financialConcept: FinancialConcept = EmptyFinancialConcept;

  @Input() queryDate: DateString = null;

  @Input() isSaved = false;

  @Input() readonly = false;

  @Input() submitted = false;

  @Output() financialConceptEntryEditorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  formHandler: FormHandler;
  controls = FinancialConceptEntryEditorFormControls;
  editionMode = false;

  isLoadingDataLists = false;
  isLoadingReferencedFinancialConcepts = false;
  isLoadingExternalVariable = false;

  selectedAccountChart: AccountsChartMasterData;
  selectedGroup: FinancialConceptsGroup;

  financialConceptEntryTypeList: Identifiable[] = FinancialConceptEntryTypeList;

  operatorList: Identifiable[] = OperatorTypeList;
  calculationRuleList: Identifiable[] = [];
  dataColumnList: Identifiable[] = [];
  positioningRuleList: Identifiable[] = [];

  referencedGroupList: FinancialConceptsGroup[] = [];
  referencedFinancialConceptList: FinancialConceptDescriptor[] = [];

  externalVariableSetList: Identifiable[] = [];
  externalVariableList: ExternalVariable[] = [];

  accountList$: Observable<AccountDescriptor[]>;
  accountInput$ = new Subject<string>();
  accountMinTermLength = 1;
  accountLoading = false;

  subledgerAccountList$: Observable<SubledgerAccountDescriptor[]>;
  subledgerAccountInput$ = new Subject<string>();
  subledgerAccountMinTermLength = 4;
  subledgerAccountLoading = false;

  private unsubscribeReferencedGroupUID: Subject<void> = new Subject();
  private unsubscribeExternalVariableSetUID: Subject<void> = new Subject();


  constructor(private uiLayer: PresentationLayer,
              private financialConceptsData: FinancialConceptsDataService,
              private externalVariablesData: ExternalVariablesDataService,
              private accountsChartData: AccountsChartDataService,
              private subledgerData: SubledgerDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
  }


  ngOnInit(): void {
    this.loadDataLists();
    this.subscribeAccountList();
    this.subscribeSubledgerAccountList();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.financialConceptEntry) {
      this.editionMode = !isEmpty(this.financialConceptEntry);

      if (this.editionMode) {
        this.setAndValidateFormData();
      }
    }

    if (changes.financialConcept) {
      this.setPositionRuleListAndDefaultValue();
    }
  }


  ngOnDestroy() {
    this.helper.destroy();

    this.unsubscribeReferencedGroupUID.next();
    this.unsubscribeReferencedGroupUID.complete();

    this.unsubscribeExternalVariableSetUID.next();
    this.unsubscribeExternalVariableSetUID.complete();
  }


  get isFinancialConceptReferenceType(): boolean {
    return FinancialConceptEntryType.FinancialConceptReference ===
      this.formHandler.getControl(this.controls.entryType).value;
  }


  get isExternalVariableType(): boolean {
    return FinancialConceptEntryType.ExternalVariable ===
      this.formHandler.getControl(this.controls.entryType).value;
  }


  get isAccountType(): boolean {
    return FinancialConceptEntryType.Account === this.formHandler.getControl(this.controls.entryType).value;
  }


  get displayPositioningOffsetConcept(): boolean {
    return [PositioningRule.AfterOffset, PositioningRule.BeforeOffset]
             .includes(this.formHandler.getControl(this.controls.positioningRule).value);
  }


  get displayPosition(): boolean {
    return PositioningRule.ByPositionValue ===
      this.formHandler.getControl(this.controls.positioningRule).value;
  }


  onClose() {
    sendEvent(this.financialConceptEntryEditorEvent, FinancialConceptEntryEditorEventType.CLOSE_MODAL_CLICKED);
  }


  onEntryTypeChanged() {
    this.setControlConfig(this.controls.referencedGroup, this.isFinancialConceptReferenceType);
    this.setControlConfig(this.controls.referencedFinancialConcept, this.isFinancialConceptReferenceType);

    this.setControlConfig(this.controls.externalVariableSet, this.isExternalVariableType);
    this.setControlConfig(this.controls.externalVariable, this.isExternalVariableType);

    this.setControlConfig(this.controls.account, this.isAccountType);
  }


  onPositioningRuleChanged() {
    this.setControlConfig(this.controls.positioningOffsetEntryUID, this.displayPositioningOffsetConcept);
    this.setControlConfig(this.controls.position, this.displayPosition);
  }


  onClearAccount() {
    this.subscribeAccountList();
  }


  onClearSubledgerAccount() {
    this.subscribeSubledgerAccountList();
  }


  onSubmitDataClicked() {
    if (!this.formHandler.isReadyForSubmit) {
      this.formHandler.invalidateForm();
      return;
    }

    const eventType = this.isSaved ? FinancialConceptEntryEditorEventType.UPDATE_ENTRY :
      FinancialConceptEntryEditorEventType.INSERT_ENTRY;

    const payload = {
      command: this.getFinancialConceptEntryEditionCommand(),
    };

    sendEvent(this.financialConceptEntryEditorEvent, eventType, payload);
  }


  private loadDataLists() {
    this.isLoadingDataLists = true;

    combineLatest([
      this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
      this.helper.select<FinancialConceptsGroup[]>(FinancialConceptsStateSelector.FINANCIAL_CONCEPTS_GROUPS_LIST)
    ])
    .subscribe(([x, y]) => {
      this.selectedAccountChart = x.find(z => z.uid === this.financialConcept.accountsChart.uid) ?? null;

      this.referencedGroupList = y.filter(z => z.accountsChart.uid === this.financialConcept.accountsChart.uid);
      this.selectedGroup = y.find(z => z.uid === this.financialConcept.group.uid) ?? null;

      this.isLoadingDataLists = false;
    });
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        entryType: new FormControl(FinancialConceptEntryType.FinancialConceptReference, Validators.required),
        referencedGroup: new FormControl('', Validators.required),
        referencedFinancialConcept: new FormControl('', Validators.required),
        externalVariableSet: new FormControl(''),
        externalVariable: new FormControl(''),
        account: new FormControl(''),
        subledgerAccount: new FormControl(''),
        sector: new FormControl(''),
        currency: new FormControl(''),
        positioningRule: new FormControl(PositioningRule.AtEnd, Validators.required),
        positioningOffsetEntryUID: new FormControl(''),
        position: new FormControl(''),
        operator: new FormControl('', Validators.required),
        calculationRule: new FormControl('', Validators.required),
        dataColumn: new FormControl('', Validators.required),
      })
    );

    this.onSuscribeReferencedGroupChanges();
    this.onSuscribeExternalVariableSetChanges();
  }


  private onSuscribeReferencedGroupChanges() {
    this.formHandler.getControl(this.controls.referencedGroup).valueChanges
      .pipe(
        takeUntil(this.unsubscribeReferencedGroupUID),
        filter(groupUID => !!groupUID),
        distinctUntilChanged(),
        tap(() => {
          this.resetReferencedFinancialConceptData()
          this.isLoadingReferencedFinancialConcepts = true;
        }),
        switchMap(groupUID =>
          this.financialConceptsData.getFinancialConceptsInGroup(groupUID, this.queryDate)
          .pipe(
            catchError(() => of([])),
            tap(() => this.isLoadingReferencedFinancialConcepts = false)
          )),
      )
    .subscribe(x => this.referencedFinancialConceptList = x);
  }


  private onSuscribeExternalVariableSetChanges() {
    this.formHandler.getControl(this.controls.externalVariableSet).valueChanges
      .pipe(
        takeUntil(this.unsubscribeExternalVariableSetUID),
        filter(setUID => !!setUID),
        distinctUntilChanged(),
        tap(() => {
          this.resetExternalVariableData()
          this.isLoadingExternalVariable = true;
        }),
        switchMap(setUID => this.externalVariablesData.getExternalVariables(setUID)
          .pipe(
            catchError(() => of([])),
            tap(() => this.isLoadingExternalVariable = false)
          )),
      )
    .subscribe(x => this.externalVariableList = x);
  }


  private resetReferencedFinancialConceptData() {
    this.formHandler.getControl(this.controls.referencedFinancialConcept).reset();
    this.referencedFinancialConceptList = [];
  }


  private resetExternalVariableData() {
    this.formHandler.getControl(this.controls.externalVariable).reset();
    this.externalVariableList = [];
  }


  private setAndValidateFormData() {
    this.setFormData();
    this.subscribeAccountList();
    this.subscribeSubledgerAccountList();
  }


  private setFormData() {
    this.formHandler.form.reset({
      entryType: this.financialConceptEntry.type || '',
      operator: this.financialConceptEntry.operator || '',
      calculationRule: this.financialConceptEntry.calculationRule || '',
      dataColumn: this.financialConceptEntry.dataColumn || '',
      positioningRule: this.financialConceptEntry.positioning.rule || '',
      positioningOffsetEntryUID: this.financialConceptEntry.positioning.offsetUID || '',
      position: this.financialConceptEntry.positioning.position || '',
    });

    this.setAccountDataFromLists();
    this.setExternalVariableData();
    this.setFinancialConceptReferenceData();

    this.onEntryTypeChanged();
    this.formHandler.disableControl(this.controls.entryType);
  }


  private setAccountDataFromLists() {
    if (this.isAccountType) {
      const account = !!this.financialConceptEntry?.account?.uid ? this.financialConceptEntry.account : null;
      const subledgerAccount = !!this.financialConceptEntry?.subledgerAccount?.id ?
        this.financialConceptEntry.subledgerAccount : null;

      this.formHandler.getControl(this.controls.account).reset(account);
      this.formHandler.getControl(this.controls.subledgerAccount).reset(subledgerAccount);
      this.formHandler.getControl(this.controls.sector).reset(this.financialConceptEntry.sectorCode);
      this.formHandler.getControl(this.controls.currency).reset(this.financialConceptEntry.currencyCode);
    }
  }


  private setExternalVariableData() {
    if (this.isExternalVariableType) {
      this.formHandler.getControl(this.controls.externalVariableSet)
        .reset(this.financialConceptEntry.externalVariable.setUID ?? '');
      this.formHandler.getControl(this.controls.externalVariable)
        .reset(this.financialConceptEntry.externalVariable.code ?? '');
    }
  }


  private setFinancialConceptReferenceData() {
    if (this.isFinancialConceptReferenceType) {
      this.formHandler.getControl(this.controls.referencedGroup)
        .reset(this.financialConceptEntry.referencedFinancialConcept.group.uid);
      this.formHandler.getControl(this.controls.referencedFinancialConcept)
        .reset(this.financialConceptEntry.referencedFinancialConcept);
    }
  }


  private getFinancialConceptEntryEditionCommand() {
    const command: FinancialConceptEntryEditionCommand = {
      type: this.getCommandType(),
      dryRun: true,
      payload: this.getFormData(),
    };

    return command;
  }


  private getCommandType(): FinancialConceptEntryEditionType {
    if (this.isAccountType) {
      return this.isSaved ?  FinancialConceptEntryEditionType.UpdateAccountRule :
        FinancialConceptEntryEditionType.InsertAccountRule;
    }

    if (this.isExternalVariableType) {
      return this.isSaved ?  FinancialConceptEntryEditionType.UpdateExternalValueRule :
        FinancialConceptEntryEditionType.InsertExternalValueRule;
    }

    if (this.isFinancialConceptReferenceType) {
      return this.isSaved ?  FinancialConceptEntryEditionType.UpdateConceptReferenceRule :
        FinancialConceptEntryEditionType.InsertConceptReferenceRule;
    }

    return null;
  }


  private getFormData(): FinancialConceptEntryFields {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    let data: FinancialConceptEntryFields = {
      operator: formModel.operator ?? '',
      calculationRule: formModel.calculationRule ?? '',
      dataColumn: formModel.dataColumn ?? '',
    };

    this.validateFieldsByEntryType(data);
    this.validatePositionsFields(data);

    return data;
  }


  private validateFieldsByEntryType(data: FinancialConceptEntryFields) {
    const formModel = this.formHandler.form.getRawValue();

    if (this.isFinancialConceptReferenceType) {
      data.referencedFinancialConceptUID = formModel.referencedFinancialConcept?.uid ?? '';
    }

    if (this.isExternalVariableType) {
      data.externalVariableCode = formModel.externalVariable ?? '';
    }

    if (this.isAccountType) {
      data.accountNumber = formModel.account?.number ?? '';
      data.subledgerAccountNumber = formModel.subledgerAccount?.number ?? '';
      data.sectorCode = formModel.sector ?? '';
      data.currencyCode = formModel.currency ?? '';
    }
  }


  private validatePositionsFields(data: FinancialConceptEntryFields) {
    const formModel = this.formHandler.form.getRawValue();

    const positioning: Positioning = {
      rule: formModel.positioningRule ?? '',
    }

    if (this.displayPositioningOffsetConcept) {
      positioning.offsetUID = formModel.positioningOffsetEntryUID;
    }

    if (this.displayPosition) {
      positioning.position = +formModel.position;
    }

    data.positioning = positioning;
  }


  private setPositionRuleListAndDefaultValue() {
    const hasRules = this.financialConcept.integration.length > 0;

    if (hasRules) {
      this.positioningRuleList = [...[], ...PositioningRuleList];
    } else {
      this.positioningRuleList = PositioningRuleList.filter(x => x.uid === PositioningRule.AtStart);
    }

    if (!this.isSaved) {
      const positioningRule = hasRules ? PositioningRule.AtEnd : PositioningRule.AtStart;
      this.formHandler.getControl(this.controls.positioningRule).reset(positioningRule);
    }
  }


  private subscribeAccountList() {
    this.accountList$ = concat(
      of(this.getDefaultAccountList()),
      this.accountInput$.pipe(
        filter(keywords => keywords !== null && keywords.length >= this.accountMinTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.accountLoading = true),
        switchMap(keywords =>
          this.accountsChartData.searchAccounts(this.financialConcept.accountsChart.uid,
                                                this.getAccountsQuery(keywords))
          .pipe(
            map(x => x.accounts),
            catchError(() => of([])),
            tap(() => this.accountLoading = false)
        ))
      )
    );
  }


  private subscribeSubledgerAccountList() {
    this.subledgerAccountList$ = concat(
      of(this.getDefaultSubledgerAccountList()),
      this.subledgerAccountInput$.pipe(
        filter(keywords => keywords !== null && keywords.length >= this.subledgerAccountMinTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.subledgerAccountLoading = true),
        switchMap(keywords =>
          this.subledgerData.searchSubledgerAccounts(this.getSubledgerAccountQuery(keywords))
          .pipe(
            catchError(() => of([])),
            tap(() => this.subledgerAccountLoading = false)
        ))
      )
    );
  }


  private getDefaultAccountList(): any[] {
    if (!this.isSaved || !this.financialConceptEntry?.account?.uid) {
      return [];
    }
    return [this.financialConceptEntry.account];
  }


  private getDefaultSubledgerAccountList(): any[] {
    if (!this.isSaved || !this.financialConceptEntry?.subledgerAccount?.id) {
      return [];
    }
    return [this.financialConceptEntry.subledgerAccount];
  }


  private getAccountsQuery(keywords: string): AccountsQuery {
    const query: AccountsQuery = {
      keywords,
    };
    return query;
  }


  private getSubledgerAccountQuery(keywords: string): SubledgerAccountQuery {
    const query: SubledgerAccountQuery = {
      accountsChartUID: this.financialConcept.accountsChart.uid,
      keywords,
    };
    return query;
  }


  private setControlConfig(control: FinancialConceptEntryEditorFormControls, required: boolean) {
      if (required) {
      this.formHandler.setControlValidators(control, Validators.required);
    } else {
      this.formHandler.clearControlValidators(control);
    }
  }

}
