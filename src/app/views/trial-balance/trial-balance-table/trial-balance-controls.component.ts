/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

export enum TrialBalanceControlsEventType {
  FILTER_CHANGED        = 'TrialBalanceControlsComponent.Event.FilterChanged',
  EXPORT_BUTTON_CLICKED = 'TrialBalanceControlsComponent.Event.ExportButtonClicked',
}

@Component({
  selector: 'emp-fa-trial-balance-controls',
  templateUrl: './trial-balance-controls.component.html',
})
export class TrialBalanceControlsComponent {

  @Input() indexSelected = '';

  @Input() filter = '';

  @Output() trialBalanceControlsEvent = new EventEmitter<EventInfo>();


  onClearFilter() {
    this.filter = '';
    this.onFilterData();
  }


  onFilterData() {
    sendEvent(this.trialBalanceControlsEvent, TrialBalanceControlsEventType.FILTER_CHANGED,
      {filter: this.filter, index: this.indexSelected});
  }


  onExportButtonClicked() {
    sendEvent(this.trialBalanceControlsEvent, TrialBalanceControlsEventType.EXPORT_BUTTON_CLICKED);
  }

}
