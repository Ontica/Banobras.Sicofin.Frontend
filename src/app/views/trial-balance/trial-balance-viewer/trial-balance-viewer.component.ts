/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { Assertion, EventInfo } from '@app/core';

import { BalancesDataService } from '@app/data-services';

import { Balance, BalanceCommand, BalanceEntry, EmptyTrialBalance, EmptyTrialBalanceType, FileReport,
         getEmptyBalanceCommand, getEmptyTrialBalanceCommand, TrialBalance, TrialBalanceCommand,
         TrialBalanceEntry, TrialBalanceType} from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

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
export class TrialBalanceViewerComponent {

  @Input() isQuickQuery = false;

  @Input() selectedEntry = null;

  @Output() trialBalanceViewerEvent = new EventEmitter<EventInfo>();

  balanceType: TrialBalanceType = EmptyTrialBalanceType;

  cardHint = 'Seleccionar los filtros';

  showFilters = false;

  isLoading = false;

  submitted = false;

  commandExecuted = false;

  command: BalanceCommand | TrialBalanceCommand = getEmptyTrialBalanceCommand();

  data: Balance | TrialBalance = EmptyTrialBalance;

  displayExportModal = false;

  excelFileUrl = '';


  constructor(private balancesDataService: BalancesDataService,
              private messageBox: MessageBoxService) { }


  onFilterEvent(event) {
    if (this.submitted) {
      return;
    }

    this.resetData();

    switch (event.type as TrialBalanceFilterEventType | BalanceQuickFilterEventType) {
      case BalanceQuickFilterEventType.BUILD_BALANCE_CLICKED:
        Assertion.assertValue(event.payload.trialBalanceType, 'event.payload.trialBalanceType');
        Assertion.assertValue(event.payload.balanceCommand, 'event.payload.balanceCommand');

        this.setBalanceTypeName(event.payload.trialBalanceType);
        this.executeGetBalance(event.payload.balanceCommand as BalanceCommand);
        return;

      case TrialBalanceFilterEventType.BUILD_TRIAL_BALANCE_CLICKED:
        Assertion.assertValue(event.payload.trialBalanceType, 'event.payload.trialBalanceType');
        Assertion.assertValue(event.payload.trialBalanceCommand, 'event.payload.trialBalanceCommand');

        this.setBalanceTypeName(event.payload.trialBalanceType);
        this.executeGetTrialBalance(event.payload.trialBalanceCommand as TrialBalanceCommand);
        return;

      case TrialBalanceFilterEventType.CLEAR_TRIAL_BALANCE_CLICKED:
        this.setBalanceTypeName(null);
        this.clearCommand();
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
        if (this.submitted || !this.command.accountsChartUID ) {
          return;
        }

        if (this.isQuickQuery) {
          this.messageBox.showInDevelopment('Exportar reporte', this.command);
        } else {
          const observable =
            this.balancesDataService.exportTrialBalanceToExcel(this.command as TrialBalanceCommand);
          this.exportDataToExcel(observable);
        }

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private executeGetBalance(command: BalanceCommand) {
    this.command = command;
    const observableBalance = this.balancesDataService.getBalance(this.command);
    this.getData(observableBalance);
  }


  private executeGetTrialBalance(command: TrialBalanceCommand) {
    this.command = command;
    const observableTrialBalance = this.balancesDataService.getTrialBalance(this.command);
    this.getData(observableTrialBalance);
  }


  private getData(observable: Observable<Balance | TrialBalance>) {
    this.setSubmitted(true);

    observable
      .toPromise()
      .then(x => {
        this.commandExecuted = true;
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


  private setData(data: Balance | TrialBalance) {
    this.data = data;
    this.setText();
  }


  private resetData() {
    this.commandExecuted = false;
    this.setData(EmptyTrialBalance);
    sendEvent(this.trialBalanceViewerEvent, TrialBalanceViewerEventType.UNSELECT_ENTRY);
  }


  private clearCommand() {
    this.command = this.isQuickQuery ? getEmptyBalanceCommand() : getEmptyTrialBalanceCommand();
  }


  private setBalanceTypeName(balanceType: TrialBalanceType) {
    this.balanceType = balanceType ?? EmptyTrialBalanceType;
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.commandExecuted) {
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


  private emitEntryClicked(entry: BalanceEntry | TrialBalanceEntry) {
    const payload = {
      command: this.command,
      entry,
    };

    sendEvent(this.trialBalanceViewerEvent, TrialBalanceViewerEventType.SELECT_ENTRY_CLICKED, payload);
  }

}
