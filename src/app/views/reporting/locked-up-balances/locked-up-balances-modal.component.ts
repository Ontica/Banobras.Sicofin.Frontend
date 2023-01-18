/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { ReportingDataService } from '@app/data-services';

import { EmptyLockedUpBalancesData, EmptyLockedUpBalancesQuery,
         LockedUpBalancesData, LockedUpBalancesQuery } from '@app/models';

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

  queryExecuted = false;

  query: LockedUpBalancesQuery = Object.assign({}, EmptyLockedUpBalancesQuery);

  data: LockedUpBalancesData = Object.assign({}, EmptyLockedUpBalancesData);

  displayExportModal = false;

  fileUrl = '';


  constructor(private reportingData: ReportingDataService) { }


  onClose() {
    sendEvent(this.lockedUpBalancesModalEvent, LockedUpBalancesModalEventType.CLOSE_MODAL_CLICKED);
  }


  onLockedUpBalancesFilterEvent(event: EventInfo) {
    if (this.submitted) {
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
        if (this.submitted) {
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
    this.submitted = true;
    this.reportingData.getLockedUpBalances(this.query)
      .toPromise()
      .then( x => this.setLockedUpBalancesData(x))
      .finally(() => this.submitted = false);
  }


  private exportLockedUpBalances() {
    setTimeout(() => this.fileUrl = 'DummyUrl', 500);
  }


  private setLockedUpBalancesData(data: LockedUpBalancesData, queryExecuted = true) {
    this.data = data;
    this.queryExecuted = queryExecuted;
    this.setText();
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

}
