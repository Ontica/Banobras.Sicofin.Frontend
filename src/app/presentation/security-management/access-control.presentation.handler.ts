/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { AccessControlDataService } from '@app/data-services';


export enum SelectorType {
  CONTEXTS_LIST = 'SM.AccessControl.Selector.Contexts.List',
}


const initialState: StateValues = [
  { key: SelectorType.CONTEXTS_LIST, value: [] },
];


@Injectable()
export class AccessControlPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: AccessControlDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): Observable<U> {

    switch (selectorType) {

      case SelectorType.CONTEXTS_LIST:
        const provider = () => this.data.getContexts();

        return super.selectFirst<U>(selectorType, provider);

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
