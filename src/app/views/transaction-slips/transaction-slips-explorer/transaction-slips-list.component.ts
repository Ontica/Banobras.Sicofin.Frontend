/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { EmptyTransactionSlipDescriptor, TransactionSlipDescriptor } from '@app/models';

import { TransactionSlipsListItemEventType } from './transaction-slips-list-item.component';

export enum TransactionSlipsListEventType {
  TRANSACTION_SLIP_CLICKED = 'TransactionSlipsListComponent.Event.TransactionSlipClicked',
  EXPORT_BUTTON_CLICKED    = 'TransactionSlipsListComponent.Event.ExportButtonClicked',
}


@Component({
  selector: 'emp-fa-transaction-slips-list',
  templateUrl: './transaction-slips-list.component.html',
})
export class TransactionSlipsListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() transactionSlipsList: TransactionSlipDescriptor[] = [];

  @Input() selectedTransactionSlip: TransactionSlipDescriptor = EmptyTransactionSlipDescriptor;

  @Input() textNotFound = 'No se ha invocado la búsqueda de volantes.';

  @Output() transactionSlipsListEvent = new EventEmitter<EventInfo>();


  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactionSlipsList) {
      this.scrollToTop();
    }
  }


  onTransactionSlipsListItemEvent(event) {

    switch (event.type as TransactionSlipsListItemEventType) {
      case TransactionSlipsListItemEventType.TRANSACTION_SLIP_CLICKED:
        Assertion.assertValue(event.payload.transactionSlip, 'event.payload.transactionSlip');
        sendEvent(this.transactionSlipsListEvent, TransactionSlipsListEventType.TRANSACTION_SLIP_CLICKED,
          event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }

  }


  onExportButtonClicked() {
    sendEvent(this.transactionSlipsListEvent, TransactionSlipsListEventType.EXPORT_BUTTON_CLICKED);
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }
  }

}
