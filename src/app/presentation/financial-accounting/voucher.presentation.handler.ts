/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion } from '@app/core';

import { AbstractPresentationHandler, StateValues } from '@app/core/presentation/presentation.handler';

import { EmptySearchVouchersCommand } from '@app/models';

import { VouchersDataService } from '@app/data-services';


export enum ActionType {
  SET_LIST_FILTER = 'FA.Vouchers.Action.SetListFilter',
}


export enum EffectType {
  SET_LIST_FILTER = ActionType.SET_LIST_FILTER,
}


export enum SelectorType {
  TRANSACTION_TYPES_LIST = 'FA.Vouchers.Selector.TransactionTypes.List',
  VOUCHER_TYPES_LIST = 'FA.Vouchers.Selector.VoucherTypes.List',
  LIST_FILTER = 'FA.Vouchers.Selectors.VouchersListFilter',
}


const initialState: StateValues = [
  { key: SelectorType.TRANSACTION_TYPES_LIST, value: [] },
  { key: SelectorType.VOUCHER_TYPES_LIST, value: [] },
  { key: SelectorType.LIST_FILTER, value: EmptySearchVouchersCommand },
];


@Injectable()
export class VoucherPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: VouchersDataService) {
    super({
      initialState,
      selectors: SelectorType,
      effects: EffectType,
      actions: ActionType
    });
  }


  select<U>(selectorType: SelectorType, params?: any): Observable<U> {

    let provider: () => any;

    switch (selectorType) {

      case SelectorType.TRANSACTION_TYPES_LIST:
        provider = () => this.data.getTransactionTypes();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.VOUCHER_TYPES_LIST:
        provider = () => this.data.getVoucherTypes();

        return super.selectFirst<U>(selectorType, provider);

      default:
        return super.select<U>(selectorType, params);

    }
  }


  applyEffects(effectType: EffectType, params?: any): void {

    switch (effectType) {

      case EffectType.SET_LIST_FILTER:

        return;

      default:
        throw this.unhandledCommandOrActionType(effectType);
    }
  }


  dispatch(actionType: ActionType, params?: any): void {
    switch (actionType) {

      case ActionType.SET_LIST_FILTER:
        Assertion.assertValue(params.filter, 'payload.filter');

        const filter = params?.filter || this.getValue(SelectorType.LIST_FILTER);

        this.setValue(SelectorType.LIST_FILTER, filter);

        return;

      default:
        throw this.unhandledCommandOrActionType(actionType);
    }
  }

}
