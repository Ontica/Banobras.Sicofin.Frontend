/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { FinancialConceptsDataService } from '@app/data-services';


export enum SelectorType {
  FINANCIAL_CONCEPTS_GROUPS_LIST = 'FA.FinancialConcepts.Selector.FinancialConceptsGroups.List',
  EXTERNAL_VARIABLES_SETS_LIST   = 'FA.FinancialConcepts.Selector.ExternalVariablesSets.List',
}


const initialState: StateValues = [
  { key: SelectorType.FINANCIAL_CONCEPTS_GROUPS_LIST, value: [] },
  { key: SelectorType.EXTERNAL_VARIABLES_SETS_LIST, value: [] },
];


@Injectable()
export class FinancialConceptsPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: FinancialConceptsDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): Observable<U> {

    let provider: () => any;

    switch (selectorType) {

      case SelectorType.FINANCIAL_CONCEPTS_GROUPS_LIST:
        provider = () => this.data.getFinancialConceptsGroups();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.EXTERNAL_VARIABLES_SETS_LIST:
        provider = () => this.data.getExternalVariablesSets();

        return super.selectFirst<U>(selectorType, provider);

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
