/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { VouchersDataService } from '@app/data-services';

import { Voucher, VoucherCreatorCases, VoucherFields, VoucherSpecialCaseType } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { Observable } from 'rxjs';

import { VoucherHeaderComponent, VoucherHeaderEventType } from '../voucher-header/voucher-header.component';

import { VoucherSpecialCaseEditorComponent,
         VoucherSpecialCaseEditorEventType } from './voucher-special-case-editor.component';

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

  @ViewChild('voucherSpecialCaseEditor',
              {static: false}) voucherSpecialCaseEditor: VoucherSpecialCaseEditorComponent;

  @Output() voucherCreatorEvent = new EventEmitter<EventInfo>();

  creatorCases = VoucherCreatorCases;

  selectedCreatorCase = VoucherCreatorCases.Manual;

  selectedVoucherType: VoucherSpecialCaseType;

  voucherFieldsValid = false;

  voucherSpecialCaseFieldsValid = false;

  voucherFields: VoucherFields = null;

  submitted = false;

  constructor(private vouchersData: VouchersDataService) {}


  get isSpecialCase(): boolean {
    return this.selectedCreatorCase === VoucherCreatorCases.Special;
  }


  get allowAllLedgersSelection(): boolean {
    return !!this.selectedVoucherType?.allowAllLedgersSelection;
  }


  get readyForSubmit() {
    if (this.isSpecialCase && !this.voucherSpecialCaseFieldsValid) {
      return false;
    }

    return this.voucherFieldsValid;
  }


  onClose() {
    sendEvent(this.voucherCreatorEvent, VoucherCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onCreatorTypeChange() {
    this.voucherSpecialCaseFieldsValid = false;
    this.voucherFields = null;
    this.selectedVoucherType = null;
  }


  onSubmitForm() {
    if (this.submitted) {
      return;
    }

    if (!this.readyForSubmit) {
      this.invalidateForms();
      return;
    }

    let observable = this.vouchersData.createVoucher(this.voucherFields);

    if (this.isSpecialCase) {
      observable = this.vouchersData.createVoucherSpecialCase(this.voucherFields);
    }

    this.createVoucher(observable);
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


  onVoucherSpecialCaseEditorEvent(event: EventInfo): void {
    switch (event.type as VoucherSpecialCaseEditorEventType) {

      case VoucherSpecialCaseEditorEventType.FIELDS_CHANGED:
        Assertion.assertValue(event.payload.isFormValid, 'event.payload.isFormValid');
        Assertion.assertValue(event.payload.voucherSpecialCase, 'event.payload.voucherSpecialCase');

        this.voucherSpecialCaseFieldsValid = event.payload.isFormValid;
        this.voucherFields = Object.assign({}, this.voucherFields, event.payload.voucherSpecialCase);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private invalidateForms() {
    this.voucherHeader.invalidateForm();
    if (this.isSpecialCase) {
      this.voucherSpecialCaseEditor.invalidateForm();
    }
  }


  private createVoucher(createVoucherObserbable: Observable<Voucher>) {
    this.submitted = true;

    createVoucherObserbable
      .toPromise()
      .then(x => {
        sendEvent(this.voucherCreatorEvent, VoucherCreatorEventType.VOUCHER_CREATED, {voucher: x});
        this.onClose();
      })
      .finally(() => this.submitted = false);
  }

}
