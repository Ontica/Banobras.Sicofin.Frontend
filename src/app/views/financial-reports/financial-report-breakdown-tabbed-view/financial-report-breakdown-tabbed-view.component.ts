/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { EmptyFinancialReportBreakdown, FinancialReportBreakdown} from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum FinancialReportBreakdownTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'FinancialReportBreakdownTabbedViewComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-fa-financial-report-breakdown-tabbed-view',
  templateUrl: './financial-report-breakdown-tabbed-view.component.html',
})
export class FinancialReportBreakdownTabbedViewComponent implements OnChanges {

  @Input() financialReportBreakdown: FinancialReportBreakdown = EmptyFinancialReportBreakdown;

  @Output() financialReportBreakdownTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';
  hint = '';
  selectedTabIndex = 0;

  ngOnChanges() {
    this.setTitle();
  }


  onClose() {
    sendEvent(this.financialReportBreakdownTabbedViewEvent,
      FinancialReportBreakdownTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  private setTitle() {
    this.title = `${this.financialReportBreakdown.financialReportEntry.conceptCode}: ` +
      `${this.financialReportBreakdown.financialReportEntry.concept}`;
    this.hint = `${this.financialReportBreakdown.financialReportEntry.accountsChartName}` +
      ` - ${this.financialReportBreakdown.financialReportEntry.groupName}`;
  }

}
