/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { EmptyVoucherDescriptor, VoucherDescriptor } from '@app/models';

@Component({
  selector: 'emp-fa-voucher-tabbed-view',
  templateUrl: './voucher-tabbed-view.component.html',
})
export class VoucherTabbedViewComponent implements OnInit, OnChanges {

  @Input() voucher: VoucherDescriptor = EmptyVoucherDescriptor;

  @Output() closeEvent = new EventEmitter<void>();

  title = '';
  hint = '';
  selectedTabIndex = 0;

  constructor() { }

  ngOnChanges() {
    this.setTitle();
  }

  ngOnInit(): void {
  }


  onClose() {
    this.closeEvent.emit();
  }


  private setTitle() {
    this.title = `${this.voucher.number}: ${this.voucher.voucherTypeName}`;
    this.hint = this.voucher.ledgerName;
  }

}
