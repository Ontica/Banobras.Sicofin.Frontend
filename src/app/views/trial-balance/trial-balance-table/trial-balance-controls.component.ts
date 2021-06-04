/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

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
    this.sendEvent(TrialBalanceControlsEventType.FILTER_CHANGED,
                  {filter: this.filter, index: this.indexSelected});
  }


  private sendEvent(eventType: TrialBalanceControlsEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.trialBalanceControlsEvent.emit(event);
  }

}
