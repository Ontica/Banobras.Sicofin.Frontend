/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { ReportingDataService } from '@app/data-services';

import { DataTableColumnType, EmptyLockedUpBalancesData, EmptyLockedUpBalancesQuery, GenerateVoucherCommand,
         LockedUpBalancesData, LockedUpBalancesEntry, LockedUpBalancesQuery } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { DataTableEventType } from '@app/views/reports-controls/data-table/data-table.component';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

import { LockedUpBalancesFilterEventType } from './locked-up-balances-filter.component';

export enum LockedUpBalancesModalEventType {
  CLOSE_MODAL_CLICKED = 'LockedUpBalancesModalComponent.Event.CloseModalClicked',
}

@Component({
  selector: 'emp-fa-locked-up-balances-modal',
  templateUrl: './locked-up-balances-modal.component.html',
})
export class LockedUpBalancesModalComponent {

  @Output() lockedUpBalancesModalEvent = new EventEmitter<EventInfo>();

  hint = 'Seleccionar los filtros';

  submitted = false;

  isLoading = false;

  queryExecuted = false;

  query: LockedUpBalancesQuery = Object.assign({}, EmptyLockedUpBalancesQuery);

  data: LockedUpBalancesData = Object.assign({}, EmptyLockedUpBalancesData);

  displayExportModal = false;

  fileUrl = '';


  constructor(private reportingData: ReportingDataService,
              private messageBox: MessageBoxService) { }


  onClose() {
    sendEvent(this.lockedUpBalancesModalEvent, LockedUpBalancesModalEventType.CLOSE_MODAL_CLICKED);
  }


  onLockedUpBalancesFilterEvent(event: EventInfo) {
    if (this.isLoading || this.submitted) {
      return;
    }

    switch (event.type as LockedUpBalancesFilterEventType) {
      case LockedUpBalancesFilterEventType.SEARCH_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        this.query = event.payload.query as LockedUpBalancesQuery;
        this.setLockedUpBalancesData(EmptyLockedUpBalancesData, false);
        this.getLockedUpBalances();
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
        this.validateGenerateVoucher(event.payload.entry as LockedUpBalancesEntry);
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
        if (this.isLoading || this.submitted) {
          return;
        }

        this.exportLockedUpBalances();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getLockedUpBalances() {
    this.isLoading = true;
    this.reportingData.getLockedUpBalances(this.query)
      .toPromise()
      .then( x => this.setLockedUpBalancesData(x))
      .finally(() => this.isLoading = false);
  }


  private exportLockedUpBalances() {
    setTimeout(() => this.fileUrl = 'DummyUrl', 500);
  }


  private generateVoucher(command: GenerateVoucherCommand) {
    this.submitted = true;
    setTimeout(() => {
      this.messageBox.showInDevelopment('Generar póliza', {command});
      this.submitted = false;
    }, 500);
  }


  private setLockedUpBalancesData(data: LockedUpBalancesData, queryExecuted = true) {
    this.data = this.buildLockedUpBalancesData(data);
    this.queryExecuted = queryExecuted;
    this.setText();
  }


  private buildLockedUpBalancesData(data: LockedUpBalancesData): LockedUpBalancesData {
    if (data.columns.some(x => x.type === DataTableColumnType.text_button)) {
      data.columns.find(x => x.type === DataTableColumnType.text_button)
        .functionToShowButton = (entry: LockedUpBalancesEntry) => entry.canGenerateVoucher;

      data.columns.find(x => x.type === DataTableColumnType.text_button)
        .buttonText = 'Generar póliza';
    }

    return data;
  }


  private validateGenerateVoucher(entry: LockedUpBalancesEntry) {
    if (entry.canGenerateVoucher && !!entry.ledgerNumber) {
      const message = `Esta operación generará la póliza para cancelar los saldos de la contabilidad
                      <strong> ${entry.accountName}</strong>.
                      <br><br>¿Genero la póliza?`;

      this.messageBox.confirm(message, 'Generar póliza')
        .toPromise()
        .then(x => {
          if (x) {
            const command = this.getGenerateVoucherCommand(entry);
            this.generateVoucher(command);
          }
        });
    }
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.queryExecuted) {
      this.hint =  'Seleccionar los filtros';
      return;
    }

    this.hint = displayedEntriesMessage ?? `${this.data.entries.length} registros encontrados`;
  }


  private setDisplayExportModal(display: boolean) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }


  private getGenerateVoucherCommand(entry: LockedUpBalancesEntry): GenerateVoucherCommand {
    const command: GenerateVoucherCommand = {
      accountsChartUID: this.query.accountsChartUID,
      ledgerNumber: entry.ledgerNumber,
      roleChangeDate: entry.roleChangeDate,
    };

    return command;
  }

}
