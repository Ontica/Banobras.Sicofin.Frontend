/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Assertion, EmpObservable, EventInfo, SessionService } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { PERMISSIONS } from '@app/main-layout';

import { BalancesDataService } from '@app/data-services';

import { BalanceExplorerData, BalanceExplorerEntry, BalanceExplorerQuery, BalanceExplorerResult,
         emptyBalanceExplorerQuery, EmptyReportType, EmptySubledgerAccount, EmptyTrialBalance, FileReport,
         getEmptyTrialBalanceQuery, ReportType, ReportTypeFlags, SubledgerAccount, TrialBalance,
         TrialBalanceEntry, TrialBalanceQuery } from '@app/models';

import { ReportingAction, ReportingStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

import { DataTableEventType } from '@app/views/_reports-controls/data-table/data-table.component';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';

import { BalanceFilterEventType } from './balance-filter.component';

import { TrialBalanceFilterEventType } from './trial-balance-filter.component';

import { SubledgerAccountBalanceFilterEventType } from './subledger-account-balance-filter.component';

import { TrialBalanceQueryType } from '../trial-balance-explorer/trial-balance-explorer.component';


export enum TrialBalanceViewerEventType {
  SELECT_ENTRY_CLICKED = 'TrialBalanceViewerComponent.Event.SelectEntryClicked',
  UNSELECT_ENTRY = 'TrialBalanceViewerComponent.Event.UnselectEntry',
}

@Component({
  selector: 'emp-fa-trial-balance-viewer',
  templateUrl: './trial-balance-viewer.component.html',
})
export class TrialBalanceViewerComponent implements OnInit, OnDestroy {

  @Input() queryType: TrialBalanceQueryType = 'TrialBalance';

  @Input() selectedEntry = null;

  @Input() displayCard = false;

  @Input() subledgerAccount: SubledgerAccount = EmptySubledgerAccount;

  @Output() trialBalanceViewerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';

  showFilters = false;

  isLoading = false;

  submitted = false;

  queryExecuted = false;

  hasPermissionToAccountStatement = false;

  reportType: ReportType<ReportTypeFlags> = EmptyReportType;

  query: BalanceExplorerQuery | TrialBalanceQuery = getEmptyTrialBalanceQuery();

  data: BalanceExplorerResult | TrialBalance = EmptyTrialBalance;

  displayExportModal = false;

  excelFileUrl = '';

  subscriptionHelper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private session: SessionService,
              private balancesDataService: BalancesDataService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.setPermissionToAccountStatement();

    if (this.isBalanceQuery) {
      this.subscriptionHelper.select<BalanceExplorerData>(ReportingStateSelector.BALANCE_EXPLORER_DATA)
        .subscribe(x => this.setInitData(x));
    }
  }


  ngOnDestroy() {
    if (this.isBalanceQuery) {
      this.subscriptionHelper.destroy();
    }
  }

  get isTrialBalanceQuery(): boolean {
    return ['TrialBalance'].includes(this.queryType);;
  }


  get isBalanceQuery(): boolean {
    return ['Balance'].includes(this.queryType);;
  }


  get isSubledgerQuery(): boolean {
    return ['SubledgerAccount'].includes(this.queryType);;
  }


  get balancesQuery(): BalanceExplorerQuery {
    return this.query as BalanceExplorerQuery;
  }


  onFilterEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    this.resetData();

    switch (event.type as TrialBalanceFilterEventType | BalanceFilterEventType | SubledgerAccountBalanceFilterEventType) {
      case TrialBalanceFilterEventType.BUILD_TRIAL_BALANCE_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');

        this.setReportType(event.payload.reportType);
        this.executeGetTrialBalance(event.payload.query as TrialBalanceQuery);
        return;

      case BalanceFilterEventType.BUILD_BALANCE_CLICKED:
      case SubledgerAccountBalanceFilterEventType.BUILD_BALANCE_CLICKED:
        Assertion.assertValue(event.payload.reportType, 'event.payload.reportType');
        Assertion.assertValue(event.payload.query, 'event.payload.query');

        this.setReportType(event.payload.reportType);
        this.executeGetBalance(event.payload.query as BalanceExplorerQuery);
        return;

      case TrialBalanceFilterEventType.CLEAR_TRIAL_BALANCE_CLICKED:
      case BalanceFilterEventType.CLEAR_BALANCE_CLICKED:
        this.setReportType(EmptyReportType);
        this.clearQuery();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onDataTableEvent(event: EventInfo) {
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


  onExportReportModalEvent(event: EventInfo) {
    switch (event.type as ExportReportModalEventType) {
      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;

      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        this.validateExportReportToExecute();
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


  private getData(observable: EmpObservable<BalanceExplorerResult | TrialBalance>) {
    this.setSubmitted(true);

    observable
      .firstValue()
      .then(x => {
        this.queryExecuted = true;
        this.showFilters = false;
        this.setData(x);
      })
      .finally(() => this.setSubmitted(false));
  }


  private validateExportReportToExecute() {
    if (this.submitted || !this.query.accountsChartUID) {
      return;
    }

    let observable = null;

    switch (this.queryType) {
      case 'TrialBalance':
        observable = this.balancesDataService.exportTrialBalanceToExcel(this.query as TrialBalanceQuery);
        break;
      case 'Balance':
      case 'SubledgerAccount':
        observable = this.balancesDataService.exportBalanceExplorerBalancesToExcel(this.query as BalanceExplorerQuery);
        break;
      default:
        console.log(`Unhandled query type ${this.queryType}`);
        return;
    }

    this.exportDataToExcel(observable);
  }


  private exportDataToExcel(observable: EmpObservable<FileReport>) {
    observable
      .firstValue()
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
    this.setReportType(balanceData.balanceType as ReportType<ReportTypeFlags>);
    this.setText();
  }


  private saveDataInState() {
    if (this.isBalanceQuery) {
      const balanceData: BalanceExplorerData = {
        balance: this.data as BalanceExplorerResult,
        balanceType: this.reportType,
        queryExecuted: this.queryExecuted,
      };

      this.uiLayer.dispatch(ReportingAction.SET_BALANCE_EXPLORER_DATA, {balanceData});
    }
  }


  private setPermissionToAccountStatement() {
    this.hasPermissionToAccountStatement =
      this.session.hasPermission(PERMISSIONS.FEATURE_ESTADO_DE_CUENTA);
  }


  private clearQuery() {
    this.query = this.isBalanceQuery ? emptyBalanceExplorerQuery() : getEmptyTrialBalanceQuery();
  }


  private setReportType(reportType: ReportType<ReportTypeFlags>) {
    this.reportType = reportType ?? EmptyReportType;
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.queryExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    if (displayedEntriesMessage) {
      this.cardHint = `${this.reportType.name} - ${displayedEntriesMessage}`;
      return;
    }

    this.cardHint = `${this.reportType.name} - ${this.data.entries.length} registros encontrados`;
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }


  private setDisplayExportModal(display: boolean) {
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
