/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'emp-fa-trial-balance-explorer',
  templateUrl: './trial-balance-explorer.component.html',
})
export class TrialBalanceExplorerComponent {

  @Input() isQuickQuery = false;

  @Output() closeEvent = new EventEmitter<void>();

  onClose() {
    this.closeEvent.emit();
  }

}
