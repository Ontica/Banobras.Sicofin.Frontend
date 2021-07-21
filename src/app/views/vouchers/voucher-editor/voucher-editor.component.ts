/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { VouchersDataService } from '@app/data-services';

import { EmptyVoucher, EmptyVoucherEntry, Voucher, VoucherEntry, VoucherFields } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { VoucherEntryEditorEventType } from '../voucher-entry-editor/voucher-entry-editor.component';

import { VoucherEntryTableEventType } from '../voucher-entry-table/voucher-entry-table.component';

import { VoucherHeaderEventType } from '../voucher-header/voucher-header.component';

export enum VoucherEditorEventType {
  VOUCHER_UPDATED = 'VoucherEditorComponent.Event.VoucherUpdated',
  VOUCHER_DELETED = 'VoucherEditorComponent.Event.VoucherDeleted',
}

@Component({
  selector: 'emp-fa-voucher-editor',
  templateUrl: './voucher-editor.component.html',
})
export class VoucherEditorComponent {

  @Input() voucher: Voucher = EmptyVoucher;

  @Output() voucherEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayVoucherEntryEditor = false;

  selectedVoucherEntry: VoucherEntry = EmptyVoucherEntry;

  constructor(private vouchersData: VouchersDataService) {}

  onVoucherHeaderEvent(event: EventInfo): void {

    if (this.submitted) {
      return;
    }

    switch (event.type as VoucherHeaderEventType) {

      case VoucherHeaderEventType.UPDATE_VOUCHER_CLICKED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');
        this.updateVoucher(event.payload.voucher as VoucherFields);
        return;

      case VoucherHeaderEventType.DELETE_VOUCHER_CLICKED:
        Assertion.assertValue(event.payload.voucher.id, 'event.payload.voucher.id');
        this.deleteVoucher();
        return;

      case VoucherHeaderEventType.ADD_VOUCHER_ENTRY_CLICKED:
        this.setSelectedVoucherEntry(EmptyVoucherEntry, true);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onVoucherEntryTableEvent(event: EventInfo): void {

    if (this.submitted) {
      return;
    }

    switch (event.type as VoucherEntryTableEventType) {

      case VoucherEntryTableEventType.UPDATE_VOUCHER_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.voucherEntry, 'event.payload.voucherEntry');

        this.setSelectedVoucherEntry(event.payload.voucherEntry as VoucherEntry);

        return;

      case VoucherEntryTableEventType.REMOVE_VOUCHER_ENTRY_CLICKED:
        console.log('REMOVE_VOUCHER_ENTRY_CLICKED', event.payload.voucherEntry);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onVoucherEntryEditorEvent(event: EventInfo): void {

    if (this.submitted) {
      return;
    }

    switch (event.type as VoucherEntryEditorEventType) {

      case VoucherEntryEditorEventType.CLOSE_MODAL_CLICKED:
        this.setSelectedVoucherEntry(EmptyVoucherEntry);

        return;

      case VoucherEntryEditorEventType.CREATE_VOUCHER_ENTRY:
        console.log('CREATE_VOUCHER_ENTRY', event.payload);
        return;

      case VoucherEntryEditorEventType.UPDATE_VOUCHER_ENTRY:
        console.log('UPDATE_VOUCHER_ENTRY', event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateVoucher(voucherFields: VoucherFields) {
    this.submitted = true;

    this.vouchersData.updateVoucher(this.voucher.id, voucherFields)
      .toPromise()
      .then(x => {
        sendEvent(this.voucherEditorEvent, VoucherEditorEventType.VOUCHER_UPDATED, {voucher: x});
      })
      .finally(() => this.submitted = false);
  }


  private deleteVoucher() {
    this.submitted = true;

    this.vouchersData.deleteVoucher(this.voucher.id)
      .toPromise()
      .then(x => {
        sendEvent(this.voucherEditorEvent, VoucherEditorEventType.VOUCHER_DELETED, {voucher: this.voucher});
      })
      .finally(() => this.submitted = false);
  }


  private setSelectedVoucherEntry(voucherEntry: VoucherEntry, display?: boolean) {
    this.selectedVoucherEntry = voucherEntry;
    this.displayVoucherEntryEditor = display ?? this.selectedVoucherEntry.id > 0;
  }

}
