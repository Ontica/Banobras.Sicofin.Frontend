/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { FinancialReportsDataService } from '@app/data-services';

import { EmptyFinancialReportDesign, EmptyFinancialReportDesignQuery, FinancialReportDesign,
         FinancialReportDesignQuery } from '@app/models';

import {
  FinancialReportDesignerEventType
} from '../financial-report-designer/financial-report-designer.component';

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

  query: FinancialReportDesignQuery = EmptyFinancialReportDesignQuery;

  data: FinancialReportDesign = Object.assign({}, EmptyFinancialReportDesign);


  constructor(private financialReportsData: FinancialReportsDataService) { }


  onFinancialReportSelectorEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as FinancialReportSelectorEventType) {

      case FinancialReportSelectorEventType.SEARCH_REPORT_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = event.payload.query as FinancialReportDesignQuery;
        this.getFinancialReportDesignData();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFinancialReportDesignerEvent(event: EventInfo) {
    switch (event.type as FinancialReportDesignerEventType) {

      case FinancialReportDesignerEventType.REPORT_UPDATED:
        this.getFinancialReportDesignData();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getFinancialReportDesignData() {
    this.setSubmitted(true);
    this.setFinancialReportDesignData(EmptyFinancialReportDesign, false);

    this.financialReportsData.getFinancialReportDesign(this.query.financialReportTypeUID, this.query.date)
      .toPromise()
      .then(x => this.setFinancialReportDesignData(x, true))
      .catch(e => this.setFinancialReportDesignData(EmptyFinancialReportDesign, true))
      .finally(() => {
        this.setText();
        this.setSubmitted(false);
      });
  }


  private setText() {
    if (isEmpty(this.data.config.reportType)) {
      this.cardHint = 'Favor de seleccionar el reporte';
      return;
    }

    this.cardHint = `${this.data.config.accountsChart.name} | ` +
      `${this.data.config.reportType.name} - ` +
      `${this.data.rows.length} registros encontrados`;
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }


  private setFinancialReportDesignData(data: FinancialReportDesign, queryExecuted: boolean) {
    this.data = data;
    this.queryExecuted = queryExecuted;
  }

}
