/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EmptyVoucher, Voucher } from '@app/models';

@Component({
  selector: 'emp-fa-voucher-tabbed-view',
  templateUrl: './voucher-tabbed-view.component.html',
})
export class VoucherTabbedViewComponent implements OnChanges {

  @Input() voucher: Voucher = EmptyVoucher;

  @Output() closeEvent = new EventEmitter<void>();

  title = '';
  hint = '';
  selectedTabIndex = 0;

  ngOnChanges() {
    this.setTitle();
  }


  onClose() {
    this.closeEvent.emit();
  }


  private setTitle() {
    this.title = `${this.voucher.number}: ${this.voucher.voucherType.name}`;
    this.hint = this.voucher.ledger.name;
  }

}
