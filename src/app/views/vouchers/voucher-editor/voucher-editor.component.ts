/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { EventInfo } from '@app/core';

import { EmptyVoucherDescriptor, VoucherDescriptor } from '@app/models';

import { VoucherHeaderComponentEventType } from '../voucher-header/voucher-header.component';

@Component({
  selector: 'emp-fa-voucher-editor',
  templateUrl: './voucher-editor.component.html',
})
export class VoucherEditorComponent {

  @Input() voucher: VoucherDescriptor = EmptyVoucherDescriptor;

  submitted = false;

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

}
