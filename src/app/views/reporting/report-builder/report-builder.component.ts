/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { View } from '@app/main-layout';

import { ReportingDataService } from '@app/data-services';

import { FileType, FinancialReportBreakdown, FinancialReportQuery, ReportGroup, ReportQuery, ReportType,
         ReportData, EmptyReportData, ReportTypeFlags, EmptyReportType } from '@app/models';

import { ReportViewerEventType } from './report-viewer.component';

import { OperationalReportFilterEventType } from './reports-filters/operational-report-filter.component';

import { FinancialReportFilterEventType } from './reports-filters/financial-report-filter.component';

import {
  FinancialReportBreakdownTabbedViewEventType
} from './reports-breakdown/financial-report-breakdown-tabbed-view.component';

@Component({
  selector: 'emp-fa-report-builder',
  templateUrl: './report-builder.component.html',
})
export class ReportBuilderComponent implements OnInit, OnDestroy {

  reportGroup: ReportGroup;

  ReportGroups = ReportGroup;

  isLoading = false;

  queryExecuted = false;

  reportQuery: ReportQuery = Object.assign({});

  selectedReportType: ReportType<ReportTypeFlags> = EmptyReportType;

  reportData: ReportData = Object.assign({}, EmptyReportData);

  isLoadingBreakdown = false;

  displayReportBreakdown = false;

  selectedReportBreakdown: any = null;

  fileUrl = '';

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private reportingData: ReportingDataService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.setReportGroupFromCurrentView();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  get hasReportBreakdown(): boolean {
    return this.reportGroup === ReportGroup.ReportesRegulatorios;
  }


  onReportFilterEvent(event: EventInfo) {
    if (this.isLoading) {
      return;
    }

    switch (event.type as OperationalReportFilterEventType | FinancialReportFilterEventType) {

      case OperationalReportFilterEventType.BUILD_REPORT_CLICKED:
      case FinancialReportFilterEventType.BUILD_REPORT_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');

        this.reportQuery = event.payload.query as ReportQuery;
        this.setReportType(event.payload.reportType as ReportType<ReportTypeFlags>);
        this.setReportData(EmptyReportData, false);
        this.getReportData();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onReportViewerEvent(event) {
    switch (event.type as ReportViewerEventType) {
      case ReportViewerEventType.REPORT_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.reportEntry, 'event.payload.reportEntry');
        this.getReportBreakdown(event.payload.reportEntry);
        return;

      case ReportViewerEventType.EXPORT_DATA_CLICKED:
        Assertion.assertValue(event.payload.exportationType, 'event.payload.exportationType');
        this.exportReportData(event.payload.exportationType as FileType);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onReportBreakdownEvent(event: EventInfo) {
    switch (event.type as any) {
      case FinancialReportBreakdownTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setReportBreakdown(null);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setReportGroupFromCurrentView() {
    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.onCurrentViewChanged(x));
  }


  private onCurrentViewChanged(newView: View) {
    switch (newView.name) {
      case 'AccountingDashboards.FinancialReports':
        this.reportGroup = ReportGroup.ReportesRegulatorios;
        return;

      case 'AccountingDashboards.OperationalReports':
        this.reportGroup = ReportGroup.ReportesOperativos;
        return;

      case 'AccountingDashboards.FiscalReports':
        this.reportGroup = ReportGroup.ReportesFiscales;
        return;

      default:
        this.reportGroup = null;
        return;
    }
  }


  private getReportData() {
    this.isLoading = true;

    if (this.reportGroup === ReportGroup.ReportesRegulatorios) {
      this.reportingData.getFinancialReport(this.reportQuery as FinancialReportQuery)
        .toPromise()
        .then( x => this.setReportData(x))
        .finally(() => this.isLoading = false);
    } else {
      this.reportingData.getReportData(this.reportQuery)
        .toPromise()
        .then( x => this.setReportData(x))
        .finally(() => this.isLoading = false);
    }
  }


  private exportReportData(exportTo: FileType) {
    const reportQuery = Object.assign({}, this.reportQuery, {exportTo});

    if (this.reportGroup === ReportGroup.ReportesRegulatorios) {
      this.reportingData.exportFinancialReport(reportQuery as FinancialReportQuery)
        .toPromise()
        .then(x => this.fileUrl = x.url);
    } else {
      this.reportingData.exportReportData(reportQuery)
        .toPromise()
        .then(x => this.fileUrl = x.url);
    }
  }



  private getReportBreakdown(reportEntry) {
    this.isLoadingBreakdown = true;

    this.reportingData.getFinancialReportBreakdown(reportEntry.uid,
                                                   this.reportQuery as FinancialReportQuery)
      .toPromise()
      .then(x => {
        const reportBreakdown: FinancialReportBreakdown = {
          financialReportEntry: reportEntry,
          financialReportBreakdown: x,
        };
        this.setReportBreakdown(reportBreakdown);
      })
      .finally(() => this.isLoadingBreakdown = false);
  }


  private setReportType(reportType: ReportType<ReportTypeFlags>) {
    this.selectedReportType = reportType;
  }


  private setReportData(reportData: ReportData, queryExecuted = true) {
    this.reportData = reportData;
    this.queryExecuted = queryExecuted;
  }


  private setReportBreakdown(reportBreakdown: any) {
    this.selectedReportBreakdown = reportBreakdown;
    this.displayReportBreakdown = !isEmpty(this.selectedReportBreakdown?.financialReportEntry);
  }

}
