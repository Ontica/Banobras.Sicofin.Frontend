/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { FinancialReportsDataService } from '@app/data-services';

import { AccountsChartMasterData, EmptyFinancialReportDesign, FinancialReportDesign } from '@app/models';

import { FinancialReportSelectorEventType } from './financial-report-selector.component';

export enum FinancialReportDesignerViewerEventType {
}

@Component({
  selector: 'emp-fa-financial-report-designer-viewer',
  templateUrl: './financial-report-designer-viewer.component.html',
})
export class FinancialReportDesignerViewerComponent {

  @Output() financialReportDesignerViewerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Selecciona el reporte';

  isLoading = false;

  submitted = false;

  commandExecuted = false;

  selectedAccountsChart: AccountsChartMasterData = null;

  selectedFinancialReportTypes: Identifiable = null;

  financialReportDesign: FinancialReportDesign = Object.assign({}, EmptyFinancialReportDesign);


  constructor(private financialReportsData: FinancialReportsDataService) { }


  onFinancialReportSelectorEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as FinancialReportSelectorEventType) {

      case FinancialReportSelectorEventType.SEARCH_REPORT_CLICKED:
        Assertion.assertValue(event.payload.accountChart, 'event.payload.accountChart');
        Assertion.assertValue(event.payload.financialReportType, 'event.payload.financialReportType');

        this.selectedAccountsChart = event.payload.accountChart as AccountsChartMasterData;
        this.selectedFinancialReportTypes = event.payload.financialReportType as Identifiable;

        this.getFinancialReportDesign();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFinancialReportDesignerEvent(event) {

  }


  private getFinancialReportDesign() {
    this.setSubmitted(true);
    this.setFinancialReportDesign(EmptyFinancialReportDesign, false);

    this.financialReportsData.getFinancialReportDesign(this.selectedFinancialReportTypes.uid)
      .toPromise()
      .then(x => {
        this.setFinancialReportDesign(x, true);
        this.setText();
      })
      .finally(() => this.setSubmitted(false));
  }


  private setText() {
    if (isEmpty(this.selectedFinancialReportTypes)) {
      this.cardHint = 'Selecciona el reporte';
      return;
    }

    this.cardHint = `${this.selectedAccountsChart.name} | ` +
      `${this.selectedFinancialReportTypes.name} - ` +
      `${this.financialReportDesign.rows.length} registros encontrados`;
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }


  private setFinancialReportDesign(financialReportDesign: FinancialReportDesign, commandExecuted: boolean) {
    this.financialReportDesign = Object.assign({}, financialReportDesign);
    this.commandExecuted = commandExecuted;
  }

}
