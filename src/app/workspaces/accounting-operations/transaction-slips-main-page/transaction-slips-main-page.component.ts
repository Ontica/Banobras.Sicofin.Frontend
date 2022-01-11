/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { TransactionSlipsDataService } from '@app/data-services';

import { EmptySearchTransactionSlipsCommand, EmptyTransactionSlip, SearchTransactionSlipsCommand,
         TransactionSlip, TransactionSlipDescriptor } from '@app/models';

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

  command: SearchTransactionSlipsCommand = Object.assign({}, EmptySearchTransactionSlipsCommand);

  transactionSlipsList: TransactionSlipDescriptor[] = [];

  selectedTransactionSlip: TransactionSlip = EmptyTransactionSlip;

  commandExecuted = false;

  isLoading = false;

  isLoadingTransaction = false;

  displayTransactionSlipTabbedView = false;

  constructor(private transactionSlipsData: TransactionSlipsDataService) {}


  onTransactionSlipsExplorerEvent(event: EventInfo): void {
    switch (event.type as TransactionSlipsExplorerEventType) {

      case TransactionSlipsExplorerEventType.SEARCH_TRANSACTION_SLIPS:
        Assertion.assertValue(event.payload.command, 'event.payload.command');

        this.command = Object.assign({}, event.payload.command);
        this.transactionSlipsList = [];
        this.searchTransactionSlips();

        return;

      case TransactionSlipsExplorerEventType.EXPORT_TRANSACTION_SLIPS:
        console.log('EXPORT_DATA', this.command);

        return;


      case TransactionSlipsExplorerEventType.SELECT_TRANSACTION_SLIP:
        Assertion.assertValue(event.payload.transactionSlip, 'event.payload.transactionSlip');
        Assertion.assertValue(event.payload.transactionSlip.uid, 'event.payload.transactionSlip.uid');

        this.getTransactionSlip(event.payload.transactionSlip.uid);

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


  private searchTransactionSlips() {
    if (!this.command.accountsChartUID) {
      return;
    }

    this.isLoading = true;

    this.transactionSlipsData.searchTransactionSlips(this.command)
      .toPromise()
      .then(x => {
        this.commandExecuted = true;
        this.transactionSlipsList = x;
        this.setSelectedTransactionSlip(EmptyTransactionSlip);
      })
      .finally(() => this.isLoading = false);
  }


  private getTransactionSlip(transactionSlipUID: string) {
    this.isLoadingTransaction = true;

    this.transactionSlipsData.getTransactionSlip(transactionSlipUID)
      .toPromise()
      .then(x => this.setSelectedTransactionSlip(x))
      .finally(() => this.isLoadingTransaction = false);
  }


  private setSelectedTransactionSlip(transactionSlip: TransactionSlip) {
    this.selectedTransactionSlip = transactionSlip;
    this.displayTransactionSlipTabbedView = !isEmpty(this.selectedTransactionSlip.header);
  }

}
