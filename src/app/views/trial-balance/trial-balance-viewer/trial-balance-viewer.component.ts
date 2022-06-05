/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, Empty, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { BalancesDataService } from '@app/data-services';

import { BalanceExplorerResult, BalanceExplorerQuery, BalanceExplorerData, BalanceExplorerEntry, EmptyTrialBalance, FileReport,
         emptyBalanceExplorerQuery, getEmptyTrialBalanceQuery, TrialBalance, TrialBalanceQuery,
         TrialBalanceEntry } from '@app/models';

import { ReportingAction, ReportingStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

import { DataTableEventType } from '@app/views/reports-controls/data-table/data-table.component';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

import { BalanceQuickFilterEventType } from './balance-quick-filter.component';

import { TrialBalanceFilterEventType } from './trial-balance-filter.component';


export enum TrialBalanceViewerEventType {
  SELECT_ENTRY_CLICKED = 'TrialBalanceViewerComponent.Event.SelectEntryClicked',
  UNSELECT_ENTRY = 'TrialBalanceViewerComponent.Event.UnselectEntry',
}

@Component({
  selector: 'emp-fa-trial-balance-viewer',
  templateUrl: './trial-balance-viewer.component.html',
})
export class TrialBalanceViewerComponent implements OnInit, OnDestroy {

  @Input() isQuickQuery = false;

  @Input() selectedEntry = null;

  @Output() trialBalanceViewerEvent = new EventEmitter<EventInfo>();

  balanceType: Identifiable = Empty;

  cardHint = 'Seleccionar los filtros';

  showFilters = false;

  isLoading = false;

  submitted = false;

  queryExecuted = false;

  query: BalanceExplorerQuery | TrialBalanceQuery = getEmptyTrialBalanceQuery();

  data: BalanceExplorerResult | TrialBalance = EmptyTrialBalance;

  displayExportModal = false;

  excelFileUrl = '';

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private balancesDataService: BalancesDataService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    if (this.isQuickQuery) {
      this.subscriptionHelper.select<BalanceExplorerData>(ReportingStateSelector.BALANCE_EXPLORER_DATA)
        .subscribe(x => this.setInitData(x));
    }
  }


  ngOnDestroy() {
    if (this.isQuickQuery) {
      this.subscriptionHelper.destroy();
    }
  }


  get balancesQuery(): BalanceExplorerQuery {
    return this.query as BalanceExplorerQuery;
  }


  onFilterEvent(event) {
    if (this.submitted) {
      return;
    }

    this.resetData();

    switch (event.type as TrialBalanceFilterEventType | BalanceQuickFilterEventType) {
      case BalanceQuickFilterEventType.BUILD_BALANCE_CLICKED:
        Assertion.assertValue(event.payload.trialBalanceType, 'event.payload.trialBalanceType');
        Assertion.assertValue(event.payload.balancesQuery, 'event.payload.balancesQuery');

        this.setBalanceTypeName(event.payload.trialBalanceType);
        this.executeGetBalance(event.payload.balancesQuery as BalanceExplorerQuery);
        return;

      case TrialBalanceFilterEventType.BUILD_TRIAL_BALANCE_CLICKED:
        Assertion.assertValue(event.payload.trialBalanceType, 'event.payload.trialBalanceType');
        Assertion.assertValue(event.payload.trialBalanceQuery, 'event.payload.trialBalanceQuery');

        this.setBalanceTypeName(event.payload.trialBalanceType);
        this.executeGetTrialBalance(event.payload.trialBalanceQuery as TrialBalanceQuery);
        return;

      case TrialBalanceFilterEventType.CLEAR_TRIAL_BALANCE_CLICKED:
      case BalanceQuickFilterEventType.CLEAR_BALANCE_CLICKED:
        this.setBalanceTypeName(null);
        this.clearQuery();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDataTableEvent(event) {
    switch (event.type as DataTableEventType) {

      case DataTableEventType.COUNT_FILTERED_ENTRIES:
        Assertion.assertValue(event.payload.displayedEntriesMessage, 'event.payload.displayedEntriesMessage');
        this.setText(event.payload.displayedEntriesMessage as string);
        return;

      case DataTableEventType.EXPORT_DATA:
        this.setDisplayExportModal(true);
        return;

      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry, 'event.payload.entry');
        this.emitEntryClicked(event.payload.entry);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event) {
    switch (event.type as ExportReportModalEventType) {

      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;

      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        if (this.submitted || !this.query.accountsChartUID ) {
          return;
        }

        const observable = this.isQuickQuery ?
          this.balancesDataService.exportBalanceExplorerBalancesToExcel(this.query as BalanceExplorerQuery) :
          this.balancesDataService.exportTrialBalanceToExcel(this.query as TrialBalanceQuery);

        this.exportDataToExcel(observable);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private executeGetBalance(query: BalanceExplorerQuery) {
    this.query = query;
    const observableBalance = this.balancesDataService.getBalancesForBalanceExplorer(this.query);
    this.getData(observableBalance);
  }


  private executeGetTrialBalance(query: TrialBalanceQuery) {
    this.query = query;
    const observableTrialBalance = this.balancesDataService.getTrialBalance(this.query);
    this.getData(observableTrialBalance);
  }


  private getData(observable: Observable<BalanceExplorerResult | TrialBalance>) {
    this.setSubmitted(true);

    observable
      .toPromise()
      .then(x => {
        this.queryExecuted = true;
        this.showFilters = false;
        this.setData(x);
      })
      .finally(() => this.setSubmitted(false));
  }


  private exportDataToExcel(observable: Observable<FileReport>) {
    observable
      .toPromise()
      .then(x => this.excelFileUrl = x.url);
  }


  private setData(data: BalanceExplorerResult | TrialBalance) {
    this.data = data;
    this.setText();
    this.saveDataInState();
  }


  private resetData() {
    this.queryExecuted = false;
    this.setData(EmptyTrialBalance);
    sendEvent(this.trialBalanceViewerEvent, TrialBalanceViewerEventType.UNSELECT_ENTRY);
  }


  private setInitData(balanceData: BalanceExplorerData) {
    this.data = balanceData.balance;
    this.query = balanceData.balance.query;
    this.queryExecuted = balanceData.queryExecuted;
    this.setBalanceTypeName(balanceData.balanceType);
    this.setText();
  }


  private saveDataInState() {
    if (this.isQuickQuery) {
      const balanceData: BalanceExplorerData = {
        balance: this.data as BalanceExplorerResult,
        balanceType: this.balanceType,
        queryExecuted: this.queryExecuted,
      };

      this.uiLayer.dispatch(ReportingAction.SET_BALANCE_EXPLORER_DATA, {balanceData});
    }
  }


  private clearQuery() {
    this.query = this.isQuickQuery ? emptyBalanceExplorerQuery() : getEmptyTrialBalanceQuery();
  }


  private setBalanceTypeName(balanceType: Identifiable) {
    this.balanceType = balanceType ?? Empty;
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    if (displayedEntriesMessage) {
      this.cardHint = `${this.balanceType.name} - ${displayedEntriesMessage}`;
      return;
    }

    this.cardHint = `${this.balanceType.name} - ${this.data.entries.length} registros encontrados`;
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.excelFileUrl = '';
  }


  private emitEntryClicked(entry: BalanceExplorerEntry | TrialBalanceEntry) {
    const payload = {
      query: this.query,
      entry,
    };

    sendEvent(this.trialBalanceViewerEvent, TrialBalanceViewerEventType.SELECT_ENTRY_CLICKED, payload);
  }

}
