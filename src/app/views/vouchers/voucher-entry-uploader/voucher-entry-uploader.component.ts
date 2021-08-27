/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

export enum VoucherEntryUploaderEventType {
  CLOSE_MODAL_CLICKED  = 'VoucherEntryUploaderComponent.Event.CloseModalClicked',
  IMPORT_VOUCHER_ENTRIES = 'VoucherEntryUploaderComponent.Event.ImportVoucherEntries',
}

@Component({
  selector: 'emp-fa-voucher-entry-uploader',
  templateUrl: './voucher-entry-uploader.component.html',
})
export class VoucherEntryUploaderComponent {

  @Output() voucherEntryUploaderEvent = new EventEmitter<EventInfo>();

  file = null;

  get showFileError(): boolean {
    return !this.file;
  }


  onClose() {
    sendEvent(this.voucherEntryUploaderEvent, VoucherEntryUploaderEventType.CLOSE_MODAL_CLICKED);
  }


  onSubmitForm() {
    if (!this.showFileError) {
      sendEvent(this.voucherEntryUploaderEvent, VoucherEntryUploaderEventType.IMPORT_VOUCHER_ENTRIES,
        {file: this.file.file});
    }
  }

}
