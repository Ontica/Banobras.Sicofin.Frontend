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
  DISCARD_CHANGES_CLICKED = 'FinancialReportDesignerControlsComponent.Event.Discardchangesclicked',
  SAVE_BUTTON_CLICKED = 'FinancialReportDesignerControlsComponent.Event.SaveButtonClicked',
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

  @Input() readonly = true;

  @Output() financialReportDesignerControlsEvent = new EventEmitter<EventInfo>();

  @Output() readonlyChange = new EventEmitter<boolean>();


  onClearFilter() {
    this.filter = '';
    this.onFilterData();
  }


  onFilterData() {
    sendEvent(this.financialReportDesignerControlsEvent,
      FinancialReportDesignerControlsEventType.FILTER_CHANGED, {filter: this.filter});
  }


  onToggleReadonlyClicked() {
    this.readonly = !this.readonly;
    this.readonlyChange.emit(this.readonly);

    if (this.readonly) {
      sendEvent(this.financialReportDesignerControlsEvent,
        FinancialReportDesignerControlsEventType.DISCARD_CHANGES_CLICKED);
    }
  }


  onSaveButtonClicked() {
    sendEvent(this.financialReportDesignerControlsEvent,
      FinancialReportDesignerControlsEventType.SAVE_BUTTON_CLICKED);
  }


  onExecuteButtonClicked() {
    sendEvent(this.financialReportDesignerControlsEvent,
      FinancialReportDesignerControlsEventType.EXECUTE_BUTTON_CLICKED);
  }

}
