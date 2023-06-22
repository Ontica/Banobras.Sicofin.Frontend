/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { FinancialConceptsDataService } from '@app/data-services';

import { EmpObservable } from '@app/core';


export enum SelectorType {
  FINANCIAL_CONCEPTS_GROUPS_LIST = 'FA.FinancialConcepts.Selector.FinancialConceptsGroups.List',
}


const initialState: StateValues = [
  { key: SelectorType.FINANCIAL_CONCEPTS_GROUPS_LIST, value: [] },
];


@Injectable()
export class FinancialConceptsPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: FinancialConceptsDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    let provider: () => any;

    switch (selectorType) {

      case SelectorType.FINANCIAL_CONCEPTS_GROUPS_LIST:
        provider = () => this.data.getFinancialConceptsGroups();

        return super.selectFirst<U>(selectorType, provider);

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
