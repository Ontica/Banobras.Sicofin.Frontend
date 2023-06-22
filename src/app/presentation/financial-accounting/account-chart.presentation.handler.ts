/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { AccountsChartDataService } from '@app/data-services';

import { EmpObservable } from '@app/core';


export enum SelectorType {
  ACCOUNTS_CHARTS_MASTER_DATA_LIST = 'FA.AccountChart.Selector.AccountsChartsMasterData.List',
}


const initialState: StateValues = [
  { key: SelectorType.ACCOUNTS_CHARTS_MASTER_DATA_LIST, value: [] },
];


@Injectable()
export class AccountChartPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: AccountsChartDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    switch (selectorType) {

      case SelectorType.ACCOUNTS_CHARTS_MASTER_DATA_LIST:
        const provider = () => this.data.getAccountsChartsMasterData();

        return super.selectFirst<U>(selectorType, provider);

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
