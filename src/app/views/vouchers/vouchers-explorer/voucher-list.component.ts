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

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { EmptyVoucher, Voucher, VoucherDescriptor, VouchersOperationList } from '@app/models';

import { expandCollapse } from '@app/shared/animations/animations';

import { VoucherListItemEventType } from './voucher-list-item.component';

export enum VoucherListEventType {
  VOUCHER_CLICKED                    = 'VoucherListComponent.Event.VoucherClicked',
  EXECUTE_VOUCHERS_OPERATION_CLICKED = 'VoucherListComponent.Event.ExecuteVouchersOperationClicked',
}


@Component({
  selector: 'emp-fa-voucher-list',
  templateUrl: './voucher-list.component.html',
  animations: [expandCollapse],
})
export class VoucherListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() voucherList: VoucherDescriptor[] = [];

  @Input() selectedVoucher: Voucher = EmptyVoucher;

  @Input() textNotFound = 'No se ha invocado la búsqueda de pólizas.';

  @Output() voucherListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<VoucherDescriptor>(true, []);

  operationSelected = null;

  operationsList = VouchersOperationList;

  constructor(private messageBox: MessageBoxService){}


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
        this.selection.toggle(event.payload.voucher);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }

  }


  onExecuteOperationClicked() {
    this.showConfirmMessage();
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }
  }


  private showConfirmMessage() {
    const title = 'Enviar pólizas al diario';
    const message = `Esta operación enviará al diario las
                   <strong> ${this.selection.selected.length} pólizas</strong> seleccionadas.
                   <br><br>¿Envío al diario las pólizas?`;

    this.messageBox.confirm(message, title)
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.voucherListEvent, VoucherListEventType.EXECUTE_VOUCHERS_OPERATION_CLICKED,
            { vouchers: this.selection.selected.map(v => v.id), operation: this.operationSelected });
        }
      });
  }

}
