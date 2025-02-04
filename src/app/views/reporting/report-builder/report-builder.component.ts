/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Assertion, EmpObservable, EventInfo, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { View } from '@app/main-layout';

import { FilePreviewComponent } from '@app/shared/containers';

import { ReportingDataService, VouchersDataService } from '@app/data-services';

import { EmptyReportData, EmptyReportType, FileReport, FileType, FinancialReportBreakdown,
         FinancialReportEntry, FinancialReportQuery, ReportController, ReportData, ReportEntry, ReportGroup,
         ReportQuery, ReportType, ReportTypeFlags, VoucherReportEntry } from '@app/models';

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

  @ViewChild('filePreview', { static: true }) filePreview: FilePreviewComponent;

  reportGroup: ReportGroup;

  ReportGroups = ReportGroup;

  isLoading = false;

  queryExecuted = false;

  reportQuery: ReportQuery = Object.assign({});

  selectedReportType: ReportType<ReportTypeFlags> = EmptyReportType;

  reportData: ReportData = Object.assign({}, EmptyReportData);

  displayReportBreakdown = false;

  selectedReportBreakdown: FinancialReportBreakdown = null;

  fileUrl = '';

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private reportingData: ReportingDataService,
              private vouchersData: VouchersDataService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.setReportGroupFromCurrentView();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
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

        this.setReportQuery(event.payload.query as ReportQuery);
        this.setReportType(event.payload.reportType as ReportType<ReportTypeFlags>);
        this.validateGetReportData();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onReportViewerEvent(event: EventInfo) {
    switch (event.type as ReportViewerEventType) {
      case ReportViewerEventType.REPORT_ENTRY_CLICKED:
        Assertion.assertValue(event.payload.reportEntry, 'event.payload.reportEntry');
        this.validateReportEntry(event.payload.reportEntry as ReportEntry);
        return;

      case ReportViewerEventType.EXPORT_DATA_CLICKED:
        Assertion.assertValue(event.payload.exportationType, 'event.payload.exportationType');
        const reportQuery = this.getReportQueryForExport(event.payload.exportationType as FileType);
        this.validateExportReportData(reportQuery);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onReportBreakdownEvent(event: EventInfo) {
    switch (event.type as FinancialReportBreakdownTabbedViewEventType) {
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


  private validateGetReportData() {
    this.clearReportData();

    let observable: EmpObservable<ReportData> = null;

    switch (this.selectedReportType.controller) {
      case ReportController.FinancialReport:
        observable = this.reportingData.getFinancialReport(this.reportQuery);
        break;
      case ReportController.Reporting:
        observable = this.reportingData.getReportData(this.reportQuery);
        break;
      default:
        console.log(`Unhandled controller ${this.selectedReportType.controller}`);
        return;
    }

    this.getReportData(observable);
  }


  private validateExportReportData(reportQuery: ReportQuery) {
    let observable: EmpObservable<FileReport> = null;

    switch (this.selectedReportType.controller) {
      case ReportController.FinancialReport:
        observable = this.reportingData.exportFinancialReport(reportQuery);
        break;
      case ReportController.Reporting:
        observable = this.reportingData.exportReportData(reportQuery);
        break;
      default:
        console.log(`Unhandled report controller ${this.selectedReportType.controller}`);
        return;
    }

    this.exportReportData(observable);
  }


  private getReportData(observable: EmpObservable<ReportData>) {
    this.isLoading = true;

    observable
      .firstValue()
      .then(x => this.setReportData(x))
      .finally(() => this.isLoading = false);
  }


  private exportReportData(observable: EmpObservable<FileReport>) {
    observable
      .firstValue()
      .then(x => this.fileUrl = x.url);
  }



  private getReportBreakdown(reportEntry: ReportEntry) {
    this.isLoading = true;

    this.reportingData.getFinancialReportBreakdown(reportEntry.uid,
                                                   this.reportQuery as FinancialReportQuery)
      .firstValue()
      .then(x => {
        const reportBreakdown: FinancialReportBreakdown = {
          financialReportEntry: reportEntry as FinancialReportEntry,
          financialReportBreakdown: x,
        };
        this.setReportBreakdown(reportBreakdown);
      })
      .finally(() => this.isLoading = false);
  }


  private getVoucherForPrint(reportEntry: VoucherReportEntry) {
    this.isLoading = true;

    this.vouchersData.getVoucherForPrint(reportEntry.voucherId)
      .firstValue()
      .then(x => this.openFilePreview(x))
      .finally(() => this.isLoading = false);
  }


  private validateReportEntry(reportEntry: ReportEntry) {
    if (this.isVoucherReportEntry(reportEntry)) {
      this.getVoucherForPrint(reportEntry);
      return;
    }

    if (this.isReportBreakdown(reportEntry)) {
      this.getReportBreakdown(reportEntry);
      return;
    }
  }


  private isReportBreakdown(reportEntry: ReportEntry): boolean {
    return !!reportEntry.uid;
  }


  private isVoucherReportEntry(reportEntry: VoucherReportEntry): boolean {
    return reportEntry.isVoucher && !!reportEntry.voucherId;
  }


  private setReportQuery(query: ReportQuery) {
    this.reportQuery = query;
  }


  private setReportType(reportType: ReportType<ReportTypeFlags>) {
    this.selectedReportType = reportType;
  }


  private setReportData(reportData: ReportData, queryExecuted = true) {
    this.reportData = reportData;
    this.queryExecuted = queryExecuted;
  }


  private setReportBreakdown(reportBreakdown: FinancialReportBreakdown) {
    this.selectedReportBreakdown = reportBreakdown;
    this.displayReportBreakdown = !isEmpty(this.selectedReportBreakdown?.financialReportEntry);
  }


  private clearReportData() {
    this.setReportData(EmptyReportData, false);
    this.setReportBreakdown(null);
  }


  private getReportQueryForExport(exportTo: FileType): ReportQuery {
    return Object.assign({}, this.reportQuery, { exportTo });
  }


  private openFilePreview(file: FileReport) {
    this.filePreview.open(file.url, file.type);
  }

}
