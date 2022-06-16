/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { FinancialReportsDataService } from '@app/data-services';

import { EmptyFinancialReportDesign, FinancialReportDesign } from '@app/models';

import { FinancialReportDesignerEventType } from '../financial-report-designer/financial-report-designer.component';

import { FinancialReportSelectorEventType } from './financial-report-selector.component';

export enum FinancialReportDesignerViewerEventType {
}

@Component({
  selector: 'emp-fa-financial-report-designer-viewer',
  templateUrl: './financial-report-designer-viewer.component.html',
})
export class FinancialReportDesignerViewerComponent {

  @Output() financialReportDesignerViewerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar el reporte';

  isLoading = false;

  submitted = false;

  queryExecuted = false;

  financialReportTypeUID = '';

  financialReportDesign: FinancialReportDesign = Object.assign({}, EmptyFinancialReportDesign);


  constructor(private financialReportsData: FinancialReportsDataService) { }


  onFinancialReportSelectorEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as FinancialReportSelectorEventType) {

      case FinancialReportSelectorEventType.SEARCH_REPORT_CLICKED:
        Assertion.assertValue(event.payload.financialReportTypeUID, 'event.payload.financialReportTypeUID');
        this.financialReportTypeUID = event.payload.financialReportTypeUID;
        this.getFinancialReportDesign();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFinancialReportDesignerEvent(event: EventInfo) {
    switch (event.type as FinancialReportDesignerEventType) {

      case FinancialReportDesignerEventType.REPORT_UPDATED:
        this.getFinancialReportDesign();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getFinancialReportDesign() {
    this.setSubmitted(true);
    this.setFinancialReportDesign(EmptyFinancialReportDesign, false);

    this.financialReportsData.getFinancialReportDesign(this.financialReportTypeUID)
      .toPromise()
      .then(x => this.setFinancialReportDesign(x, true))
      .catch(e => this.setFinancialReportDesign(EmptyFinancialReportDesign, true))
      .finally(() => {
        this.setText();
        this.setSubmitted(false);
      });
  }


  private setText() {
    if (isEmpty(this.financialReportDesign.config.reportType)) {
      this.cardHint = 'Favor de seleccionar el reporte';
      return;
    }

    this.cardHint = `${this.financialReportDesign.config.accountsChart.name} | ` +
      `${this.financialReportDesign.config.reportType.name} - ` +
      `${this.financialReportDesign.rows.length} registros encontrados`;
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }


  private setFinancialReportDesign(financialReportDesign: FinancialReportDesign, queryExecuted: boolean) {
    this.financialReportDesign = financialReportDesign;
    this.queryExecuted = queryExecuted;
  }

}
