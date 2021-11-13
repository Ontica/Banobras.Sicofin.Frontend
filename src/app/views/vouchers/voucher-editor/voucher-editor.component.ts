/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { ImportVouchersDataService, VouchersDataService } from '@app/data-services';

import { EmptyVoucher, EmptyVoucherEntry, isOpenVoucher, Voucher, VoucherEntry, VoucherEntryFields,
         VoucherFields } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { VoucherEntryEditorEventType } from '../voucher-entry-editor/voucher-entry-editor.component';

import { VoucherEntryTableEventType } from '../voucher-entry-table/voucher-entry-table.component';

import { VoucherEntriesImporterEventType } from '../importers/voucher-entries-importer.component';

import { VoucherHeaderComponent, VoucherHeaderEventType } from '../voucher-header/voucher-header.component';

import { VoucherSubmitterEventType } from './voucher-submitter.component';

export enum VoucherEditorEventType {
  VOUCHER_UPDATED = 'VoucherEditorComponent.Event.VoucherUpdated',
  VOUCHER_DELETED = 'VoucherEditorComponent.Event.VoucherDeleted',
}

@Component({
  selector: 'emp-fa-voucher-editor',
  templateUrl: './voucher-editor.component.html',
})
export class VoucherEditorComponent implements OnChanges {

  @ViewChild('voucherHeader') voucherHeader: VoucherHeaderComponent;

  @Input() voucher: Voucher = EmptyVoucher;

  @Output() voucherEditorEvent = new EventEmitter<EventInfo>();

  formEditionMode = false;

  voucherFieldsValid = false;

  voucherFields: VoucherFields;

  submitted = false;

  displayVoucherEntriesImporter = false;

  displayVoucherEntryEditor = false;

  selectedVoucherEntry: VoucherEntry = EmptyVoucherEntry;

  constructor(private vouchersData: VouchersDataService,
              private importVouchersData: ImportVouchersDataService,
              private messageBox: MessageBoxService) {}


  ngOnChanges(changes: SimpleChanges): void {
    this.formEditionMode = false;
    this.voucherFieldsValid = false;
    this.voucherFields = null;
  }


  get canEditVoucher(): boolean {
    return isOpenVoucher(this.voucher.status);
  }


  onVoucherHeaderEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as VoucherHeaderEventType) {

      case VoucherHeaderEventType.FIELDS_CHANGED:
        Assertion.assertValue(event.payload.isFormValid, 'event.payload.isFormValid');
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');

        this.voucherFieldsValid = event.payload.isFormValid;
        this.voucherFields = event.payload.voucher;

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onVoucherSubmitterEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as VoucherSubmitterEventType) {

      case VoucherSubmitterEventType.TOGGLE_EDITION_MODE_CLICKED:
        this.formEditionMode = !this.formEditionMode;
        return;

      case VoucherSubmitterEventType.UPDATE_VOUCHER_CLICKED:
        this.validateUpdateVoucher();
        return;

      case VoucherSubmitterEventType.DELETE_VOUCHER_CLICKED:
        Assertion.assertValue(event.payload.voucher.id, 'event.payload.voucher.id');
        this.deleteVoucher();
        return;

      case VoucherSubmitterEventType.ADD_VOUCHER_ENTRY_CLICKED:
        this.setSelectedVoucherEntry(EmptyVoucherEntry, true);
        return;

      case VoucherSubmitterEventType.SEND_TO_SUPERVISOR_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.voucher.id, 'event.payload.voucher.id');
        this.messageBox.showInDevelopment('Enviar a supervisión', event);
        return;

      case VoucherSubmitterEventType.SEND_TO_LEDGER_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.voucher.id, 'event.payload.voucher.id');
        this.closeVoucher();
        return;

      case VoucherSubmitterEventType.IMPORT_VOUCHER_ENTRIES_BUTTON_CLICKED:
        this.displayVoucherEntriesImporter = true;
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


  onVoucherEntriesImporterEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as VoucherEntriesImporterEventType) {

      case VoucherEntriesImporterEventType.CLOSE_MODAL_CLICKED:
        this.displayVoucherEntriesImporter = false;
        return;

      case VoucherEntriesImporterEventType.VOUCHER_ENTRIES_IMPORTED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');
        this.displayVoucherEntriesImporter = false;
        sendEvent(this.voucherEditorEvent, VoucherEditorEventType.VOUCHER_UPDATED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private validateUpdateVoucher() {
    if (this.formEditionMode) {
      if (!this.voucherFieldsValid) {
        this.voucherHeader.invalidateForm();
        return;
      }
      this.updateVoucher(this.voucherFields);
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


  private validateVoucher() {
    this.submitted = true;

    this.vouchersData.validateVoucher(this.voucher.id)
      .toPromise()
      .then(x => {
        const message = x && x.length > 0 ?
          '<ul class="info-list">' + x.map(y => '<li>' + y + '</li>').join('') + '</ul>' :
          'No se encontraron resultados';
        this.messageBox.show(message, 'Análisis de póliza');
      })
      .finally(() => this.submitted = false);
  }


  private closeVoucher() {
    this.submitted = true;

    this.vouchersData.closeVoucher(this.voucher.id)
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


  private appendVoucherEntry(voucherEntryFields: VoucherEntryFields) {
    this.submitted = true;

    this.vouchersData.appendVoucherEntry(voucherEntryFields.voucherId, voucherEntryFields)
      .toPromise()
      .then(x => {
        this.setSelectedVoucherEntry(EmptyVoucherEntry);
        sendEvent(this.voucherEditorEvent, VoucherEditorEventType.VOUCHER_UPDATED, {voucher: x});
      })
      .finally(() => this.submitted = false);
  }


  private getVoucherEntry(voucherEntryId: number) {
    this.submitted = true;

    this.vouchersData.getVoucherEntry(this.voucher.id, voucherEntryId)
      .toPromise()
      .then(x => {
        this.setSelectedVoucherEntry(x);
      })
      .finally(() => this.submitted = false);
  }


  private updateVoucherEntry(voucherEntryId: number, voucherEntryFields: VoucherEntryFields) {
    this.submitted = true;

    this.vouchersData.updateVoucherEntry(this.voucher.id, voucherEntryId, voucherEntryFields)
      .toPromise()
      .then(x => {
        this.setSelectedVoucherEntry(EmptyVoucherEntry);
        sendEvent(this.voucherEditorEvent, VoucherEditorEventType.VOUCHER_UPDATED, {voucher: x});
      })
      .finally(() => this.submitted = false);
  }


  private deleteVoucherEntry(voucherEntryId: number) {
    this.submitted = true;

    this.vouchersData.deleteVoucherEntry(this.voucher.id, voucherEntryId)
      .toPromise()
      .then(x => {
        sendEvent(this.voucherEditorEvent, VoucherEditorEventType.VOUCHER_UPDATED, {voucher: x});
      })
      .finally(() => this.submitted = false);
  }


  private setSelectedVoucherEntry(voucherEntry: VoucherEntry, display?: boolean) {
    this.selectedVoucherEntry = voucherEntry;
    this.displayVoucherEntryEditor = display ?? this.selectedVoucherEntry.id > 0;
  }

}
