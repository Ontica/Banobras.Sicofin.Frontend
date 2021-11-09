/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { OperationalReportsDataService } from '@app/data-services';


export enum SelectorType {
  REPORT_TYPES_LIST = 'FA.OperationalReport.Selector.ReportTypes.List',
}


const initialState: StateValues = [
  { key: SelectorType.REPORT_TYPES_LIST, value: [] },
];


@Injectable()
export class ReportingPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: OperationalReportsDataService) {
    super({
      initialState,
      selectors: SelectorType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): Observable<U> {

    switch (selectorType) {

      case SelectorType.REPORT_TYPES_LIST:
        const provider = () => this.data.getReportTypes();

        return super.selectFirst<U>(selectorType, provider);

      default:
        return super.select<U>(selectorType, params);

    }
  }

}
