/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { EmptyTransactionSlip, TransactionSlip } from '@app/models';

import {
  TransactionSlipTabbedViewComponentEventType
} from '@app/views/transaction-slips/transaction-slip-tabbed-view/transaction-slip-tabbed-view.component';

import {
  TransactionSlipsExplorerEventType
} from '@app/views/transaction-slips/transaction-slips-explorer/transaction-slips-explorer.component';


@Component({
  selector: 'emp-fa-transaction-slips-main-page',
  templateUrl: './transaction-slips-main-page.component.html'
})
export class TransactionSlipsMainPageComponent {

  selectedTransactionSlip: TransactionSlip = EmptyTransactionSlip;

  displayTransactionSlipTabbedView = false;

  onTransactionSlipsExplorerEvent(event: EventInfo): void {
    switch (event.type as TransactionSlipsExplorerEventType) {

      case TransactionSlipsExplorerEventType.TRANSACTION_SLIP_SELECTED:
        Assertion.assertValue(event.payload.transactionSlip, 'event.payload.transactionSlip');
        this.setSelectedTransactionSlip(event.payload.transactionSlip as TransactionSlip);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionSlipTabbedViewEvent(event: EventInfo) {
    switch (event.type as TransactionSlipTabbedViewComponentEventType) {

      case TransactionSlipTabbedViewComponentEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedTransactionSlip(EmptyTransactionSlip);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setSelectedTransactionSlip(transactionSlip: TransactionSlip) {
    this.selectedTransactionSlip = transactionSlip;
    this.displayTransactionSlipTabbedView = !isEmpty(this.selectedTransactionSlip.header);
  }

}
