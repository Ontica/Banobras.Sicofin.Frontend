/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { EmptyVoucher, EmptyVoucherEntry, Voucher, VoucherEntry } from '@app/models';

import { VoucherEntryTableEventType } from '../voucher-entry-table/voucher-entry-table.component';

import { VoucherHeaderComponentEventType } from '../voucher-header/voucher-header.component';

@Component({
  selector: 'emp-fa-voucher-editor',
  templateUrl: './voucher-editor.component.html',
})
export class VoucherEditorComponent {

  @Input() voucher: Voucher = EmptyVoucher;

  submitted = false;

  displayVoucherEntryEditor = false;

  selectedVoucherEntry: VoucherEntry = EmptyVoucherEntry;


  onVoucherHeaderEvent(event: EventInfo): void {

    if (this.submitted) {
      return;
    }

    switch (event.type as VoucherHeaderComponentEventType) {

      case VoucherHeaderComponentEventType.UPDATE_VOUCHER:
        console.log('UPDATE_VOUCHER', event.payload);
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

        // TODO: call getVoucherEntry WS
        this.displayVoucherEntryEditor = true;
        this.selectedVoucherEntry = event.payload.voucherEntry as VoucherEntry;

        return;

      case VoucherEntryTableEventType.REMOVE_VOUCHER_ENTRY_CLICKED:
        console.log('REMOVE_VOUCHER_ENTRY_CLICKED', event.payload.voucherEntry);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
