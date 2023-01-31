/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PermissionsLibrary } from '@app/main-layout';

import { EmptyVoucher, EmptyVoucherFilterData, Voucher, VoucherDescriptor,
         VoucherFilterData } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { VoucherFilterEventType } from './voucher-filter.component';

import { VoucherListEventType } from './voucher-list.component';

export enum VouchersExplorerEventType {
  FILTER_CHANGED = 'VouchersExplorerComponent.Event.FilterChanged',
  FILTER_CLEARED = 'VouchersExplorerComponent.Event.FilterCleared',
  SELECT_VOUCHER_CLICKED = 'VouchersExplorerComponent.Event.SelectVoucherClicked',
  EXECUTE_VOUCHERS_OPERATION_CLICKED = 'VouchersExplorerComponent.Event.ExecuteVouchersOperationClicked',
  CREATE_VOUCHER_BUTTON_CLICKED = 'VouchersExplorerComponent.Event.CreateVoucherButtonClicked',
  IMPORT_VOUCHERS_BUTTON_CLICKED = 'VouchersExplorerComponent.Event.ImportVouchersButtonClicked',
  EXPORT_VOUCHERS_BUTTON_CLICKED = 'VouchersExplorerComponent.Event.ExportVouchersButtonClicked',
}


@Component({
  selector: 'emp-fa-vouchers-explorer',
  templateUrl: './vouchers-explorer.component.html',
})
export class VouchersExplorerComponent implements OnInit, OnChanges {

  @Input() voucherFilterData: VoucherFilterData = Object.assign({}, EmptyVoucherFilterData);

  @Input() voucherList: VoucherDescriptor[] = [];

  @Input() selectedVoucher: Voucher = EmptyVoucher;

  @Input() isLoading = false;

  @Output() vouchersExplorerEvent = new EventEmitter<EventInfo>();

  hintText = '';

  textNotFound = '';

  showFilters = false;

  searching = false;

  permissionsToImportVouchers = [
    PermissionsLibrary.FEATURE_POLIZAS_IMPORTACION_DESDE_ARCHIVOS,
    PermissionsLibrary.FEATURE_POLIZAS_IMPORTACION_SISTEMAS_TRANSVERSALES,
  ];

  permissionToCreateVoucher = PermissionsLibrary.FEATURE_POLIZAS_EDICION_MANUAL;

  ngOnInit(): void {
    this.setInitTexts();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucherList) {
      this.setInitTexts();

      if (this.searching) {
        this.searching = false;
        this.showFilters = false;
      }
    }
  }


  onChangeFilter(event) {
    switch (event.type as VoucherFilterEventType) {

      case VoucherFilterEventType.SEARCH_VOUCHERS_CLICKED:
        Assertion.assertValue(event.payload, 'event.payload');

        this.searching = true;

        sendEvent(this.vouchersExplorerEvent, VouchersExplorerEventType.FILTER_CHANGED,
          event.payload as VoucherFilterData);

        return;

      case VoucherFilterEventType.CLEAR_VOUCHERS_CLICKED:
        Assertion.assertValue(event.payload, 'event.payload');

        this.searching = false;

        sendEvent(this.vouchersExplorerEvent, VouchersExplorerEventType.FILTER_CLEARED,
          event.payload as VoucherFilterData);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onClickCreateVoucher() {
    sendEvent(this.vouchersExplorerEvent, VouchersExplorerEventType.CREATE_VOUCHER_BUTTON_CLICKED);
  }


  onClickImportVouchers() {
    sendEvent(this.vouchersExplorerEvent, VouchersExplorerEventType.IMPORT_VOUCHERS_BUTTON_CLICKED);
  }


  onVoucherListEvent(event) {
    switch (event.type as VoucherListEventType) {

      case VoucherListEventType.VOUCHER_CLICKED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');

        sendEvent(this.vouchersExplorerEvent, VouchersExplorerEventType.SELECT_VOUCHER_CLICKED,
          event.payload);

        return;

      case VoucherListEventType.EXECUTE_VOUCHERS_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        Assertion.assertValue(event.payload.command.vouchers, 'event.payload.command.vouchers');

        sendEvent(this.vouchersExplorerEvent, VouchersExplorerEventType.EXECUTE_VOUCHERS_OPERATION_CLICKED,
          event.payload);

        return;

      case VoucherListEventType.EXPORT_BUTTON_CLICKED:

        sendEvent(this.vouchersExplorerEvent, VouchersExplorerEventType.EXPORT_VOUCHERS_BUTTON_CLICKED);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setInitTexts() {
    this.hintText = this.searching || this.voucherList.length > 0 ?
      this.voucherList.length + ' pólizas encontradas' : 'Seleccionar los filtros';

    this.textNotFound = this.searching ?
      'No se encontraron pólizas con el filtro proporcionado.' : 'No se ha invocado la búsqueda de pólizas.';
  }

}
