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


export enum SelectorType {
  EVENT_TYPES_LIST = 'FA.Vouchers.Selector.EventTypes.List',
  FUNCTIONAL_AREAS_LIST = 'FA.Vouchers.Selector.FunctionalAreas.List',
  TRANSACTION_TYPES_LIST = 'FA.Vouchers.Selector.TransactionTypes.List',
  VOUCHER_TYPES_LIST = 'FA.Vouchers.Selector.VoucherTypes.List',
  VOUCHER_SPECIAL_CASE_TYPES_LIST = 'FA.Vouchers.Selector.VoucherSpecialCaseTypes.List',
  TRANSACTIONAL_SYSTEMS_LIST = 'FA.Vouchers.Selector.TransactionalSystems.List',
}


const initialState: StateValues = [
  { key: SelectorType.EVENT_TYPES_LIST, value: [] },
  { key: SelectorType.FUNCTIONAL_AREAS_LIST, value: [] },
  { key: SelectorType.TRANSACTION_TYPES_LIST, value: [] },
  { key: SelectorType.VOUCHER_TYPES_LIST, value: [] },
  { key: SelectorType.VOUCHER_SPECIAL_CASE_TYPES_LIST, value: [] },
  { key: SelectorType.TRANSACTIONAL_SYSTEMS_LIST, value: [] },
];


@Injectable()
export class VoucherPresentationHandler extends AbstractPresentationHandler {

  constructor(private data: VouchersDataService) {
    super({
      initialState,
      selectors: SelectorType,
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

      case SelectorType.VOUCHER_SPECIAL_CASE_TYPES_LIST:
        provider = () => this.data.getVoucherSpecialCaseTypes();

        return super.selectFirst<U>(selectorType, provider);

      case SelectorType.TRANSACTIONAL_SYSTEMS_LIST:
        provider = () => this.data.getTransactionalSystems();

        return super.selectFirst<U>(selectorType, provider);

      default:
        return super.select<U>(selectorType, params);
    }
  }

}
