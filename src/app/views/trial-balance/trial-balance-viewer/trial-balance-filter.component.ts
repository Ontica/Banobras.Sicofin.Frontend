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
         TrialBalanceTypes, TrialBalanceTypeList, BalancesTypeForBalanceList,
         BalancesTypeForTrialBalanceList } from '@app/models';

import { AccountChartStateSelector } from '@app/presentation/exported.presentation.types';

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

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  trialBalanceQuery: TrialBalanceQuery = getEmptyTrialBalanceQuery();

  trialBalanceTypeList: Identifiable[] = TrialBalanceTypeList;

  levelsList: Identifiable[] = [];

  balancesTypeList: Identifiable[] = [];

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private exchangeRatesData: ExchangeRatesDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadAccountsCharts();
    this.setBalancesTypeList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get trialBalanceTypeSelected(): Identifiable {
    return !this.trialBalanceQuery.trialBalanceType ? null :
      this.trialBalanceTypeList.find(x => x.uid === this.trialBalanceQuery.trialBalanceType);
  }


  get isBalanceSelected() {
    return [TrialBalanceTypes.SaldosPorCuenta,
            TrialBalanceTypes.SaldosPorAuxiliar].includes(this.trialBalanceQuery.trialBalanceType);
  }


  get exchangeRatesDisabled(): boolean {
    return [TrialBalanceTypes.AnaliticoDeCuentas,
            TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
            TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.BalanzaDolarizada].includes(this.trialBalanceQuery.trialBalanceType);
  }


  get exchangeRatesRequired(): boolean {
    return [TrialBalanceTypes.AnaliticoDeCuentas,
            TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.BalanzaDolarizada].includes(this.trialBalanceQuery.trialBalanceType);
  }


  get useDefaultValuationDisabled(): boolean {
    return [TrialBalanceTypes.BalanzaDolarizada].includes(this.trialBalanceQuery.trialBalanceType);
  }


  get showCascadeBalancesDisabled(): boolean {
    return [TrialBalanceTypes.BalanzaConContabilidadesEnCascada,
            TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
            TrialBalanceTypes.BalanzaDolarizada,
            TrialBalanceTypes.SaldosPorAuxiliar].includes(this.trialBalanceQuery.trialBalanceType);
  }


  get showCascadeBalancesRequired(): boolean {
    return [TrialBalanceTypes.BalanzaConContabilidadesEnCascada,
            TrialBalanceTypes.SaldosPorAuxiliar].includes(this.trialBalanceQuery.trialBalanceType);
  }


  get withSubledgerAccountDisabled(): boolean {
    return [TrialBalanceTypes.BalanzaConContabilidadesEnCascada,
            TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
            TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.BalanzaDolarizada,
            TrialBalanceTypes.SaldosPorAuxiliar].includes(this.trialBalanceQuery.trialBalanceType);
  }


  get withSubledgerAccountRequired(): boolean {
    return [TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.SaldosPorAuxiliar].includes(this.trialBalanceQuery.trialBalanceType);
  }


  get periodsRequired(): boolean {
    return [TrialBalanceTypes.BalanzaValorizadaComparativa]
            .includes(this.trialBalanceQuery.trialBalanceType);
  }


  get displayInitialPeriod() {
    return !this.isBalanceSelected;
  }


  get displaySubledgerAccount() {
    return this.isBalanceSelected;
  }


  get displayToAccount() {
    return [TrialBalanceTypes.AnaliticoDeCuentas,
            TrialBalanceTypes.Balanza,
            TrialBalanceTypes.BalanzaConContabilidadesEnCascada,
            TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
            TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.BalanzaDolarizada].includes(this.trialBalanceQuery.trialBalanceType);
  }


  get displayLevel(): boolean {
    return ![TrialBalanceTypes.BalanzaConContabilidadesEnCascada,
             TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
             TrialBalanceTypes.BalanzaDolarizada]
              .includes(this.trialBalanceQuery.trialBalanceType);
  }


  get displayWithAverageBalance(): boolean {
    return ![TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
             TrialBalanceTypes.BalanzaDolarizada]
              .includes(this.trialBalanceQuery.trialBalanceType);
  }


  get displayWithSectorization(): boolean {
    return [TrialBalanceTypes.AnaliticoDeCuentas,
            TrialBalanceTypes.Balanza].includes(this.trialBalanceQuery.trialBalanceType);
  }


  get trialBalanceFormFieldsValid(): boolean {
    return !!this.trialBalanceQuery.trialBalanceType && !!this.trialBalanceQuery.accountsChartUID &&
           this.initalPeriodDatesValid && this.finalPeriodDatesValid &&
           !!this.trialBalanceQuery.balancesType;
  }


  get initalPeriodDatesValid(): boolean {
    if (this.displayInitialPeriod) {
      return !!this.trialBalanceQuery.initialPeriod.fromDate &&
             !!this.trialBalanceQuery.initialPeriod.toDate;
    }

    return !!this.trialBalanceQuery.initialPeriod.toDate;
  }


  get finalPeriodDatesValid(): boolean {
    return !this.periodsRequired ? true :
           !!this.trialBalanceQuery.finalPeriod.fromDate &&
           !!this.trialBalanceQuery.finalPeriod.toDate;
  }


  get initialPeriodExchangeRateValid(): boolean  {
    return this.trialBalanceQuery.useDefaultValuation ? true :
      !!this.trialBalanceQuery.initialPeriod.exchangeRateDate &&
      !!this.trialBalanceQuery.initialPeriod.exchangeRateTypeUID &&
      !!this.trialBalanceQuery.initialPeriod.valuateToCurrrencyUID;
  }


  get finalPeriodExchangeRateValid(): boolean {
    return this.trialBalanceQuery.useDefaultValuation ? true :
      !!this.trialBalanceQuery.finalPeriod.exchangeRateTypeUID &&
      !!this.trialBalanceQuery.finalPeriod.exchangeRateDate &&
      !!this.trialBalanceQuery.finalPeriod.valuateToCurrrencyUID;
  }


  get exchangeRateFormFieldsValid(): boolean {
    if (!this.trialBalanceQuery.useValuation) {
      return true;
    }

    return this.periodsRequired ? this.initialPeriodExchangeRateValid && this.finalPeriodExchangeRateValid :
      this.initialPeriodExchangeRateValid;
  }


  onTrialBalanceTypeChange() {
    this.trialBalanceQuery.showCascadeBalances = this.showCascadeBalancesRequired;
    this.trialBalanceQuery.withSubledgerAccount = this.withSubledgerAccountRequired;

    this.trialBalanceQuery.useValuation = this.exchangeRatesRequired;
    this.trialBalanceQuery.useDefaultValuation = this.exchangeRatesRequired;

    this.validateValueOfInitPeriodFromDate(this.trialBalanceQuery.initialPeriod.toDate);
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
    this.trialBalanceQuery.useDefaultValuation = true;
    resetExchangeRateValues(this.trialBalanceQuery.initialPeriod);
    resetExchangeRateValues(this.trialBalanceQuery.finalPeriod);
  }


  onUseDefaultValuationChange(checked) {
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

    if (!this.trialBalanceQuery.initialPeriod.exchangeRateDate) {
      return;
    }

    this.exchangeRatesData.getExchangeRatesForDate(period.exchangeRateDate)
      .subscribe(x => period.exchangeRatesList = x);
  }


  onClearFilters() {
    this.trialBalanceQuery = Object.assign({}, getEmptyTrialBalanceQuery(), {
      trialBalanceType: this.trialBalanceQuery.trialBalanceType,
      accountsChartUID: this.trialBalanceQuery.accountsChartUID,
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

    if (this.trialBalanceQuery.useValuation) {
      Assertion.assert(this.exchangeRateFormFieldsValid,
        'Programming error: exchangeRate form must be validated before query execution.');
    }

    const payload = {
      trialBalanceType: this.trialBalanceTypeSelected,
      trialBalanceQuery: this.getTrialBalanceQueryData(),
    };

    sendEvent(this.trialBalanceFilterEvent, TrialBalanceFilterEventType.BUILD_TRIAL_BALANCE_CLICKED, payload);
  }


  private loadAccountsCharts() {
    this.isLoading = true;

    this.helper.select<AccountsChartMasterData[]>(AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST)
      .subscribe(x => {
        this.accountsChartMasterDataList = x;
        this.setLevelsList();
        this.isLoading = false;
      });
  }


  private setBalancesTypeList() {
    this.balancesTypeList = this.isBalanceSelected ?  BalancesTypeForBalanceList :
      BalancesTypeForTrialBalanceList;

    this.trialBalanceQuery.balancesType = this.balancesTypeList[0] ? this.balancesTypeList[0].uid : '';
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
    this.trialBalanceQuery.ledgers = this.accountChartSelected.ledgers
      .filter(x => this.trialBalanceQuery.ledgers.includes(x.uid))
      .map(x => x.uid);

    this.trialBalanceQuery.level =
      this.levelsList.filter(x => this.trialBalanceQuery.level + '' === x.uid).length > 0 ?
      this.trialBalanceQuery.level : null;
  }


  private validateValueOfInitPeriodFromDate(toDate: DateString) {
    if (this.displayInitialPeriod) {
      return;
    }

    this.trialBalanceQuery.initialPeriod.fromDate =
      DateStringLibrary.getFirstDayOfMonthFromDateString(toDate);
  }


  private getTrialBalanceQueryData(): TrialBalanceQuery {
    const data: TrialBalanceQuery = {
      trialBalanceType: this.trialBalanceQuery.trialBalanceType,
      accountsChartUID: this.trialBalanceQuery.accountsChartUID,
      ledgers: this.trialBalanceQuery.ledgers,
      initialPeriod: {
        fromDate: this.trialBalanceQuery.initialPeriod.fromDate,
        toDate: this.trialBalanceQuery.initialPeriod.toDate,
      },
      fromAccount: this.trialBalanceQuery.fromAccount,
      showCascadeBalances: this.trialBalanceQuery.showCascadeBalances,
      balancesType: this.trialBalanceQuery.balancesType,
      useValuation: this.trialBalanceQuery.useValuation,
      useDefaultValuation: this.trialBalanceQuery.useValuation ?
        this.trialBalanceQuery.useDefaultValuation : false,
      withAverageBalance: this.displayWithAverageBalance ?
        this.trialBalanceQuery.withAverageBalance : false,
      withSectorization: this.displayWithSectorization ?
        this.trialBalanceQuery.withSectorization : false,
      withSubledgerAccount: this.trialBalanceQuery.withSubledgerAccount,
    };

    this.validateQueryFields(data);
    this.validateExchangeRatesFields(data);
    return data;
  }


  private validateQueryFields(data: TrialBalanceQuery) {
    if (this.displayToAccount) {
      data.toAccount = this.trialBalanceQuery.toAccount;
    }

    if (this.displaySubledgerAccount) {
      data.subledgerAccount = this.trialBalanceQuery.subledgerAccount;
    }

    if (this.displayLevel) {
      data.level = this.trialBalanceQuery.level;
    }
  }


  private validateExchangeRatesFields(data: TrialBalanceQuery) {
    if (this.trialBalanceQuery.useValuation) {
      data.consolidateBalancesToTargetCurrency = this.trialBalanceQuery.useDefaultValuation ? false :
        this.trialBalanceQuery.consolidateBalancesToTargetCurrency;

      if (!this.trialBalanceQuery.useDefaultValuation) {
        const initialPeriod: BalancePeriod = {
          fromDate: data.initialPeriod.fromDate,
          toDate: data.initialPeriod.toDate,
          exchangeRateDate: this.trialBalanceQuery.initialPeriod.exchangeRateDate,
          exchangeRateTypeUID: this.trialBalanceQuery.initialPeriod.exchangeRateTypeUID,
          valuateToCurrrencyUID: this.trialBalanceQuery.initialPeriod.valuateToCurrrencyUID,
        };
        data.initialPeriod = initialPeriod;
      }

      if (this.periodsRequired) {
        data.finalPeriod = mapToValidBalancePeriod(this.trialBalanceQuery.finalPeriod,
                                                   this.trialBalanceQuery.useDefaultValuation);
      }
    }
  }

}
