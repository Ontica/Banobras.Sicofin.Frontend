/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { VoucherHeaderComponentEventType } from '../voucher-header/voucher-header.component';

@Component({
  selector: 'emp-fa-voucher-creator',
  templateUrl: './voucher-creator.component.html',
})
export class VoucherCreatorComponent {

  @Output() closeEvent = new EventEmitter<void>();

  submitted = false;

  onClose() {
    this.closeEvent.emit();
  }


  onVoucherHeaderEvent(event: EventInfo): void {

    if (this.submitted) {
      return;
    }

    switch (event.type as VoucherHeaderComponentEventType) {

      case VoucherHeaderComponentEventType.CREATE_VOUCHER:
        console.log('CREATE_VOUCHER', event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }

}
