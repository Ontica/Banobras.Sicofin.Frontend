/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Assertion, DateString, DateStringLibrary, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { ExchangeRatesDataService } from '@app/data-services';

import { AccountsChartMasterData, getEmptyTrialBalanceQuery, getLevelsListFromPattern,
         mapToValidBalancePeriod, resetExchangeRateValues, TrialBalanceQuery,  BalancePeriod,
         TrialBalanceTypes, BalancesTypeForBalanceList, BalancesTypeForTrialBalanceList, ReportType,
         ReportTypeFlags, EmtyAccountsChartMasterData, ReportGroup } from '@app/models';

import { AccountChartStateSelector,
         ReportingStateSelector } from '@app/presentation/exported.presentation.types';

import { expandCollapse } from '@app/shared/animations/animations';

import { sendEvent } from '@app/shared/utils';

import { ExchangeRateSelectorEventType } from '../exchange-rate-selector/exchange-rate-selector.component';

export enum TrialBalanceFilterEventType {
  BUILD_TRIAL_BALANCE_CLICKED = 'TrialBalanceFilterComponent.Event.BuildTrialBalanceClicked',
  CLEAR_TRIAL_BALANCE_CLICKED = 'TrialBalanceFilterComponent.Event.ClearTrialBalanceClicked',
}

@Component({
  selector: 'emp-fa-trial-balance-filter',
  templateUrl: './trial-balance-filter.component.html',
  animations: [expandCollapse],
})
export class TrialBalanceFilterComponent implements OnInit, OnDestroy {

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() trialBalanceFilterEvent = new EventEmitter<EventInfo>();

  accountChartSelected: AccountsChartMasterData = null;

  query: TrialBalanceQuery = getEmptyTrialBalanceQuery();

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  reportTypeList: ReportType<ReportTypeFlags>[] = [];

  levelsList: Identifiable[] = [];

  balancesTypeList: Identifiable[] = [];

  isLoadingAccountsCharts = false;

  isLoadingReportTypes = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private exchangeRatesData: ExchangeRatesDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.loadAccountsCharts();
    this.loadReportTypes();
    this.setBalancesTypeList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get trialBalanceTypeSelected(): ReportType<ReportTypeFlags> {
    return !this.query.trialBalanceType ? null :
      this.reportTypeList.find(x => x.uid === this.query.trialBalanceType);
  }


  get isBalanceSelected(): boolean {
    return [TrialBalanceTypes.SaldosPorCuenta,
            TrialBalanceTypes.SaldosPorAuxiliar].includes(this.query.trialBalanceType);
  }


  get exchangeRatesDisabled(): boolean {
    return [TrialBalanceTypes.AnaliticoDeCuentas,
            TrialBalanceTypes.BalanzaDolarizada,
            TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.ValorizacionEstimacionPreventiva].includes(this.query.trialBalanceType);
  }


  get exchangeRatesRequired(): boolean {
    return [TrialBalanceTypes.AnaliticoDeCuentas,
            TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.BalanzaDolarizada].includes(this.query.trialBalanceType);
  }


  get useDefaultValuationDisabled(): boolean {
    return [TrialBalanceTypes.BalanzaDolarizada].includes(this.query.trialBalanceType);
  }


  get showConsolidateBalancesToTargetCurrency(): boolean {
    return ![TrialBalanceTypes.BalanzaEnColumnasPorMoneda].includes(this.query.trialBalanceType);
  }


  get showCascadeBalancesDisabled(): boolean {
    return [TrialBalanceTypes.BalanzaConContabilidadesEnCascada,
            TrialBalanceTypes.BalanzaDolarizada,
            TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
            TrialBalanceTypes.SaldosPorAuxiliar,
            TrialBalanceTypes.ValorizacionEstimacionPreventiva].includes(this.query.trialBalanceType);
  }


