/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { EmptySearchVouchersCommand, EmptyVoucherDescriptor, SearchVouchersCommand,
         VoucherDescriptor } from '@app/models';

import { expandCollapse } from '@app/shared/animations/animations';

import { VoucherListEventType } from '../voucher-list/voucher-list.component';

export enum VouchersExplorerEventType {
  FILTER_CHANGED = 'VouchersExplorerComponent.Event.FilterChanged',
  SELECT_VOUCHER = 'VouchersExplorerComponent.Event.SelectVoucher',
  SELECT_VOUCHERS_OPTION = 'VouchersExplorerComponent.Event.SelectVouchersOption',
  CREATE_VOUCHER_CLICKED = 'VouchersExplorerComponent.Event.CreateVoucherClicked',
  IMPORT_VOUCHERS_CLICKED = 'VouchersExplorerComponent.Event.ImportVouchersClicked',
}


@Component({
  selector: 'emp-fa-vouchers-explorer',
  templateUrl: './vouchers-explorer.component.html',
  animations: [
    expandCollapse
  ],
})
export class VouchersExplorerComponent implements OnInit, OnChanges {

  @Input() voucherList: VoucherDescriptor[] = [];

  @Input() selectedVoucher: VoucherDescriptor = EmptyVoucherDescriptor;

  @Input() filter: SearchVouchersCommand = EmptySearchVouchersCommand;

  @Input() title = 'Pólizas';

  @Input() isLoading = false;

  @Output() vouchersExplorerEvent = new EventEmitter<EventInfo>();

  hintText = '';

  textNotFound = 'No se ha invocado la búsqueda de pólizas.';

  ngOnInit(): void {
    this.hintText = 'Selecciona los filtros';
    this.textNotFound = 'No se ha invocado la búsqueda de pólizas.';
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucherList) {
      this.hintText = this.voucherList.length + ' pólizas encontradas';
      this.textNotFound = 'No se encontraron pólizas con el filtro proporcionado.';
    }
  }


  onChangeFilter(event) {
    Assertion.assertValue(event.payload, 'event.payload');

    this.sendEvent(VouchersExplorerEventType.FILTER_CHANGED, event.payload);
  }


  onClickCreateVoucher() {
    this.sendEvent(VouchersExplorerEventType.CREATE_VOUCHER_CLICKED);
  }


  onClickImportVouchers() {
    this.sendEvent(VouchersExplorerEventType.IMPORT_VOUCHERS_CLICKED);
  }


  onVoucherListEvent(event) {
    switch (event.type as VoucherListEventType) {

      case VoucherListEventType.VOUCHER_CLICKED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');

        this.sendEvent(VouchersExplorerEventType.SELECT_VOUCHER, event.payload);

        return;

      case VoucherListEventType.VOUCHERS_SELECTED_OPTIONS_CLICKED:
        Assertion.assertValue(event.payload.vouchers, 'event.payload.vouchers');

        this.sendEvent(VouchersExplorerEventType.SELECT_VOUCHERS_OPTION, event.payload);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private sendEvent(eventType: VouchersExplorerEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.vouchersExplorerEvent.emit(event);
  }

}
