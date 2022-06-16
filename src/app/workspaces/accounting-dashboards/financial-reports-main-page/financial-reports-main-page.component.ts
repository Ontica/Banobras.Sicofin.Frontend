/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, isEmpty } from '@app/core';

import { EmptyFinancialReportBreakdown, FinancialReportBreakdown } from '@app/models';

import {
  FinancialReportBreakdownTabbedViewEventType
} from '@app/views/financial-reports/financial-report-breakdown-tabbed-view/financial-report-breakdown-tabbed-view.component';

import {
  FinancialReportViewerEventType
} from '@app/views/financial-reports/financial-report-viewer/financial-report-viewer.component';

@Component({
  selector: 'emp-fa-financial-reports-main-page',
  templateUrl: './financial-reports-main-page.component.html',
})
export class FinancialReportsMainPageComponent {

  displayFinancialReportBreakdown = false;

  selectedFinancialReportBreakdown: FinancialReportBreakdown = EmptyFinancialReportBreakdown;


  onFinancialReportViewerEvent(event) {
    switch (event.type as FinancialReportViewerEventType) {
      case FinancialReportViewerEventType.FINANCIAL_REPORT_ENTRY_SELECTED:
        Assertion.assertValue(event.payload.financialReportBreakdown,
          'event.payload.financialReportBreakdown');
        this.setFinancialReportBreakdown(event.payload.financialReportBreakdown);
        break;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFinancialReportBreakdownTabbedViewEvent(event) {
    switch (event.type as FinancialReportBreakdownTabbedViewEventType) {
      case FinancialReportBreakdownTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setFinancialReportBreakdown(EmptyFinancialReportBreakdown);
        break;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  setFinancialReportBreakdown(financialReportBreakdown: FinancialReportBreakdown) {
    this.selectedFinancialReportBreakdown = financialReportBreakdown;
    this.displayFinancialReportBreakdown =
      !isEmpty(this.selectedFinancialReportBreakdown.financialReportEntry);
  }

}
