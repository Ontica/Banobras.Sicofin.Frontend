/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { VouchersDataService } from '@app/data-services';

import { VoucherFields } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { VoucherHeaderComponent, VoucherHeaderEventType } from '../voucher-header/voucher-header.component';

export enum VoucherCreatorEventType {
  CLOSE_MODAL_CLICKED = 'VoucherCreatorComponent.Event.CloseModalClicked',
  VOUCHER_CREATED = 'VoucherCreatorComponent.Event.VoucherCreated',
}

@Component({
  selector: 'emp-fa-voucher-creator',
  templateUrl: './voucher-creator.component.html',
})
export class VoucherCreatorComponent {

  @ViewChild('voucherHeader') voucherHeader: VoucherHeaderComponent;

  @Output() voucherCreatorEvent = new EventEmitter<EventInfo>();

  selectedVoucherType: Identifiable;

  voucherFieldsValid = false;

  voucherFields: VoucherFields = null;

  submitted = false;

  constructor(private vouchersData: VouchersDataService) {}


  get readyForSubmit() {
    return this.voucherFieldsValid;
  }


  onClose() {
    sendEvent(this.voucherCreatorEvent, VoucherCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onSubmitForm() {
    if (this.submitted) {
      return;
    }

    if (!this.readyForSubmit) {
      this.invalidateForms();
      return;
    }

    this.createVoucher(this.voucherFields);
  }


  onVoucherHeaderEvent(event: EventInfo): void {
    switch (event.type as VoucherHeaderEventType) {

      case VoucherHeaderEventType.FIELDS_CHANGED:
        Assertion.assertValue(event.payload.isFormValid, 'event.payload.isFormValid');
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');

        this.voucherFieldsValid = event.payload.isFormValid;
        this.voucherFields = Object.assign({}, this.voucherFields, event.payload.voucher);

        return;

      case VoucherHeaderEventType.VOUCHER_TYPE_CHANGED:
        Assertion.assertValue(event.payload.voucherType, 'event.payload.voucherType');

        this.selectedVoucherType = event.payload.voucherType;

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private invalidateForms() {
    this.voucherHeader.invalidateForm();
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