  get showCascadeBalancesRequired(): boolean {
    return [TrialBalanceTypes.BalanzaConContabilidadesEnCascada,
            TrialBalanceTypes.SaldosPorAuxiliar].includes(this.query.trialBalanceType);
  }


  get withSubledgerAccountDisabled(): boolean {
    return [TrialBalanceTypes.BalanzaConContabilidadesEnCascada,
            TrialBalanceTypes.BalanzaDolarizada,
            TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
            TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.SaldosPorAuxiliar,
            TrialBalanceTypes.ValorizacionEstimacionPreventiva].includes(this.query.trialBalanceType);
  }


  get withSubledgerAccountRequired(): boolean {
    return [TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.SaldosPorAuxiliar].includes(this.query.trialBalanceType);
  }


  get periodsRequired(): boolean {
    return [TrialBalanceTypes.BalanzaValorizadaComparativa]
            .includes(this.query.trialBalanceType);
  }


  get displayInitialPeriod(): boolean {
    return !this.isBalanceSelected &&
           ![TrialBalanceTypes.ValorizacionEstimacionPreventiva].includes(this.query.trialBalanceType);
  }


  get displaySubledgerAccount(): boolean {
    return this.isBalanceSelected;
  }


  get displayToAccount(): boolean {
    return [TrialBalanceTypes.AnaliticoDeCuentas,
            TrialBalanceTypes.Balanza,
            TrialBalanceTypes.BalanzaConContabilidadesEnCascada,
            TrialBalanceTypes.BalanzaDolarizada,
            TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
            TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.ValorizacionEstimacionPreventiva].includes(this.query.trialBalanceType);
  }


  get displayLevel(): boolean {
    return ![TrialBalanceTypes.BalanzaConContabilidadesEnCascada,
             TrialBalanceTypes.BalanzaDolarizada,
             TrialBalanceTypes.ValorizacionEstimacionPreventiva].includes(this.query.trialBalanceType);
  }


  get displayWithAverageBalance(): boolean {
    return ![TrialBalanceTypes.BalanzaDolarizada,
             TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
             TrialBalanceTypes.ValorizacionEstimacionPreventiva].includes(this.query.trialBalanceType);
  }


  get displayWithSectorization(): boolean {
    return [TrialBalanceTypes.AnaliticoDeCuentas,
            TrialBalanceTypes.Balanza].includes(this.query.trialBalanceType);
  }


  get trialBalanceFormFieldsValid(): boolean {
    return !!this.query.trialBalanceType && !!this.query.accountsChartUID &&
           this.initalPeriodDatesValid && this.finalPeriodDatesValid &&
           !!this.query.balancesType;
  }


  get initalPeriodDatesValid(): boolean {
    if (this.displayInitialPeriod) {
      return !!this.query.initialPeriod.fromDate &&
             !!this.query.initialPeriod.toDate;
    }

    return !!this.query.initialPeriod.toDate;
  }


  get finalPeriodDatesValid(): boolean {
    return !this.periodsRequired ? true :
           !!this.query.finalPeriod.fromDate &&
           !!this.query.finalPeriod.toDate;
  }


  get initialPeriodExchangeRateValid(): boolean  {
    return this.query.useDefaultValuation ? true :
      !!this.query.initialPeriod.exchangeRateDate &&
      !!this.query.initialPeriod.exchangeRateTypeUID &&
      !!this.query.initialPeriod.valuateToCurrrencyUID;
  }


  get finalPeriodExchangeRateValid(): boolean {
    return this.query.useDefaultValuation ? true :
      !!this.query.finalPeriod.exchangeRateTypeUID &&
      !!this.query.finalPeriod.exchangeRateDate &&
      !!this.query.finalPeriod.valuateToCurrrencyUID;
  }


  get exchangeRateFormFieldsValid(): boolean {
    if (!this.query.useValuation) {
      return true;
    }

    return this.periodsRequired ? this.initialPeriodExchangeRateValid && this.finalPeriodExchangeRateValid :
      this.initialPeriodExchangeRateValid;
  }


