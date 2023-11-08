/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { CataloguesDataService } from '@app/data-services';

import { EmpObservable } from '@app/core';


export enum SelectorType {
  CURRENCIES_LIST = 'FA.Catalogues.Selector.Currencies.List',
  SECTORS_LIST    = 'FA.Catalogues.Selector.Sectors.List',
}


const initialState: StateValues = [
  { key: SelectorType.CURRENCIES_LIST, value: [] },
  { key: SelectorType.SECTORS_LIST, value: [] },
];


@Injectable()
export class CataloguesPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: CataloguesDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    let provider: () => any;

    switch (selectorType) {

      case SelectorType.SECTORS_LIST:
        provider = () => this.data.getSectors();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.CURRENCIES_LIST:
        provider = () => this.data.getCurrencies();

        return super.selectFirst<U>(selectorType, provider);

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
