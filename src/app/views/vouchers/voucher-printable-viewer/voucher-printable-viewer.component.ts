/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { VouchersDataService } from '@app/data-services';

@Component({
  selector: 'emp-fa-voucher-printable-viewer',
  templateUrl: './voucher-printable-viewer.component.html',
})
export class VoucherPrintableViewerComponent implements OnChanges {

  @Input() voucherId: number;

  url = '';

  isLoading = false;

  constructor(private vouchersData: VouchersDataService) {}


  ngOnChanges() {
    this.url = null;
    this.getVoucherForPrint();
  }


  private getVoucherForPrint() {
    if (!this.voucherId) {
      return;
    }

    this.isLoading = true;

    this.vouchersData.getVoucherForPrint(this.voucherId)
      .firstValue()
      .then(x => this.url = x.url)
      .finally(() => this.isLoading = false);
  }

}
