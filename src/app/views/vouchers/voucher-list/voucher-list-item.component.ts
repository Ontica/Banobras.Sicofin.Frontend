/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { VoucherDescriptor } from '@app/models';

export enum VoucherListItemEventType {
  VOUCHER_CLICKED = 'VoucherListItemComponent.Event.VoucherClicked',
  CHECK_CLICKED = 'VoucherListItemComponent.Event.CheckClicked',
}


@Component({
  selector: 'emp-fa-voucher-list-item',
  templateUrl: './voucher-list-item.component.html',
})
export class VoucherListItemComponent {

  // Header mode

  @Input() displayHeader = false;

  @Input() voucherList: VoucherDescriptor[] = [];

  @Input() selection = new SelectionModel<VoucherDescriptor>(true, []);

  // Item mode

  @Input() voucher: VoucherDescriptor;

  @Input() selected = false;

  @Output() voucherListItemEvent = new EventEmitter<EventInfo>();


  onVoucherClicked(){
    this.sendEvent(VoucherListItemEventType.VOUCHER_CLICKED, {voucher: this.voucher});
  }


  onClickVoucherCheck() {
    this.sendEvent(VoucherListItemEventType.CHECK_CLICKED, {voucher: this.voucher});
  }


  private sendEvent(eventType: VoucherListItemEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.voucherListItemEvent.emit(event);
  }

}
