/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit,
         ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { EmptyVoucher, Voucher, VoucherDescriptor } from '@app/models';

import { expandCollapse } from '@app/shared/animations/animations';

import { VoucherListItemEventType } from './voucher-list-item.component';

export enum VoucherListEventType {
  VOUCHER_CLICKED = 'VoucherListComponent.Event.VoucherClicked',
  VOUCHERS_SELECTED_OPTIONS_CLICKED = 'VoucherListComponent.Event.VouchersSelectedOptionsClicked',
}


@Component({
  selector: 'emp-fa-voucher-list',
  templateUrl: './voucher-list.component.html',
  animations: [
    expandCollapse
  ],
})
export class VoucherListComponent implements OnInit, OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() voucherList: VoucherDescriptor[] = [];

  @Input() selectedVoucher: Voucher = EmptyVoucher;

  @Output() voucherListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<VoucherDescriptor>(true, []);

  textNotFound = 'No se ha invocado la búsqueda de pólizas.';

  ngOnInit(): void {
    this.textNotFound = 'No se ha invocado la búsqueda de pólizas.';
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucherList) {
      this.scrollToTop();
      this.selection.clear();
      this.textNotFound = 'No se encontraron pólizas con el filtro proporcionado.';
    }
  }


  isSelected(voucher: VoucherDescriptor) {
    return (this.selectedVoucher.id === voucher.id);
  }


  onVoucherListItemEvent(event) {

    switch (event.type as VoucherListItemEventType) {

      case VoucherListItemEventType.VOUCHER_CLICKED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');

        this.sendEvent(VoucherListEventType.VOUCHER_CLICKED, event.payload);

        return;

      case VoucherListItemEventType.CHECK_CLICKED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');

        this.selection.isSelected(event.payload.voucher) ?
        this.selection.deselect(event.payload.voucher) :
        this.selection.select(event.payload.voucher);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }

  }


  onClickVouchersSelectedOptions() {
    this.sendEvent(VoucherListEventType.VOUCHERS_SELECTED_OPTIONS_CLICKED,
      { vouchers: this.selection.selected });
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }
  }


  private sendEvent(eventType: VoucherListEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.voucherListEvent.emit(event);
  }

}
