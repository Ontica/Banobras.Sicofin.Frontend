/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { ExchangeRatesDataService } from '@app/data-services';

import { AccountsChartMasterData, BalancesTypeList, ExchangeRate,
         getEmptyTrialBalanceCommand,
         getLevelsListFromPattern, TrialBalanceCommand, TrialBalanceTypeList} from '@app/models';

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

  displayExchangeRates = false;

  autoInitialPeriodExchangeRatesFromDate = false;

  autoFinalPeriodExchangeRatesFromDate = false;

  initialPeriodExchangeRatesList: ExchangeRate[] = [];

  finalPeriodExchangeRatesList: ExchangeRate[] = [];


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

  get exchangeRatesRequired(): boolean {
    return ['AnaliticoDeCuentas',
            'BalanzaValorizadaComparativa'].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get showCascadeBalancesRequired(): boolean {
    return ['SaldosPorCuentaYMayor'].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get periodsRequired(): boolean {
    return ['BalanzaValorizadaComparativa'].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get displaySubledgerAccount() {
    return ['SaldosPorCuenta', 'SaldosPorAuxiliar'].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get displayToAccount() {
    return ['Balanza', 'BalanzaConAuxiliares', 'SaldosPorCuentaYMayor', 'AnaliticoDeCuentas',
            'BalanzaValorizadaComparativa'].includes(this.trialBalanceCommand.trialBalanceType);
  }


  get trialBalanceFormFieldsValid(): boolean {
    return !!this.trialBalanceCommand.trialBalanceType && !!this.trialBalanceCommand.accountsChartUID &&
           !!this.trialBalanceCommand.initialPeriod.fromDate &&
           !!this.trialBalanceCommand.initialPeriod.toDate && !!this.trialBalanceCommand.balancesType;
  }


  get exchangeRateFormFieldsValid(): boolean {
    if (!this.displayExchangeRates) {
      return true;
    }

    if (this.periodsRequired) {
      return !!this.trialBalanceCommand.initialPeriod.exchangeRateDate &&
             !!this.trialBalanceCommand.initialPeriod.exchangeRateTypeUID &&
             !!this.trialBalanceCommand.initialPeriod.valuateToCurrrencyUID &&
             !!this.trialBalanceCommand.finalPeriod.exchangeRateTypeUID &&
             !!this.trialBalanceCommand.finalPeriod.exchangeRateDate &&
             !!this.trialBalanceCommand.finalPeriod.valuateToCurrrencyUID;
    }

    return !!this.trialBalanceCommand.initialPeriod.exchangeRateDate &&
           !!this.trialBalanceCommand.initialPeriod.exchangeRateTypeUID &&
           !!this.trialBalanceCommand.initialPeriod.valuateToCurrrencyUID;
  }


  onTrialBalanceTypeChange() {
    this.displayExchangeRates = this.exchangeRatesRequired ? true : this.displayExchangeRates;
    this.trialBalanceCommand.showCascadeBalances = this.showCascadeBalancesRequired ?
      true : this.trialBalanceCommand.showCascadeBalances;
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


  onDisplayExchangeRatesChange() {
    this.trialBalanceCommand.initialPeriod.exchangeRateDate = '';
    this.trialBalanceCommand.initialPeriod.exchangeRateTypeUID = '';
    this.trialBalanceCommand.initialPeriod.valuateToCurrrencyUID = '';

    this.trialBalanceCommand.finalPeriod.exchangeRateDate = '';
    this.trialBalanceCommand.finalPeriod.exchangeRateTypeUID = '';
    this.trialBalanceCommand.finalPeriod.valuateToCurrrencyUID = '';

    if (this.trialBalanceCommand.initialPeriod.toDate) {
      this.onInitialPeriodToDateChange(this.trialBalanceCommand.initialPeriod.toDate);
    }

    if (this.trialBalanceCommand.finalPeriod.toDate) {
      this.onFinalPeriodToDateChange(this.trialBalanceCommand.finalPeriod.toDate);
    }
  }


  onInitialPeriodToDateChange(toDate){
    if (this.displayExchangeRates && toDate && !this.trialBalanceCommand.initialPeriod.exchangeRateDate) {
      this.autoInitialPeriodExchangeRatesFromDate = true;
      this.initialPeriodExchangeRatesList = [];
      this.trialBalanceCommand.initialPeriod.exchangeRateDate = toDate;
    }
  }


  onFinalPeriodToDateChange(toDate){
    if (this.displayExchangeRates && toDate && !this.trialBalanceCommand.finalPeriod.exchangeRateDate) {
      this.autoFinalPeriodExchangeRatesFromDate = true;
      this.finalPeriodExchangeRatesList = [];
      this.trialBalanceCommand.finalPeriod.exchangeRateDate = toDate;
    }
  }


  onInitialPeriodExchangeRateDateChanged(value) {
    this.autoInitialPeriodExchangeRatesFromDate = false;
    this.trialBalanceCommand.initialPeriod.exchangeRateDate = value;
    this.initialPeriodExchangeRatesList = [];
  }


  onInitialPeriodExchangeRateSelectorEvent(event) {
    if (ExchangeRateSelectorEventType.SEARCH_EXCHANGE_RATES_CLICKED === event.type) {
      this.initialPeriodExchangeRatesList = [];

      if (!this.trialBalanceCommand.initialPeriod.exchangeRateDate) {
        return;
      }

      this.exchangeRatesData.getExchangeRatesForDate(this.trialBalanceCommand.initialPeriod.exchangeRateDate)
        .subscribe(x => {
          this.initialPeriodExchangeRatesList = x;
          if (this.autoInitialPeriodExchangeRatesFromDate && this.initialPeriodExchangeRatesList.length > 0) {
            this.trialBalanceCommand.initialPeriod.exchangeRateTypeUID =
              this.initialPeriodExchangeRatesList[0].exchangeRateType.uid;
            this.trialBalanceCommand.initialPeriod.valuateToCurrrencyUID =
              this.initialPeriodExchangeRatesList[0].toCurrency.uid;
            this.autoInitialPeriodExchangeRatesFromDate = false;
          }
        });
    }
  }


  onFinalPeriodExchangeRateDateChanged(value) {
    this.autoFinalPeriodExchangeRatesFromDate = false;
    this.trialBalanceCommand.finalPeriod.exchangeRateDate = value;
    this.finalPeriodExchangeRatesList = [];
  }


  onFinalPeriodExchangeRateSelectorEvent(event) {
    if (ExchangeRateSelectorEventType.SEARCH_EXCHANGE_RATES_CLICKED === event.type) {
      this.finalPeriodExchangeRatesList = [];

      if (!this.trialBalanceCommand.finalPeriod.exchangeRateDate) {
        return;
      }

      this.exchangeRatesData.getExchangeRatesForDate(this.trialBalanceCommand.finalPeriod.exchangeRateDate)
        .subscribe(x => {
          this.finalPeriodExchangeRatesList = x;
          if (this.autoFinalPeriodExchangeRatesFromDate && this.finalPeriodExchangeRatesList.length > 0) {
            this.trialBalanceCommand.finalPeriod.exchangeRateTypeUID =
              this.finalPeriodExchangeRatesList[0].exchangeRateType.uid;
            this.trialBalanceCommand.finalPeriod.valuateToCurrrencyUID =
              this.finalPeriodExchangeRatesList[0].toCurrency.uid;
            this.autoFinalPeriodExchangeRatesFromDate = false;
          }
        });
    }
  }


  onClearFilters() {
    this.displayExchangeRates = this.exchangeRatesRequired;
    this.initialPeriodExchangeRatesList = [];
    this.finalPeriodExchangeRatesList = [];

    this.trialBalanceCommand = Object.assign({}, getEmptyTrialBalanceCommand(), {
        trialBalanceType: this.trialBalanceCommand.trialBalanceType,
        accountsChartUID: this.trialBalanceCommand.accountsChartUID,
        balancesType: this.balancesTypeList[0].uid,
      });

    sendEvent(this.trialBalanceFilterEvent, TrialBalanceFilterEventType.CLEAR_TRIAL_BALANCE_CLICKED,
      {trialBalanceCommand: this.getTrialBalanceCommandData()});
  }


  onBuildTrialBalanceClicked() {
    Assertion.assert(this.trialBalanceFormFieldsValid,
      'Programming error: form must be validated before command execution.');

    if (this.displayExchangeRates) {
      Assertion.assert(this.exchangeRateFormFieldsValid,
        'Programming error: form must be validated before command execution.');
    }

    sendEvent(this.trialBalanceFilterEvent, TrialBalanceFilterEventType.BUILD_TRIAL_BALANCE_CLICKED,
      {trialBalanceCommand: this.getTrialBalanceCommandData()});
  }


  private getTrialBalanceCommandData(): TrialBalanceCommand {
    const data: TrialBalanceCommand = {
      trialBalanceType: this.trialBalanceCommand.trialBalanceType,
      accountsChartUID: this.trialBalanceCommand.accountsChartUID,
      ledgers: this.trialBalanceCommand.ledgers,
      initialPeriod : this.trialBalanceCommand.initialPeriod,
      fromAccount: this.trialBalanceCommand.fromAccount,
      showCascadeBalances: this.trialBalanceCommand.showCascadeBalances,
      balancesType: this.trialBalanceCommand.balancesType,
      level: this.trialBalanceCommand.level,
    };

    this.validateCommandFieldsByBalanceType(data);

    return data;
  }


  private validateCommandFieldsByBalanceType(data: TrialBalanceCommand) {
    if (this.displayToAccount) {
      data.toAccount = this.trialBalanceCommand.toAccount;
    }

    if (this.displaySubledgerAccount) {
      data.subledgerAccount = this.trialBalanceCommand.subledgerAccount;
    }

    if (this.displayExchangeRates) {
      data.initialPeriod = this.trialBalanceCommand.initialPeriod;
      data.consolidateBalancesToTargetCurrency = this.trialBalanceCommand.consolidateBalancesToTargetCurrency;

      if (this.periodsRequired) {
        data.finalPeriod = this.trialBalanceCommand.finalPeriod;
      }
    }
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
      this.levelsList =  [];
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

}
