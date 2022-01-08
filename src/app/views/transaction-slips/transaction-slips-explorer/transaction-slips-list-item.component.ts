/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { TransactionSlipDescriptor } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum TransactionSlipsListItemEventType {
  TRANSACTION_SLIP_CLICKED = 'TransactionSlipsListItemComponent.Event.TransactionSlipClicked',
}


@Component({
  selector: 'emp-fa-transaction-slips-list-item',
  templateUrl: './transaction-slips-list-item.component.html',
})
export class TransactionSlipsListItemComponent {

  @Input() displayHeader = false;

  @Input() transactionSlip: TransactionSlipDescriptor;

  @Output() transactionSlipsListItemEvent = new EventEmitter<EventInfo>();

  onTransactionSlipClicked(){
    sendEvent(this.transactionSlipsListItemEvent, TransactionSlipsListItemEventType.TRANSACTION_SLIP_CLICKED,
      {transactionSlip: this.transactionSlip});
  }

}
