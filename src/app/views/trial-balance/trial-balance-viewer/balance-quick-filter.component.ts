/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { DateString, DateStringLibrary, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, BalanceCommand, BalanceTypes, BalanceTypeList,
         getEmptyBalanceCommand } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

export enum BalanceQuickFilterEventType {
  BUILD_BALANCE_CLICKED = 'BalanceQuickFilterComponent.Event.BuildBalanceClicked',
  CLEAR_BALANCE_CLICKED = 'BalanceQuickFilterComponent.Event.ClearBalanceClicked',
}

@Component({
  selector: 'emp-fa-balance-quick-filter',
  templateUrl: './balance-quick-filter.component.html',
})
export class BalanceQuickFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() balanceCommand: BalanceCommand = getEmptyBalanceCommand();

  @Output() balanceQuickFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    accountsChartUID: '',
    trialBalanceType: '',
    balancesType: '',
    fromAccount: '',
    fromDate: null,
    toDate: null,
    subledgerAccount: '',
    withSubledgerAccount: false,
    withAllAccounts: false,
  };

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  balanceTypeList: Identifiable[] = BalanceTypeList ?? [];

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.initFormData();
    this.setDefaultFields();
  }


  ngOnInit() {
    this.loadAccountsCharts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get trialBalanceTypeSelected(): Identifiable {
    return !this.formData.trialBalanceType ? null :
      this.balanceTypeList.find(x => x.uid === this.formData.trialBalanceType);
  }


  get displayFromAccount(): boolean {
    return this.formData.trialBalanceType === BalanceTypes.SaldosPorCuentaConsultaRapida;
  }


  get displaySubledgerAccount(): boolean {
    return this.formData.trialBalanceType === BalanceTypes.SaldosPorAuxiliarConsultaRapida;
  }


  get displayWithSubledgerAccount(): boolean {
    return this.formData.trialBalanceType === BalanceTypes.SaldosPorCuentaConsultaRapida;
  }


  onBalanceTypeChange() {
    this.formData.fromAccount = '';
    this.formData.subledgerAccount = '';
    this.formData.withSubledgerAccount = this.displaySubledgerAccount;
    this.formData.withAllAccounts = false;
  }


  onDatepickerInitialPeriodToDateChange(toDate: DateString) {
    this.validateValueOfInitPeriodFromDate(toDate);
  }


  onBuildBalanceClicked() {
    const payload = {
      trialBalanceType: this.trialBalanceTypeSelected,
      balanceCommand: this.getBalanceCommandData(),
    };

    sendEvent(this.balanceQuickFilterEvent, BalanceQuickFilterEventType.BUILD_BALANCE_CLICKED, payload);
  }


  onClearFilters() {
    sendEvent(this.balanceQuickFilterEvent, BalanceQuickFilterEventType.CLEAR_BALANCE_CLICKED);
  }


  private loadAccountsCharts() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x ?? [];
        this.setDefaultFields();
        this.isLoading = false;
      });
  }


  private initFormData() {
    this.formData = {
      accountsChartUID: this.balanceCommand.accountsChartUID,
      trialBalanceType: this.balanceCommand.trialBalanceType,
      balancesType: this.balanceCommand.balancesType,
      fromAccount: this.balanceCommand.fromAccount,
      fromDate: this.balanceCommand.initialPeriod.fromDate,
      toDate: this.balanceCommand.initialPeriod.toDate,
      subledgerAccount: this.balanceCommand.subledgerAccount,
      withSubledgerAccount: this.balanceCommand.withSubledgerAccount,
      withAllAccounts: this.balanceCommand.withAllAccounts,
    };
  }


  private setDefaultFields() {
    if (!this.formData.accountsChartUID) {
      this.formData.accountsChartUID = this.accountsChartMasterDataList[0] ?
        this.accountsChartMasterDataList[0].uid : null;
      this.formData.trialBalanceType = this.balanceTypeList[0] ?
        this.balanceTypeList[0].uid as BalanceTypes : null;

      this.formData.toDate = DateStringLibrary.today();
      this.validateValueOfInitPeriodFromDate(this.formData.toDate);
    }
  }


  private validateValueOfInitPeriodFromDate(toDate: DateString) {
    this.formData.fromDate = DateStringLibrary.getFirstDayOfMonthFromDateString(toDate);
  }


  private getBalanceCommandData(): BalanceCommand {
    const data: BalanceCommand = {
      accountsChartUID: this.formData.accountsChartUID,
      trialBalanceType: this.formData.trialBalanceType as BalanceTypes,
      fromAccount: this.formData.fromAccount,
      subledgerAccount: this.formData.subledgerAccount,
      initialPeriod: {
        fromDate: this.formData.fromDate,
        toDate: this.formData.toDate,
      },
      withSubledgerAccount: this.formData.withSubledgerAccount,
      withAllAccounts: this.formData.withAllAccounts,
    };

    return data;
  }

}
