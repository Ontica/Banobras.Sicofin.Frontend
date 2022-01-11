/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { EmptyTransactionSlipDescriptor, TransactionSlipDescriptor } from '@app/models';


@Component({
  selector: 'emp-fa-transaction-slip-view',
  templateUrl: './transaction-slip-view.component.html',
})
export class TransactionSlipViewComponent {

  @Input() transactionSlip: TransactionSlipDescriptor = EmptyTransactionSlipDescriptor;

  @Input() displayVoucherData = false;

}
