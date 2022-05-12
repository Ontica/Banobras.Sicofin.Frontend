/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { VouchersDataService } from '@app/data-services';

import { EmptyVoucherFilterData } from '@app/models';

import { Assertion } from '@app/core';


export enum ActionType {
  SET_LIST_FILTER_DATA = 'FA.Vouchers.Action.SetListFilterData',
}


export enum SelectorType {
  EVENT_TYPES_LIST = 'FA.Vouchers.Selector.EventTypes.List',
  FUNCTIONAL_AREAS_LIST = 'FA.Vouchers.Selector.FunctionalAreas.List',
  TRANSACTION_TYPES_LIST = 'FA.Vouchers.Selector.TransactionTypes.List',
  VOUCHER_TYPES_LIST = 'FA.Vouchers.Selector.VoucherTypes.List',
  TRANSACTIONAL_SYSTEMS_LIST = 'FA.Vouchers.Selector.TransactionalSystems.List',
  LIST_FILTER_DATA = 'FA.Vouchers.Selectors.VouchersListFilter.Data',
}


const initialState: StateValues = [
  { key: SelectorType.EVENT_TYPES_LIST, value: [] },
  { key: SelectorType.FUNCTIONAL_AREAS_LIST, value: [] },
  { key: SelectorType.TRANSACTION_TYPES_LIST, value: [] },
  { key: SelectorType.VOUCHER_TYPES_LIST, value: [] },
  { key: SelectorType.TRANSACTIONAL_SYSTEMS_LIST, value: [] },
  { key: SelectorType.LIST_FILTER_DATA, value: EmptyVoucherFilterData },
];


@Injectable()
export class VoucherPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: VouchersDataService) {
    super({
      initialState,
      selectors: SelectorType,
      actions: ActionType,
    });
  }


  select<U>(selectorType: SelectorType, params?: any): Observable<U> {

    let provider: () => any;

    switch (selectorType) {
      case SelectorType.EVENT_TYPES_LIST:
        provider = () => this.data.getEventTypes();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.FUNCTIONAL_AREAS_LIST:
        provider = () => this.data.getFunctionalAreas();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.TRANSACTION_TYPES_LIST:
        provider = () => this.data.getTransactionTypes();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.VOUCHER_TYPES_LIST:
        provider = () => this.data.getVoucherTypes();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.TRANSACTIONAL_SYSTEMS_LIST:
        provider = () => this.data.getTransactionalSystems();

        return super.selectFirst<U>(selectorType, provider);

      default:
        return super.select<U>(selectorType, params);
    }
  }


  dispatch(actionType: ActionType, params?: any): void {
    switch (actionType) {

      case ActionType.SET_LIST_FILTER_DATA:
        Assertion.assertValue(params.filterData, 'payload.filterData');

        const filterData = params?.filterData || this.getValue(SelectorType.LIST_FILTER_DATA);

        this.setValue(SelectorType.LIST_FILTER_DATA, filterData);

        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