  onTrialBalanceTypeChange() {
    this.query.showCascadeBalances = this.showCascadeBalancesRequired;
    this.query.withSubledgerAccount = this.withSubledgerAccountRequired;

    this.query.useValuation = this.exchangeRatesRequired;
    this.query.useDefaultValuation = this.exchangeRatesRequired;

    this.validateValueOfInitPeriodFromDate(this.query.initialPeriod.toDate);
    this.setBalancesTypeList();
  }


  onShowFiltersClicked(){
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onAccountChartChanges(accountChart: AccountsChartMasterData) {
    this.accountChartSelected = accountChart;
    this.setLevelsList();
    this.validateFieldToClear();
  }


  onDatepickerInitialPeriodToDateChange(toDate: DateString) {
    this.validateValueOfInitPeriodFromDate(toDate);
  }


  onUseValuationChange() {
    this.query.useDefaultValuation = true;
    resetExchangeRateValues(this.query.initialPeriod);
    resetExchangeRateValues(this.query.finalPeriod);
  }


  onUseDefaultValuationChange(checked: boolean) {
    if (!checked && !this.showFilters) {
      this.onShowFiltersClicked();
    }
  }


  onExchangeRateDateChanged(period: BalancePeriod, date: DateString) {
    period.exchangeRatesList = [];
    period.exchangeRateDate = date;
  }


  onExchangeRateSelectorEvent(event, period: BalancePeriod) {
    if (ExchangeRateSelectorEventType.SEARCH_EXCHANGE_RATES_CLICKED === event.type) {
      this.getExchangeRatesForDate(period);
    }
  }


  getExchangeRatesForDate(period: BalancePeriod) {
    period.exchangeRatesList = [];

    if (!this.query.initialPeriod.exchangeRateDate) {
      return;
    }

    this.exchangeRatesData.getExchangeRatesForDate(period.exchangeRateDate)
      .subscribe(x => period.exchangeRatesList = x);
  }


  onClearFilters() {
    this.query = Object.assign({}, getEmptyTrialBalanceQuery(), {
      trialBalanceType: this.query.trialBalanceType,
      accountsChartUID: this.query.accountsChartUID,
      balancesType: this.balancesTypeList[0] ? this.balancesTypeList[0].uid : '',
      useValuation: this.exchangeRatesRequired,
      showCascadeBalances: this.showCascadeBalancesRequired,
      withSubledgerAccount: this.withSubledgerAccountRequired,
    });

    sendEvent(this.trialBalanceFilterEvent, TrialBalanceFilterEventType.CLEAR_TRIAL_BALANCE_CLICKED,
      {trialBalanceQuery: this.getTrialBalanceQueryData()});
  }


  onBuildTrialBalanceClicked() {
    Assertion.assert(this.trialBalanceFormFieldsValid,
      'Programming error: trialBalance form must be validated before query execution.');

    if (this.query.useValuation) {
      Assertion.assert(this.exchangeRateFormFieldsValid,
        'Programming error: exchangeRate form must be validated before query execution.');
    }

    const payload = {
      query: this.getTrialBalanceQueryData(),
      reportType: this.trialBalanceTypeSelected,
    };

    sendEvent(this.trialBalanceFilterEvent, TrialBalanceFilterEventType.BUILD_TRIAL_BALANCE_CLICKED, payload);
  }


  private loadAccountsCharts() {
    this.isLoadingAccountsCharts = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.setDefaultAccountsChartUID();
        this.setLevelsList();
        this.isLoadingAccountsCharts = false;
      });
  }


  private loadReportTypes() {
    this.isLoadingReportTypes = true;

    this.helper.select<ReportType<ReportTypeFlags>[]>(ReportingStateSelector.REPORT_TYPES_LIST)
    .subscribe(x => {
      this.reportTypeList = x.filter(x => x.group === ReportGroup.SaldosYBalanzas);
      this.isLoadingReportTypes = false;
    });
  }


  private setBalancesTypeList() {
    this.balancesTypeList = this.isBalanceSelected ?  BalancesTypeForBalanceList :
      BalancesTypeForTrialBalanceList;

    this.query.balancesType = this.balancesTypeList.length > 0 ? this.balancesTypeList[0].uid : '';
  }


  private setDefaultAccountsChartUID() {
    this.accountChartSelected = this.accountsChartMasterDataList.length > 0 ?
      this.accountsChartMasterDataList[0] : EmtyAccountsChartMasterData;
    this.query.accountsChartUID = this.accountChartSelected.uid;
  }


  private setLevelsList(){
    if (!this.accountChartSelected) {
      this.levelsList = [];
      return;
    }

    this.levelsList = getLevelsListFromPattern(this.accountChartSelected.accountsPattern,
                                               this.accountChartSelected.accountNumberSeparator,
                                               this.accountChartSelected.maxAccountLevel);
  }


  private validateFieldToClear() {
    this.query.ledgers = this.accountChartSelected.ledgers
      .filter(x => this.query.ledgers.includes(x.uid))
      .map(x => x.uid);

    this.query.level =
      this.levelsList.filter(x => this.query.level + '' === x.uid).length > 0 ?
      this.query.level : null;
  }


  private validateValueOfInitPeriodFromDate(toDate: DateString) {
    if (this.displayInitialPeriod) {
      return;
    }

    this.query.initialPeriod.fromDate =
      DateStringLibrary.getFirstDayOfMonthFromDateString(toDate);
  }


  private getTrialBalanceQueryData(): TrialBalanceQuery {
    const data: TrialBalanceQuery = {
      trialBalanceType: this.query.trialBalanceType,
      accountsChartUID: this.query.accountsChartUID,
      ledgers: this.query.ledgers,
      initialPeriod: {
        fromDate: this.query.initialPeriod.fromDate,
        toDate: this.query.initialPeriod.toDate,
      },
      fromAccount: this.query.fromAccount,
      showCascadeBalances: this.query.showCascadeBalances,
      balancesType: this.query.balancesType,
      useValuation: this.query.useValuation,
      useDefaultValuation: this.query.useValuation ? this.query.useDefaultValuation : false,
      withAverageBalance: this.displayWithAverageBalance ? this.query.withAverageBalance : false,
      withSectorization: this.displayWithSectorization ? this.query.withSectorization : false,
      withSubledgerAccount: this.query.withSubledgerAccount,
    };

    this.validateQueryFields(data);
    this.validateExchangeRatesFields(data);
    return data;
  }


  private validateQueryFields(data: TrialBalanceQuery) {
    if (this.displayToAccount) {
      data.toAccount = this.query.toAccount;
    }

    if (this.displaySubledgerAccount) {
      data.subledgerAccount = this.query.subledgerAccount;
    }

    if (this.displayLevel) {
      data.level = this.query.level;
    }
  }


  private validateExchangeRatesFields(data: TrialBalanceQuery) {
    if (this.query.useValuation) {
      data.consolidateBalancesToTargetCurrency =
        this.query.useDefaultValuation || !this.showConsolidateBalancesToTargetCurrency ?
        false :
        this.query.consolidateBalancesToTargetCurrency;

      if (!this.query.useDefaultValuation) {
        const initialPeriod: BalancePeriod = {
          fromDate: data.initialPeriod.fromDate,
          toDate: data.initialPeriod.toDate,
          exchangeRateDate: this.query.initialPeriod.exchangeRateDate,
          exchangeRateTypeUID: this.query.initialPeriod.exchangeRateTypeUID,
          valuateToCurrrencyUID: this.query.initialPeriod.valuateToCurrrencyUID,
        };
        data.initialPeriod = initialPeriod;
      }

      if (this.periodsRequired) {
        data.finalPeriod = mapToValidBalancePeriod(this.query.finalPeriod,
                                                   this.query.useDefaultValuation);
      }
    }
  }

}
