/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

export enum FinancialReportDesignerControlsEventType {
  FILTER_CHANGED        = 'FinancialReportDesignerControlsComponent.Event.FilterChanged',
  EXECUTE_BUTTON_CLICKED = 'FinancialReportDesignerControlsComponent.Event.ExecuteButtonClicked',
}

@Component({
  selector: 'emp-fa-financial-report-designer-controls',
  templateUrl: './financial-report-designer-controls.component.html',
  styles: [`
    .controls-container {
      padding: 0 5px 5px 5px;
      margin: 0 3px 3px 3px;
    }`
  ],
})
export class FinancialReportDesignerControlsComponent {

  @Input() filter = '';

  @Output() financialReportDesignerControlsEvent = new EventEmitter<EventInfo>();


  onClearFilter() {
    this.filter = '';
    this.onFilterData();
  }


  onFilterData() {
    sendEvent(this.financialReportDesignerControlsEvent,
      FinancialReportDesignerControlsEventType.FILTER_CHANGED, {filter: this.filter});
  }


  onExecuteButtonClicked() {
    sendEvent(this.financialReportDesignerControlsEvent,
      FinancialReportDesignerControlsEventType.EXECUTE_BUTTON_CLICKED);
  }

}
