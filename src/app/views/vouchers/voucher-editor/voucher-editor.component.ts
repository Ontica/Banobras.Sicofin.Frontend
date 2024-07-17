/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { VouchersDataService } from '@app/data-services';

import { EmptyVoucher, Voucher, VoucherFields, VoucherUpdateFields } from '@app/models';

import { sendEvent } from '@app/shared/utils';

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


  constructor(private vouchersData: VouchersDataService) {}


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucher) {
      this.formEditionMode = false;
      this.voucherFieldsValid = false;
      this.voucherFields = null;
    }
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
      case VoucherSubmitterEventType.UPDATE_VOUCHER_CONCEPT_CLICKED:
        this.validateUpdateVoucher();
        return;
      case VoucherSubmitterEventType.SEND_TO_SUPERVISOR_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.voucher.id, 'event.payload.voucher.id');
        this.sendVoucherToSupervision();
        return;
      case VoucherSubmitterEventType.SEND_TO_LEDGER_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.voucher.id, 'event.payload.voucher.id');
        this.closeVoucher();
        return;
      case VoucherSubmitterEventType.DELETE_VOUCHER_CLICKED:
        Assertion.assertValue(event.payload.voucher.id, 'event.payload.voucher.id');
        this.deleteVoucher();
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

      if (this.voucher.actions.changeConcept) {
        const voucherUpdateFields: VoucherUpdateFields = {
          concept: this.voucherFields.concept,
          accountingDate: this.voucher.accountingDate,
          recordingDate: this.voucher.recordingDate,
        };

        this.updateVoucherConcept(voucherUpdateFields);
      }

      if (this.voucher.actions.editVoucher) {
        this.updateVoucher(this.voucherFields);
      }

    }
  }


  private updateVoucher(voucherFields: VoucherFields) {
    this.submitted = true;

    this.vouchersData.updateVoucher(this.voucher.id, voucherFields)
      .firstValue()
      .then(x => sendEvent(this.voucherEditorEvent, VoucherEditorEventType.VOUCHER_UPDATED, {voucher: x}))
      .finally(() => this.submitted = false);
  }


  private updateVoucherConcept(voucherFields: VoucherUpdateFields) {
    this.submitted = true;

    this.vouchersData.updateVoucherConcept(this.voucher.id, voucherFields)
      .firstValue()
      .then(x => sendEvent(this.voucherEditorEvent, VoucherEditorEventType.VOUCHER_UPDATED, { voucher: x }))
      .finally(() => this.submitted = false);
  }


  private deleteVoucher() {
    this.submitted = true;

    this.vouchersData.deleteVoucher(this.voucher.id)
      .firstValue()
      .then(x => sendEvent(this.voucherEditorEvent, VoucherEditorEventType.VOUCHER_DELETED,
        {voucher: this.voucher}))
      .finally(() => this.submitted = false);
  }


  private sendVoucherToSupervision() {
    this.submitted = true;

    this.vouchersData.sendVoucherToSupervision(this.voucher.id)
      .firstValue()
      .then(x => sendEvent(this.voucherEditorEvent, VoucherEditorEventType.VOUCHER_UPDATED, {voucher: x}))
      .finally(() => this.submitted = false);
  }


  private closeVoucher() {
    this.submitted = true;

    this.vouchersData.closeVoucher(this.voucher.id)
      .firstValue()
      .then(x => sendEvent(this.voucherEditorEvent, VoucherEditorEventType.VOUCHER_UPDATED, {voucher: x}))
      .finally(() => this.submitted = false);
  }

}
