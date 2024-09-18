/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { VouchersDataService } from '@app/data-services';

import { EmptyVoucher, EmptyVoucherEntry, Voucher, VoucherEntry, VoucherEntryFields } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';

import { VoucherEntryEditorEventType } from '../voucher-entry-editor/voucher-entry-editor.component';

import { VoucherEntryTableEventType } from '../voucher-entry-table/voucher-entry-table.component';

export enum VoucherEntriesEditorEventType {
  VOUCHER_UPDATED = 'VoucherEntriesEditorComponent.Event.VoucherUpdated',
}

@Component({
  selector: 'emp-fa-voucher-entries-editor',
  templateUrl: './voucher-entries-editor.component.html',
})
export class VoucherEntriesEditorComponent {

  @Input() voucher: Voucher = EmptyVoucher;

  @Output() voucherEntriesEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;

  displayVoucherEntryEditor = false;

  selectedVoucherEntry: VoucherEntry = EmptyVoucherEntry;

  displayExportModal = false;

  fileUrl = '';

  constructor(private vouchersData: VouchersDataService,
              private messageBox: MessageBoxService) {}


  get canEditEntries(): boolean {
    return this.voucher.actions.editVoucher;
  }


  onExportButtonClicked() {
    this.setDisplayExportModal(true);
  }


  onExportReportModalEvent(event: EventInfo) {
    switch (event.type as ExportReportModalEventType) {

      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;

      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        this.exportVoucherEntries();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onAddVoucherEntryClicked() {
    this.setSelectedVoucherEntry(EmptyVoucherEntry, true);
  }


  onVoucherEntryTableEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as VoucherEntryTableEventType) {

      case VoucherEntryTableEventType.UPDATE_VOUCHER_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.voucherEntry.id, 'event.payload.voucherEntry.id');
        this.getVoucherEntry(event.payload.voucherEntry.id);
        return;

      case VoucherEntryTableEventType.REMOVE_VOUCHER_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.voucherEntry.id, 'event.payload.voucherEntry.id');
        this.deleteVoucherEntry(event.payload.voucherEntry.id);
        return;

      case VoucherEntryTableEventType.REVIEW_VOUCHER_BUTTON_CLICKED:
        this.validateVoucher();
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
        Assertion.assertValue(event.payload.voucherEntry, 'event.payload.voucherEntry');
        this.appendVoucherEntry(event.payload.voucherEntry as VoucherEntryFields);
        return;

      case VoucherEntryEditorEventType.UPDATE_VOUCHER_ENTRY:
        Assertion.assertValue(event.payload.voucherEntry, 'event.payload.voucherEntry');
        Assertion.assertValue(event.payload.voucherEntryId, 'event.payload.voucherEntryId');
        this.updateVoucherEntry(event.payload.voucherEntryId,
                                event.payload.voucherEntry as VoucherEntryFields);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private validateVoucher() {
    this.submitted = true;

    this.vouchersData.validateVoucher(this.voucher.id)
      .firstValue()
      .then(x => {
        const message = x && x.length > 0 ?
          '<ul class="info-list">' + x.map(y => '<li>' + y + '</li>').join('') + '</ul>' :
          'No se encontraron resultados';
        this.messageBox.show(message, 'Análisis de póliza');
      })
      .finally(() => this.submitted = false);
  }


  private appendVoucherEntry(voucherEntryFields: VoucherEntryFields) {
    this.submitted = true;

    this.vouchersData.appendVoucherEntry(voucherEntryFields.voucherId, voucherEntryFields)
      .firstValue()
      .then(x => {
        this.setSelectedVoucherEntry(EmptyVoucherEntry);
        sendEvent(this.voucherEntriesEditorEvent, VoucherEntriesEditorEventType.VOUCHER_UPDATED,
          {voucher: x});
      })
      .finally(() => this.submitted = false);
  }


  private getVoucherEntry(voucherEntryId: number) {
    this.submitted = true;

    this.vouchersData.getVoucherEntry(this.voucher.id, voucherEntryId)
      .firstValue()
      .then(x => this.setSelectedVoucherEntry(x))
      .finally(() => this.submitted = false);
  }


  private updateVoucherEntry(voucherEntryId: number, voucherEntryFields: VoucherEntryFields) {
    this.submitted = true;

    this.vouchersData.updateVoucherEntry(this.voucher.id, voucherEntryId, voucherEntryFields)
      .firstValue()
      .then(x => {
        this.setSelectedVoucherEntry(EmptyVoucherEntry);
        sendEvent(this.voucherEntriesEditorEvent, VoucherEntriesEditorEventType.VOUCHER_UPDATED,
          {voucher: x});
      })
      .finally(() => this.submitted = false);
  }


  private deleteVoucherEntry(voucherEntryId: number) {
    this.submitted = true;

    this.vouchersData.deleteVoucherEntry(this.voucher.id, voucherEntryId)
      .firstValue()
      .then(x => {
        sendEvent(this.voucherEntriesEditorEvent, VoucherEntriesEditorEventType.VOUCHER_UPDATED,
          {voucher: x});
      })
      .finally(() => this.submitted = false);
  }


  private exportVoucherEntries() {
    this.vouchersData.exportVoucherEntries(this.voucher.id)
      .firstValue()
      .then(x => this.fileUrl = x.url);
  }


  private setSelectedVoucherEntry(voucherEntry: VoucherEntry, display?: boolean) {
    this.selectedVoucherEntry = voucherEntry;
    this.displayVoucherEntryEditor = display ?? this.selectedVoucherEntry.id > 0;
  }


  private setDisplayExportModal(display: boolean) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }

}
