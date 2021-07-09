/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { EmptySearchVouchersCommand, EmptyVoucher, SearchVouchersCommand, Voucher,
         VoucherDescriptor } from '@app/models';

import { expandCollapse } from '@app/shared/animations/animations';
import { VoucherFilterEventType } from '../voucher-filter/voucher-filter.component';

import { VoucherListEventType } from '../voucher-list/voucher-list.component';

export enum VouchersExplorerEventType {
  FILTER_CHANGED = 'VouchersExplorerComponent.Event.FilterChanged',
  FILTER_CLEARED = 'VouchersExplorerComponent.Event.FilterCleared',
  SELECT_VOUCHER = 'VouchersExplorerComponent.Event.SelectVoucher',
  SELECT_VOUCHERS_OPTION = 'VouchersExplorerComponent.Event.SelectVouchersOption',
  CREATE_VOUCHER = 'VouchersExplorerComponent.Event.CreateVoucher',
  IMPORT_VOUCHERS = 'VouchersExplorerComponent.Event.ImportVouchers',
  EXPORT_VOUCHERS = 'VouchersExplorerComponent.Event.ExportVouchers',
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

  @Input() selectedVoucher: Voucher = EmptyVoucher;

  @Input() filter: SearchVouchersCommand = Object.assign({}, EmptySearchVouchersCommand);

  @Input() isLoading = false;

  @Output() vouchersExplorerEvent = new EventEmitter<EventInfo>();

  hintText = '';

  textNotFound = '';

  showFilters = false;

  searching = false;

  ngOnInit(): void {
    this.setInitTexts();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucherList) {
      if (this.searching) {
        this.hintText = this.voucherList.length + ' pólizas encontradas';
        this.textNotFound = 'No se encontraron pólizas con el filtro proporcionado.';
        this.searching = false;
        this.showFilters = false;
      } else {
        this.setInitTexts();
      }
    }
  }


  onChangeFilter(event) {
    switch (event.type as VoucherFilterEventType) {

      case VoucherFilterEventType.SEARCH_VOUCHERS_CLICKED:
        Assertion.assertValue(event.payload, 'event.payload');

        this.searching = true;

        this.sendEvent(VouchersExplorerEventType.FILTER_CHANGED, event.payload as SearchVouchersCommand);

        return;

      case VoucherFilterEventType.CLEAR_VOUCHERS_CLICKED:
        Assertion.assertValue(event.payload, 'event.payload');

        this.searching = false;

        this.sendEvent(VouchersExplorerEventType.FILTER_CLEARED, event.payload as SearchVouchersCommand);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onClickCreateVoucher() {
    this.sendEvent(VouchersExplorerEventType.CREATE_VOUCHER);
  }


  onClickImportVouchers() {
    this.sendEvent(VouchersExplorerEventType.IMPORT_VOUCHERS);
  }


  onVoucherListEvent(event) {
    switch (event.type as VoucherListEventType) {

      case VoucherListEventType.VOUCHER_CLICKED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');

        this.sendEvent(VouchersExplorerEventType.SELECT_VOUCHER, event.payload);

        return;

      case VoucherListEventType.VOUCHERS_SELECTED_OPTIONS_CLICKED:
        Assertion.assertValue(event.payload.vouchers, 'event.payload.vouchers');
        Assertion.assertValue(event.payload.option, 'event.payload.option');

        this.sendEvent(VouchersExplorerEventType.SELECT_VOUCHERS_OPTION, event.payload);

        return;

      case VoucherListEventType.EXPORT_BUTTON_CLICKED:

        this.sendEvent(VouchersExplorerEventType.EXPORT_VOUCHERS);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setInitTexts() {
    this.hintText = 'Selecciona los filtros';
    this.textNotFound = 'No se ha invocado la búsqueda de pólizas.';
  }


  private sendEvent(eventType: VouchersExplorerEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.vouchersExplorerEvent.emit(event);
  }

}
