/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { AccountsChart, EmptyAccountsChart } from '@app/models';

export enum AccountsChartControlsEventType {
  EXPORT_BUTTON_CLICKED = 'AccountsChartControlsComponent.Event.ExportButtonClicked',
}

@Component({
  selector: 'emp-fa-accounts-chart-controls',
  templateUrl: './accounts-chart-controls.component.html',
})
export class AccountsChartControlsComponent{

  @Input() accountsChart: AccountsChart = EmptyAccountsChart;

  @Output() accountsChartControlsEvent = new EventEmitter<EventInfo>();


  onExportButtonClicked() {
    this.sendEvent(AccountsChartControlsEventType.EXPORT_BUTTON_CLICKED);
  }


  private sendEvent(eventType: AccountsChartControlsEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.accountsChartControlsEvent.emit(event);
  }

}
