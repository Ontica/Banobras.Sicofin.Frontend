/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { DateStringLibrary, EventInfo, isEmpty } from '@app/core';

import { EmptyTransactionSlip, TransactionSlip } from '@app/models';

import { FormatLibrary, sendEvent } from '@app/shared/utils';

export enum TransactionSlipTabbedViewComponentEventType {
  CLOSE_BUTTON_CLICKED = 'TransactionSlipTabbedViewComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-fa-transaction-slip-tabbed-view',
  templateUrl: './transaction-slip-tabbed-view.component.html',
})
export class TransactionSlipTabbedViewComponent implements OnChanges {

  @Input() transactionSlip: TransactionSlip = EmptyTransactionSlip;

  @Output() transactionSlipTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;


  ngOnChanges() {
    this.setTitle();
  }


  get displayIssuesData(): boolean {
    return this.transactionSlip.issues.length > 0;
  }


  get displayVoucherData(): boolean {
    return !isEmpty(this.transactionSlip.voucher);
  }


  get voucherId(): number {
    return this.displayVoucherData ? +this.transactionSlip.voucher.uid : null;
  }


  onClose() {
    sendEvent(this.transactionSlipTabbedViewEvent,
      TransactionSlipTabbedViewComponentEventType.CLOSE_BUTTON_CLICKED);
  }


  private setTitle() {
    this.title = `${this.transactionSlip.header.slipNumber}: ${this.transactionSlip.header.concept} ` +
      `(${this.transactionSlip.header.statusName})`;

    const accountingDate = DateStringLibrary.format(this.transactionSlip.header.accountingDate);
    const controlTotal = FormatLibrary.numberWithCommas(this.transactionSlip.header.controlTotal, '1.2-2');

    this.hint = `<strong>${this.transactionSlip.header.functionalArea} &nbsp; &nbsp; | &nbsp; &nbsp; ` +
      `${accountingDate} &nbsp; &nbsp; | &nbsp; &nbsp; ${controlTotal}`;
  }

}
