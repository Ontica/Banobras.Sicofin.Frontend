/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { DateStringLibrary, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, BalanceExplorerQuery, BalanceExplorerTypes, FileReportVersion,
         emptyBalanceExplorerQuery, ReportType, ReportTypeFlags, ReportGroup } from '@app/models';

import { AccountChartStateSelector,
         ReportingStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

export enum BalanceFilterEventType {
  BUILD_BALANCE_CLICKED = 'BalanceFilterComponent.Event.BuildBalanceClicked',
  CLEAR_BALANCE_CLICKED = 'BalanceFilterComponent.Event.ClearBalanceClicked',
}

@Component({
  selector: 'emp-fa-balance-filter',
  templateUrl: './balance-filter.component.html',
})
export class BalanceFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() balancesQuery: BalanceExplorerQuery = emptyBalanceExplorerQuery();

  @Output() balanceFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    trialBalanceType: '',
    accountsChartUID: '',
    ledgers: [],
    balancesType: '',
    accounts: [],
    subledgerAccounts: [],
    toDate: null,
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
  }


  ngOnInit() {
    this.loadAccountsCharts();
    this.loadReportTypes();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isQueryExecuted(): boolean {
    return !!this.balancesQuery.accountsChartUID && !!this.balancesQuery.trialBalanceType;
  }


  get trialBalanceTypeSelected(): ReportType<ReportTypeFlags> {
    return !this.formData.trialBalanceType ? null :
      this.reportTypeList.find(x => x.uid === this.formData.trialBalanceType);
  }


  get accountChartSelected(): AccountsChartMasterData {
    return !this.formData.accountsChartUID ? null :
      this.accountsChartMasterDataList.find(x => x.uid === this.formData.accountsChartUID);
  }


  get displayAccounts(): boolean {
    return this.formData.trialBalanceType === BalanceExplorerTypes.SaldosPorCuentaConsultaRapida;
  }


  get displaySubledgerAccounts(): boolean {
    return this.formData.trialBalanceType === BalanceExplorerTypes.SaldosPorAuxiliarConsultaRapida;
  }


  get displayWithSubledgerAccount(): boolean {
    return this.formData.trialBalanceType === BalanceExplorerTypes.SaldosPorCuentaConsultaRapida;
  }


  onAccountChartChanges() {
    this.validateLedgersToClear();
  }


  onBalanceTypeChange() {
    this.formData.accounts = [];
    this.formData.subledgerAccounts = [];
    this.formData.withSubledgerAccount = this.displaySubledgerAccounts;
    this.formData.withAllAccounts = false;
  }


  onBuildBalanceClicked() {
    const payload = {
      reportType: this.trialBalanceTypeSelected,
      query: this.getBalancesQuery(),
    };

    sendEvent(this.balanceFilterEvent, BalanceFilterEventType.BUILD_BALANCE_CLICKED, payload);
  }


  onClearFilters() {
    sendEvent(this.balanceFilterEvent, BalanceFilterEventType.CLEAR_BALANCE_CLICKED);
  }


  private loadAccountsCharts() {
    this.isLoadingAccountsCharts = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x ?? [];
        this.setDefaultAccountsChart();
        this.isLoadingAccountsCharts = false;
      });
  }


  private loadReportTypes() {
    this.isLoadingReportTypes = true;

    this.helper.select<ReportType<ReportTypeFlags>[]>(ReportingStateSelector.REPORT_TYPES_LIST)
    .subscribe(x => {
      this.reportTypeList = x.filter(y => y.group === ReportGroup.ExploradorSaldos);
      this.setDefaultReportType();
      this.isLoadingReportTypes = false;
    });
  }


  private initFormData() {
    this.formData = {
      trialBalanceType: this.balancesQuery.trialBalanceType,
      accountsChartUID: this.balancesQuery.accountsChartUID,
      ledgers: this.balancesQuery.ledgers,
      balancesType: this.balancesQuery.balancesType,
      accounts: this.balancesQuery.accounts ?? [],
      subledgerAccounts: this.balancesQuery.subledgerAccounts ?? [],
      toDate: this.balancesQuery.initialPeriod.toDate,
      withSubledgerAccount: this.balancesQuery.withSubledgerAccount,
      withAllAccounts: this.balancesQuery.withAllAccounts,
    };

    this.setDefaultAccountsChart();
    this.setDefaultReportType();
    this.setDefaultDates();
  }


  private setDefaultAccountsChart() {
    if (!this.isQueryExecuted) {
      this.formData.accountsChartUID = this.accountsChartMasterDataList[0] ?
        this.accountsChartMasterDataList[0].uid : null;
    }
  }


  private setDefaultReportType() {
    if (!this.isQueryExecuted) {
      this.formData.trialBalanceType = this.reportTypeList[0] ?
        this.reportTypeList[0].uid as BalanceExplorerTypes : null;
    }
  }


  private setDefaultDates() {
    if (!this.isQueryExecuted) {
      this.formData.toDate = DateStringLibrary.today();
    }
  }


  private validateLedgersToClear() {
    this.formData.ledgers = this.accountChartSelected.ledgers
      .filter(x => this.formData.ledgers.includes(x.uid))
      .map(x => x.uid);
  }


  private getBalancesQuery(): BalanceExplorerQuery {
    const query: BalanceExplorerQuery = {
      trialBalanceType: this.formData.trialBalanceType as BalanceExplorerTypes,
      accountsChartUID: this.formData.accountsChartUID,
      ledgers: this.formData.ledgers,
      initialPeriod: {
        fromDate: DateStringLibrary.getFirstDayOfMonthFromDateString(this.formData.toDate),
        toDate: this.formData.toDate,
      },
      withSubledgerAccount: this.formData.withSubledgerAccount,
      withAllAccounts: this.formData.withAllAccounts,
      exportTo: FileReportVersion.V2,
    };

    this.validateBalanceQueryFields(query);

    return query;
  }


  private validateBalanceQueryFields(query: BalanceExplorerQuery) {
    if (this.displayAccounts) {
      query.accounts =this.formData.accounts;
    }

    if (this.displaySubledgerAccounts) {
      query.subledgerAccounts = this.formData.subledgerAccounts;
    }
  }

}
