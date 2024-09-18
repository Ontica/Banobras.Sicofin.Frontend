/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { EventInfo } from '@app/core';

import { VoucherEntryDescriptor } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

export enum VoucherEntryTableEventType {
  UPDATE_VOUCHER_ENTRY_CLICKED  = 'VoucherEntryTableComponent.Event.UpdateVoucherEntryClicked',
  REMOVE_VOUCHER_ENTRY_CLICKED  = 'VoucherEntryTableComponent.Event.RemoveVoucherEntryClicked',
  REVIEW_VOUCHER_BUTTON_CLICKED = 'VoucherEntryTableComponent.Event.ReviewVoucherButtonClicked',
}

@Component({
  selector: 'emp-fa-voucher-entry-table',
  templateUrl: './voucher-entry-table.component.html',
})
export class VoucherEntryTableComponent implements OnChanges {

  @Input() voucherEntryList: VoucherEntryDescriptor[] = [];

  @Input() canDelete = false;

  @Input() canReviewVoucher = false;

  @Output() voucherEntryTableEvent = new EventEmitter<EventInfo>();

  displayedColumnsDefault: string[] = ['accountNumber', 'sector', 'accountName', 'verificationNumber',
    'responsibilityArea', 'currency', 'exchangeRate', 'debit', 'credit'];

  displayedColumns = [...this.displayedColumnsDefault];

  dataSource: MatTableDataSource<VoucherEntryDescriptor>;

  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.voucherEntryList);
    this.resetColumns();
  }


  onUpdateVoucherEntryClicked(voucherEntry: VoucherEntryDescriptor) {
    if (voucherEntry.itemType === 'TotalsEntry') {
      return;
    }

    if (window.getSelection().toString().length <= 0) {
      sendEvent(this.voucherEntryTableEvent, VoucherEntryTableEventType.UPDATE_VOUCHER_ENTRY_CLICKED,
        {voucherEntry});
    }
  }


  onRemoveVoucherEntryClicked(voucherEntry: VoucherEntryDescriptor) {
    const message = this.getConfirmMessage(voucherEntry);

    this.messageBox.confirm(message, 'Eliminar movimiento', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.voucherEntryTableEvent, VoucherEntryTableEventType.REMOVE_VOUCHER_ENTRY_CLICKED,
            {voucherEntry});
        }
      });
  }


  onReviewVoucherButtonClicked() {
    sendEvent(this.voucherEntryTableEvent, VoucherEntryTableEventType.REVIEW_VOUCHER_BUTTON_CLICKED);
  }


  private resetColumns() {
    this.displayedColumns = [...this.displayedColumnsDefault];

    if (this.canDelete) {
      this.displayedColumns.push('actionDelete');
    }
  }


  private getConfirmMessage(voucherEntry: VoucherEntryDescriptor): string {
    return `
      <table style='margin: 0;'>
        <tr><td class='nowrap'>Tipo de movimiento: </td><td><strong>
          ${voucherEntry.voucherEntryType}
        </strong></td></tr>

        <tr><td class='nowrap'>No. cuenta / Auxiliar: </td><td><strong>
          ${voucherEntry.accountNumber}
          ${voucherEntry.subledgerAccountNumber ? ': ' + voucherEntry.subledgerAccountNumber : ''}
        </strong></td></tr>

        <tr><td class='nowrap'>Descripción / Concepto: </td><td><strong>
          ${voucherEntry.accountName}
          ${voucherEntry.subledgerAccountName ? ': ' + voucherEntry.subledgerAccountName : ''}
        </strong></td></tr>
      </table>

     <br>¿Elimino el movimiento?`;
  }

}
