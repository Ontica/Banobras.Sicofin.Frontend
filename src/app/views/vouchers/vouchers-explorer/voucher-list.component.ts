/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { EmptyVoucher, Voucher, VoucherDescriptor } from '@app/models';

import { expandCollapse } from '@app/shared/animations/animations';

import { sendEvent } from '@app/shared/utils';

import { VoucherListItemEventType } from './voucher-list-item.component';

export enum VoucherListEventType {
  VOUCHER_CLICKED                   = 'VoucherListComponent.Event.VoucherClicked',
  VOUCHERS_SELECTED_OPTIONS_CLICKED = 'VoucherListComponent.Event.VouchersSelectedOptionsClicked',
  EXPORT_BUTTON_CLICKED             = 'VoucherListComponent.Event.ExportButtonClicked',
}


@Component({
  selector: 'emp-fa-voucher-list',
  templateUrl: './voucher-list.component.html',
  animations: [
    expandCollapse
  ],
})
export class VoucherListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() voucherList: VoucherDescriptor[] = [];

  @Input() selectedVoucher: Voucher = EmptyVoucher;

  @Input() textNotFound = 'No se ha invocado la búsqueda de pólizas.';

  @Output() voucherListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<VoucherDescriptor>(true, []);

  optionSelected = null;

  optionList = [
    {uid: 'PRINT', name: 'Imprimir'},
    {uid: 'STATUS_1', name: 'Enviar al diario'},
    {uid: 'STATUS_2', name: 'Enviar a otro participante'},
    {uid: 'EXPORT', name: 'Exportar'},
    {uid: 'DELETE', name: 'Eliminar'}
  ];


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucherList) {
      this.scrollToTop();
      this.selection.clear();
    }
  }


  isSelected(voucher: VoucherDescriptor) {
    return (this.selectedVoucher.id === voucher.id);
  }


  onVoucherListItemEvent(event) {

    switch (event.type as VoucherListItemEventType) {

      case VoucherListItemEventType.VOUCHER_CLICKED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');

        sendEvent(this.voucherListEvent, VoucherListEventType.VOUCHER_CLICKED, event.payload);

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
    sendEvent(this.voucherListEvent, VoucherListEventType.VOUCHERS_SELECTED_OPTIONS_CLICKED,
      { vouchers: this.selection.selected, option: this.optionSelected });
  }


  onExportButtonClicked() {
    sendEvent(this.voucherListEvent, VoucherListEventType.EXPORT_BUTTON_CLICKED);
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }
  }

}