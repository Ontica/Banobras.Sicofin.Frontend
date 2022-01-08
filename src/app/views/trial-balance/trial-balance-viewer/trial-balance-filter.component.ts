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

import { AccountsChartMasterData, BalancesTypeList, getEmptyTrialBalanceCommand, getLevelsListFromPattern,
         mapToValidTrialBalanceCommandPeriod, resetExchangeRateValues, TrialBalanceCommand,
         TrialBalanceCommandPeriod, TrialBalanceTypes, TrialBalanceTypeList } from '@app/models';

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

  trialBalanceCommand: TrialBalanceCommand = getEmptyTrialBalanceCommand();

  trialBalanceTypeList: Identifiable[] = TrialBalanceTypeList;

  levelsList: Identifiable[] = [];

  balancesTypeList: Identifiable[] = BalancesTypeList;

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private exchangeRatesData: ExchangeRatesDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadAccountsCharts();
    this.trialBalanceCommand.balancesType = this.balancesTypeList[0].uid;
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get trialBalanceTypeSelected(): Identifiable {
    return !this.trialBalanceCommand.trialBalanceType ? null :
      this.trialBalanceTypeList.find(x => x.uid === this.trialBalanceCommand.trialBalanceType);
  }


  get exchangeRatesDisabled(): boolean {
    return [TrialBalanceTypes.AnaliticoDeCuentas,
            TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
            TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.BalanzaValorizadaEnDolares].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get exchangeRatesRequired(): boolean {
    return [TrialBalanceTypes.AnaliticoDeCuentas,
            TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.BalanzaValorizadaEnDolares].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get useDefaultValuationDisabled(): boolean {
    return [TrialBalanceTypes.BalanzaValorizadaEnDolares].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get showCascadeBalancesDisabled(): boolean {
    return [TrialBalanceTypes.BalanzaConContabilidadesEnCascada,
            TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
            TrialBalanceTypes.BalanzaValorizadaEnDolares].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get showCascadeBalancesRequired(): boolean {
    return [TrialBalanceTypes.BalanzaConContabilidadesEnCascada]
              .includes(this.trialBalanceCommand.trialBalanceType);
  }


  get withSubledgerAccountDisabled(): boolean {
    return [TrialBalanceTypes.BalanzaConContabilidadesEnCascada,
            TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
            TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.BalanzaValorizadaEnDolares,
            TrialBalanceTypes.SaldosPorAuxiliar].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get withSubledgerAccountRequired(): boolean {
    return [TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.SaldosPorAuxiliar].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get periodsRequired(): boolean {
    return [TrialBalanceTypes.BalanzaValorizadaComparativa]
            .includes(this.trialBalanceCommand.trialBalanceType);
  }


  get displayInitialPeriod() {
    return ![TrialBalanceTypes.SaldosPorCuenta,
             TrialBalanceTypes.SaldosPorAuxiliar].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get displaySubledgerAccount() {
    return [TrialBalanceTypes.SaldosPorCuenta,
            TrialBalanceTypes.SaldosPorAuxiliar].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get displayToAccount() {
    return [TrialBalanceTypes.AnaliticoDeCuentas,
            TrialBalanceTypes.Balanza,
            TrialBalanceTypes.BalanzaConContabilidadesEnCascada,
            TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
            TrialBalanceTypes.BalanzaValorizadaComparativa,
            TrialBalanceTypes.BalanzaValorizadaEnDolares].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get displayLevel(): boolean {
    return ![TrialBalanceTypes.BalanzaConContabilidadesEnCascada,
             TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
             TrialBalanceTypes.BalanzaValorizadaEnDolares]
              .includes(this.trialBalanceCommand.trialBalanceType);
  }


  get displayWithAverageBalance(): boolean {
    return ![TrialBalanceTypes.BalanzaEnColumnasPorMoneda,
             TrialBalanceTypes.BalanzaValorizadaEnDolares]
              .includes(this.trialBalanceCommand.trialBalanceType);
  }


  get displayWithSectorization(): boolean {
    return [TrialBalanceTypes.AnaliticoDeCuentas,
            TrialBalanceTypes.Balanza].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get trialBalanceFormFieldsValid(): boolean {
    return !!this.trialBalanceCommand.trialBalanceType && !!this.trialBalanceCommand.accountsChartUID &&
           this.initalPeriodDatesValid && this.finalPeriodDatesValid &&
           !!this.trialBalanceCommand.balancesType;
  }


  get initalPeriodDatesValid(): boolean {
    if (this.displayInitialPeriod) {
      return !!this.trialBalanceCommand.initialPeriod.fromDate &&
             !!this.trialBalanceCommand.initialPeriod.toDate;
    }

    return !!this.trialBalanceCommand.initialPeriod.toDate;
  }


  get finalPeriodDatesValid(): boolean {
    return !this.periodsRequired ? true :
           !!this.trialBalanceCommand.finalPeriod.fromDate &&
           !!this.trialBalanceCommand.finalPeriod.toDate;
  }


  get initialPeriodExchangeRateValid(): boolean  {
    return this.trialBalanceCommand.useDefaultValuation ? true :
      !!this.trialBalanceCommand.initialPeriod.exchangeRateDate &&
      !!this.trialBalanceCommand.initialPeriod.exchangeRateTypeUID &&
      !!this.trialBalanceCommand.initialPeriod.valuateToCurrrencyUID;
  }


  get finalPeriodExchangeRateValid(): boolean {
    return this.trialBalanceCommand.useDefaultValuation ? true :
      !!this.trialBalanceCommand.finalPeriod.exchangeRateTypeUID &&
      !!this.trialBalanceCommand.finalPeriod.exchangeRateDate &&
      !!this.trialBalanceCommand.finalPeriod.valuateToCurrrencyUID;
  }


  get exchangeRateFormFieldsValid(): boolean {
    if (!this.trialBalanceCommand.useValuation) {
      return true;
    }

    return this.periodsRequired ? this.initialPeriodExchangeRateValid && this.finalPeriodExchangeRateValid :
      this.initialPeriodExchangeRateValid;
  }


  onTrialBalanceTypeChange() {
    this.trialBalanceCommand.showCascadeBalances = this.showCascadeBalancesRequired;
    this.trialBalanceCommand.withSubledgerAccount = this.withSubledgerAccountRequired;

    this.trialBalanceCommand.useValuation = this.exchangeRatesRequired;
    this.trialBalanceCommand.useDefaultValuation = this.exchangeRatesRequired;

    this.validateValueOfInitPeriodFromDate(this.trialBalanceCommand.initialPeriod.toDate);
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
    this.trialBalanceCommand.useDefaultValuation = true;
    resetExchangeRateValues(this.trialBalanceCommand.initialPeriod);
    resetExchangeRateValues(this.trialBalanceCommand.finalPeriod);
  }


  onUseDefaultValuationChange(checked) {
    if (!checked && !this.showFilters) {
      this.onShowFiltersClicked();
    }
  }


  onExchangeRateDateChanged(period: TrialBalanceCommandPeriod, date: DateString) {
    period.exchangeRatesList = [];
    period.exchangeRateDate = date;
  }


  onExchangeRateSelectorEvent(event, period: TrialBalanceCommandPeriod) {
    if (ExchangeRateSelectorEventType.SEARCH_EXCHANGE_RATES_CLICKED === event.type) {
      this.getExchangeRatesForDate(period);
    }
  }


  getExchangeRatesForDate(period: TrialBalanceCommandPeriod) {
    period.exchangeRatesList = [];

    if (!this.trialBalanceCommand.initialPeriod.exchangeRateDate) {
      return;
    }

    this.exchangeRatesData.getExchangeRatesForDate(period.exchangeRateDate)
      .subscribe(x => period.exchangeRatesList = x);
  }


  onClearFilters() {
    this.trialBalanceCommand = Object.assign({}, getEmptyTrialBalanceCommand(), {
        trialBalanceType: this.trialBalanceCommand.trialBalanceType,
        accountsChartUID: this.trialBalanceCommand.accountsChartUID,
        balancesType: this.balancesTypeList[0].uid,
        useValuation: this.exchangeRatesRequired,
        showCascadeBalances: this.showCascadeBalancesRequired,
        withSubledgerAccount: this.withSubledgerAccountRequired,
      });

    sendEvent(this.trialBalanceFilterEvent, TrialBalanceFilterEventType.CLEAR_TRIAL_BALANCE_CLICKED,
      {trialBalanceCommand: this.getTrialBalanceCommandData()});
  }


  onBuildTrialBalanceClicked() {
    Assertion.assert(this.trialBalanceFormFieldsValid,
      'Programming error: trialBalance form must be validated before command execution.');

    if (this.trialBalanceCommand.useValuation) {
      Assertion.assert(this.exchangeRateFormFieldsValid,
        'Programming error: exchangeRate form must be validated before command execution.');
    }

    const payload = {
      trialBalanceType: this.trialBalanceTypeSelected,
      trialBalanceCommand: this.getTrialBalanceCommandData(),
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
    this.trialBalanceCommand.ledgers = this.accountChartSelected.ledgers
      .filter(x => this.trialBalanceCommand.ledgers.includes(x.uid))
      .map(x => x.uid);

    this.trialBalanceCommand.level =
      this.levelsList.filter(x => this.trialBalanceCommand.level + '' === x.uid).length > 0 ?
      this.trialBalanceCommand.level : null;
  }


  private validateValueOfInitPeriodFromDate(toDate: DateString) {
    if (this.displayInitialPeriod) {
      return;
    }

    this.trialBalanceCommand.initialPeriod.fromDate =
      DateStringLibrary.getFirstDayOfMonthFromDateString(toDate);
  }


  private getTrialBalanceCommandData(): TrialBalanceCommand {
    const data: TrialBalanceCommand = {
      trialBalanceType: this.trialBalanceCommand.trialBalanceType,
      accountsChartUID: this.trialBalanceCommand.accountsChartUID,
      ledgers: this.trialBalanceCommand.ledgers,
      initialPeriod: {
        fromDate: this.trialBalanceCommand.initialPeriod.fromDate,
        toDate: this.trialBalanceCommand.initialPeriod.toDate,
      },
      fromAccount: this.trialBalanceCommand.fromAccount,
      showCascadeBalances: this.trialBalanceCommand.showCascadeBalances,
      balancesType: this.trialBalanceCommand.balancesType,
      useValuation: this.trialBalanceCommand.useValuation,
      useDefaultValuation: this.trialBalanceCommand.useValuation ?
        this.trialBalanceCommand.useDefaultValuation : false,
      withAverageBalance: this.displayWithAverageBalance ?
        this.trialBalanceCommand.withAverageBalance : false,
      withSectorization: this.displayWithSectorization ?
        this.trialBalanceCommand.withSectorization : false,
      withSubledgerAccount: this.trialBalanceCommand.withSubledgerAccount,
    };

    this.validateCommandFields(data);
    this.validateExchangeRatesFields(data);
    return data;
  }


  private validateCommandFields(data: TrialBalanceCommand) {
    if (this.displayToAccount) {
      data.toAccount = this.trialBalanceCommand.toAccount;
    }

    if (this.displaySubledgerAccount) {
      data.subledgerAccount = this.trialBalanceCommand.subledgerAccount;
    }

    if (this.displayLevel) {
      data.level = this.trialBalanceCommand.level;
    }
  }


  private validateExchangeRatesFields(data: TrialBalanceCommand) {
    if (this.trialBalanceCommand.useValuation) {
      data.consolidateBalancesToTargetCurrency = this.trialBalanceCommand.useDefaultValuation ? false :
        this.trialBalanceCommand.consolidateBalancesToTargetCurrency;

      if (!this.trialBalanceCommand.useDefaultValuation) {
        const initialPeriod: TrialBalanceCommandPeriod = {
          fromDate: data.initialPeriod.fromDate,
          toDate: data.initialPeriod.toDate,
          exchangeRateDate: this.trialBalanceCommand.initialPeriod.exchangeRateDate,
          exchangeRateTypeUID: this.trialBalanceCommand.initialPeriod.exchangeRateTypeUID,
          valuateToCurrrencyUID: this.trialBalanceCommand.initialPeriod.valuateToCurrrencyUID,
        };
        data.initialPeriod = initialPeriod;
      }

      if (this.periodsRequired) {
        data.finalPeriod = mapToValidTrialBalanceCommandPeriod(this.trialBalanceCommand.finalPeriod,
                                                               this.trialBalanceCommand.useDefaultValuation);
      }
    }
  }

}
