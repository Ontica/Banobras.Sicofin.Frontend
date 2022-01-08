/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { EmptyTransactionSlipDescriptor, TransactionSlipDescriptor } from '@app/models';

import {
  TransactionSlipsExplorerEventType
} from '@app/views/transaction-slips/transaction-slips-explorer/transaction-slips-explorer.component';



@Component({
  selector: 'emp-fa-transaction-slips-main-page',
  templateUrl: './transaction-slips-main-page.component.html'
})
export class TransactionSlipsMainPageComponent {

  selectedTransactionSlip: TransactionSlipDescriptor = EmptyTransactionSlipDescriptor;

  displayTransactionSlipTabbedView = false;

  onTransactionSlipsExplorerEvent(event: EventInfo): void {
    switch (event.type as TransactionSlipsExplorerEventType) {

      case TransactionSlipsExplorerEventType.TRANSACTION_SLIP_SELECTED:
        Assertion.assertValue(event.payload.transactionSlip, 'event.payload.transactionSlip');
        this.setSelectedTransactionSlip(event.payload.transactionSlip as TransactionSlipDescriptor);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setSelectedTransactionSlip(transactionSlip: TransactionSlipDescriptor) {
    this.selectedTransactionSlip = transactionSlip;
    this.displayTransactionSlipTabbedView = !!this.selectedTransactionSlip.uid;
  }

}
