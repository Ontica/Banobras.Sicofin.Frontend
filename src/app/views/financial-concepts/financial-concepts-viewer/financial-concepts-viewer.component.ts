/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { FinancialConceptsDataService } from '@app/data-services';

import { EmptyFinancialConcept, EmptyFinancialConceptCommand, EmptyFinancialConceptDataTable,
         FinancialConcept, FinancialConceptCommand, FinancialConceptDataTable } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { DataTableEventType } from '@app/views/reports-controls/data-table/data-table.component';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

import { FinancialConceptsFilterEventType } from './financial-concepts-filter.component';


export enum FinancialConceptsViewerEventType {
  FINANCIAL_CONCEPT_SELECTED = 'FinancialConceptsViewerComponent.Event.FinancialConceptSelected',
}

@Component({
  selector: 'emp-fa-financial-concepts-viewer',
  templateUrl: './financial-concepts-viewer.component.html',
})
export class FinancialConceptsViewerComponent {

  @Input() selectedFinancialConcept: FinancialConcept = EmptyFinancialConcept;

  @Output() financialConceptsViewerEvent = new EventEmitter<EventInfo>();

  financialConceptsGroupsName = '';

  cardHint = 'Seleccionar los filtros';

  isLoading = false;

  submitted = false;

  commandExecuted = false;

  financialConceptData: FinancialConceptDataTable = EmptyFinancialConceptDataTable;

  financialConceptCommand: FinancialConceptCommand = Object.assign({}, EmptyFinancialConceptCommand);

  displayExportModal = false;

  excelFileUrl = '';

  displayFinancialConceptCreator = false;

  constructor(private financialConceptsData: FinancialConceptsDataService,
              private messageBox: MessageBoxService) { }


  onAddFinancialConceptClicked() {
    this.displayFinancialConceptCreator = true;
  }


  onFinancialConceptsFilterEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as FinancialConceptsFilterEventType) {

      case FinancialConceptsFilterEventType.SEARCH_FINANCIAL_CONCEPTS_CLICKED:
        Assertion.assertValue(event.payload.financialConceptCommand, 'event.payload.financialConceptCommand');
        Assertion.assertValue(event.payload.financialConceptsGroupsName,
          'event.payload.financialConceptsGroupsName');

        this.commandExecuted = true;
        this.financialConceptCommand = event.payload.financialConceptCommand as FinancialConceptCommand;
        this.financialConceptsGroupsName = event.payload.financialConceptsGroupsName;
        this.getFinancialConcepts();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFinancialConceptsTableEvent(event: EventInfo) {
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
        this.emitFinancialConceptSelected(event.payload.entry as FinancialConcept);
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
        if (this.submitted || !this.financialConceptData.command.accountsChartUID) {
          return;
        }

        this.exportFinancialConceptsToExcel();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getFinancialConcepts() {
    this.setSubmitted(true);

    this.financialConceptsData.getFinancialConcepts(this.financialConceptCommand.groupUID)
      .toPromise()
      .then(x => {
        this.financialConceptData = Object.assign({}, this.financialConceptData,
          {command: this.financialConceptCommand, entries: x});
        this.setText();
        this.emitFinancialConceptSelected(EmptyFinancialConcept);
      })
      .finally(() => this.setSubmitted(false));
  }


  private exportFinancialConceptsToExcel() {
    this.financialConceptsData.exportFinancialConceptsToExcel(this.financialConceptCommand.groupUID)
      .toPromise()
      .then(x => {
        this.excelFileUrl = x.url;
      });
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.commandExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      return;
    }

    if (displayedEntriesMessage) {
      this.cardHint = `${this.financialConceptsGroupsName} - ${displayedEntriesMessage}`;
      return;
    }

    this.cardHint = `${this.financialConceptsGroupsName} - ${this.financialConceptData.entries.length}` +
      ` registros encontrados`;
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.excelFileUrl = '';
  }


  private emitFinancialConceptSelected(financialConcept: FinancialConcept) {
    sendEvent(this.financialConceptsViewerEvent,
      FinancialConceptsViewerEventType.FINANCIAL_CONCEPT_SELECTED, {financialConcept});
  }

}
