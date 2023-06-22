/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { ExchangeRatesDataService } from '@app/data-services';

import { EmpObservable } from '@app/core';


export enum SelectorType {
  EXCHANGE_RATES_TYPES_LIST = 'FA.ExchangeRates.Selector.ExchangeRatesTypes.List',
  CURRENCIES_LIST           = 'FA.ExchangeRates.Selector.Currencies.List',
}


const initialState: StateValues = [
  { key: SelectorType.EXCHANGE_RATES_TYPES_LIST, value: [] },
  { key: SelectorType.CURRENCIES_LIST, value: [] },
];


@Injectable()
export class ExchangeRatesPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: ExchangeRatesDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    let provider: () => any;

    switch (selectorType) {

      case SelectorType.EXCHANGE_RATES_TYPES_LIST:
        provider = () => this.data.getExchangeRatesTypes();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.CURRENCIES_LIST:
        provider = () => this.data.getCurrencies();

        return super.selectFirst<U>(selectorType, provider);

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
