/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { ExternalVariablesDataService } from '@app/data-services';

import { EmpObservable } from '@app/core';


export enum SelectorType {
  EXTERNAL_VARIABLES_SETS_LIST   = 'FA.ExternalVariables.Selector.ExternalVariablesSets.List',
}


const initialState: StateValues = [
  { key: SelectorType.EXTERNAL_VARIABLES_SETS_LIST, value: [] },
];


@Injectable()
export class ExternalVariablesPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: ExternalVariablesDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): EmpObservable<U> {

    let provider: () => any;

    switch (selectorType) {

      case SelectorType.EXTERNAL_VARIABLES_SETS_LIST:
        provider = () => this.data.getExternalVariablesSets();

        return super.selectFirst<U>(selectorType, provider);

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
