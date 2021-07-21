/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { VouchersDataService } from '@app/data-services';

import { VoucherFields } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { VoucherHeaderEventType } from '../voucher-header/voucher-header.component';

export enum VoucherCreatorEventType {
  CLOSE_MODAL_CLICKED = 'VoucherCreatorComponent.Event.CloseModalClicked',
  VOUCHER_CREATED = 'VoucherCreatorComponent.Event.VoucherCreated',
}

@Component({
  selector: 'emp-fa-voucher-creator',
  templateUrl: './voucher-creator.component.html',
})
export class VoucherCreatorComponent {

  @Output() voucherCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;

  constructor(private vouchersData: VouchersDataService) {}

  onClose() {
    sendEvent(this.voucherCreatorEvent, VoucherCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onVoucherHeaderEvent(event: EventInfo): void {

    if (this.submitted) {
      return;
    }

    switch (event.type as VoucherHeaderEventType) {

      case VoucherHeaderEventType.CREATE_VOUCHER_CLICKED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');
        this.createVoucher(event.payload.voucher as VoucherFields);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private createVoucher(voucherFields: VoucherFields) {
    this.submitted = true;

    this.vouchersData.createVoucher(voucherFields)
      .toPromise()
      .then(x => {
        sendEvent(this.voucherCreatorEvent, VoucherCreatorEventType.VOUCHER_CREATED, {voucher: x});
        this.onClose();
      })
      .finally(() => this.submitted = false);
  }

}
