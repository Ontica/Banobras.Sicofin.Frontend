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
  styles: [`
    .preview-container {
      width: 100%;
      height: 100%;
    }

    .object-preview-container {
      width: 100%;
      height: 100%;
      padding: 3px;
    }

    .object-preview {
      width: 100%;
      height: 100%;
    }`
  ],
})
export class VoucherPrintableComponentViewerComponent implements OnChanges {

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
      .toPromise()
      .then(x => this.url = x.url ? x.url + '#view=fitH' : '')
      .finally(() => this.isLoading = false);
  }

}
