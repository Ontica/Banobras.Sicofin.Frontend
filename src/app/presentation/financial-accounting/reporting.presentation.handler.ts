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

import { EmptyBalanceExplorerData } from '@app/models';

import { Assertion } from '@app/core';


export enum ActionType {
  SET_BALANCE_EXPLORER_DATA = 'FA.Reporting.Action.SetBalanceExplorerData',
}


export enum SelectorType {
  REPORT_TYPES_LIST = 'FA.Reporting.Selector.ReportTypes.List',
  BALANCE_EXPLORER_DATA = 'FA.Reporting.Selectors.BalanceExplorer.Data',
}


const initialState: StateValues = [
  { key: SelectorType.REPORT_TYPES_LIST, value: [] },
  { key: SelectorType.BALANCE_EXPLORER_DATA, value: EmptyBalanceExplorerData },
];


@Injectable()
export class ReportingPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: OperationalReportsDataService) {
    super({
      initialState,
      selectors: SelectorType,
      actions: ActionType,
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


  dispatch(actionType: ActionType, params?: any): void {
    switch (actionType) {

      case ActionType.SET_BALANCE_EXPLORER_DATA:
        Assertion.assertValue(params.balanceData, 'payload.balanceData');

        const balanceData = params?.balanceData || this.getValue(SelectorType.BALANCE_EXPLORER_DATA);

        this.setValue(SelectorType.BALANCE_EXPLORER_DATA, balanceData);

        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
