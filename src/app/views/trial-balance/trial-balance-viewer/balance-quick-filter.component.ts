/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { DateString, DateStringLibrary, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, BalanceExplorerQuery, BalanceExplorerTypes, FileReportVersion,
         emptyBalanceExplorerQuery, ReportType, ReportTypeFlags, ReportGroup } from '@app/models';

import { AccountChartStateSelector, ReportingStateSelector } from '@app/presentation/exported.presentation.types';

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

  @Input() balancesQuery: BalanceExplorerQuery = emptyBalanceExplorerQuery();

  @Output() balanceQuickFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    trialBalanceType: '',
    accountsChartUID: '',
    ledgers: [],
    balancesType: '',
    fromAccount: '',
    fromDate: null,
    toDate: null,
    subledgerAccount: '',
    withSubledgerAccount: false,
    withAllAccounts: false,
  };

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  reportTypeList: ReportType<ReportTypeFlags>[] = [];

  isLoadingAccountsCharts = false;

  isLoadingReportTypes = false;

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
    this.loadReportTypes();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get trialBalanceTypeSelected(): ReportType<ReportTypeFlags> {
    return !this.formData.trialBalanceType ? null :
      this.reportTypeList.find(x => x.uid === this.formData.trialBalanceType);
  }


  get accountChartSelected(): AccountsChartMasterData {
    return !this.formData.accountsChartUID ? null :
      this.accountsChartMasterDataList.find(x => x.uid === this.formData.accountsChartUID);
  }


  get displayFromAccount(): boolean {
    return this.formData.trialBalanceType === BalanceExplorerTypes.SaldosPorCuentaConsultaRapida;
  }


  get displaySubledgerAccount(): boolean {
    return this.formData.trialBalanceType === BalanceExplorerTypes.SaldosPorAuxiliarConsultaRapida;
  }


  get displayWithSubledgerAccount(): boolean {
    return this.formData.trialBalanceType === BalanceExplorerTypes.SaldosPorCuentaConsultaRapida;
  }


  onAccountChartChanges() {
    this.validateLedgersToClear();
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
      reportType: this.trialBalanceTypeSelected,
      query: this.getBalancesQuery(),
    };

    sendEvent(this.balanceQuickFilterEvent, BalanceQuickFilterEventType.BUILD_BALANCE_CLICKED, payload);
  }


  onClearFilters() {
    sendEvent(this.balanceQuickFilterEvent, BalanceQuickFilterEventType.CLEAR_BALANCE_CLICKED);
  }


  private loadAccountsCharts() {
    this.isLoadingAccountsCharts = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x ?? [];
        this.setDefaultFields();
        this.isLoadingAccountsCharts = false;
      });
  }


  private loadReportTypes() {
    this.isLoadingReportTypes = true;

    this.helper.select<ReportType<ReportTypeFlags>[]>(ReportingStateSelector.REPORT_TYPES_LIST)
    .subscribe(x => {
      this.reportTypeList = x.filter(y => y.group === ReportGroup.ExploradorSaldos);
      this.isLoadingReportTypes = false;
    });
  }


  private initFormData() {
    this.formData = {
      trialBalanceType: this.balancesQuery.trialBalanceType,
      accountsChartUID: this.balancesQuery.accountsChartUID,
      ledgers: this.balancesQuery.ledgers,
      balancesType: this.balancesQuery.balancesType,
      fromAccount: this.balancesQuery.fromAccount,
      fromDate: this.balancesQuery.initialPeriod.fromDate,
      toDate: this.balancesQuery.initialPeriod.toDate,
      subledgerAccount: this.balancesQuery.subledgerAccount,
      withSubledgerAccount: this.balancesQuery.withSubledgerAccount,
      withAllAccounts: this.balancesQuery.withAllAccounts,
    };
  }


  private setDefaultFields() {
    if (!this.formData.accountsChartUID) {
      this.formData.accountsChartUID = this.accountsChartMasterDataList[0] ?
        this.accountsChartMasterDataList[0].uid : null;
      this.formData.trialBalanceType = this.reportTypeList[0] ?
        this.reportTypeList[0].uid as BalanceExplorerTypes : null;

      this.formData.toDate = DateStringLibrary.today();
      this.validateValueOfInitPeriodFromDate(this.formData.toDate);
    }
  }


  private validateValueOfInitPeriodFromDate(toDate: DateString) {
    this.formData.fromDate = DateStringLibrary.getFirstDayOfMonthFromDateString(toDate);
  }


  private validateLedgersToClear() {
    this.formData.ledgers = this.accountChartSelected.ledgers
      .filter(x => this.formData.ledgers.includes(x.uid))
      .map(x => x.uid);
  }


  private getBalancesQuery(): BalanceExplorerQuery {
    const data: BalanceExplorerQuery = {
      trialBalanceType: this.formData.trialBalanceType as BalanceExplorerTypes,
      accountsChartUID: this.formData.accountsChartUID,
      ledgers: this.formData.ledgers,
      fromAccount: this.formData.fromAccount,
      subledgerAccount: this.formData.subledgerAccount,
      initialPeriod: {
        fromDate: this.formData.fromDate,
        toDate: this.formData.toDate,
      },
      withSubledgerAccount: this.formData.withSubledgerAccount,
      withAllAccounts: this.formData.withAllAccounts,
      exportTo: FileReportVersion.V2,
    };

    return data;
  }

}
