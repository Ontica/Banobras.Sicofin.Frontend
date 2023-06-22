/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { TransactionSlipsDataService } from '@app/data-services';

import { EmptyTransactionSlipsQuery, EmptyTransactionSlip, TransactionSlipsQuery,
         TransactionSlip, TransactionSlipDescriptor, TransactionSlipExportationType } from '@app/models';

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

  query: TransactionSlipsQuery = Object.assign({}, EmptyTransactionSlipsQuery);

  transactionSlipsList: TransactionSlipDescriptor[] = [];

  selectedTransactionSlip: TransactionSlip = EmptyTransactionSlip;

  queryExecuted = false;

  isLoading = false;

  isLoadingTransaction = false;

  displayTransactionSlipTabbedView = false;

  fileUrl = '';

  constructor(private transactionSlipsData: TransactionSlipsDataService) {}


  onTransactionSlipsExplorerEvent(event: EventInfo): void {
    switch (event.type as TransactionSlipsExplorerEventType) {

      case TransactionSlipsExplorerEventType.SEARCH_TRANSACTION_SLIPS:
        Assertion.assertValue(event.payload.query, 'event.payload.query');

        this.query = Object.assign({}, event.payload.query);
        this.resetTransactionSlipData();
        this.searchTransactionSlips();

        return;

      case TransactionSlipsExplorerEventType.EXPORT_TRANSACTION_SLIPS:
        Assertion.assertValue(event.payload.exportationType, 'event.payload.exportationType');

        this.exportTransactionSlips(event.payload.exportationType as TransactionSlipExportationType);

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
    if (!this.query.accountsChartUID) {
      return;
    }

    this.isLoading = true;

    this.transactionSlipsData.searchTransactionSlips(this.query)
      .firstValue()
      .then(x => {
        this.queryExecuted = true;
        this.transactionSlipsList = x;
      })
      .finally(() => this.isLoading = false);
  }


  private exportTransactionSlips(exportationType: TransactionSlipExportationType) {
    this.fileUrl = '';

    this.transactionSlipsData.exportTransactionSlips(exportationType, this.query)
      .firstValue()
      .then(x => this.fileUrl = x.url);
  }


  private getTransactionSlip(transactionSlipUID: string) {
    this.isLoadingTransaction = true;

    this.transactionSlipsData.getTransactionSlip(transactionSlipUID)
      .firstValue()
      .then(x => this.setSelectedTransactionSlip(x))
      .finally(() => this.isLoadingTransaction = false);
  }

  private resetTransactionSlipData() {
    this.transactionSlipsList = [];
    this.setSelectedTransactionSlip(EmptyTransactionSlip);
  }


  private setSelectedTransactionSlip(transactionSlip: TransactionSlip) {
    this.selectedTransactionSlip = transactionSlip;
    this.displayTransactionSlipTabbedView = !isEmpty(this.selectedTransactionSlip.header);
  }

}
