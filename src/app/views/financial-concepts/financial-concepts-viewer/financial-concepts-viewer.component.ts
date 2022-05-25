/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { EmptyFinancialConcept, FinancialConcept, FinancialConceptDescriptor } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

import { FinancialConceptsFilterEventType } from './financial-concepts-filter.component';

import { FinancialConceptsTableEventType } from './financial-concepts-table.component';


export enum FinancialConceptsViewerEventType {
  SEARCH_FINANCIAL_CONCEPTS_CLICKED = 'FinancialConceptsViewerComponent.Event.SearchFinancialConceptsClicked',
  EXPORT_DATA_BUTTON_CLICKED        = 'FinancialConceptsViewerComponent.Event.ExportDataButtonClicked',
  SELECT_FINANCIAL_CONCEPT_CLICKED  = 'FinancialConceptsViewerComponent.Event.SelectFinancialConceptClicked',
  CREATE_FINANCIAL_CONCEPT_CLICKED  = 'FinancialConceptsViewerComponent.Event.CreateFinancialConceptClicked',
}

@Component({
  selector: 'emp-fa-financial-concepts-viewer',
  templateUrl: './financial-concepts-viewer.component.html',
})
export class FinancialConceptsViewerComponent implements OnChanges {

  @Input() financialConceptsList: FinancialConceptDescriptor[] = [];

  @Input() excelFileUrl = '';

  @Input() selectedFinancialConcept: FinancialConcept = EmptyFinancialConcept;

  @Input() isLoading = false;

  @Output() financialConceptsViewerEvent = new EventEmitter<EventInfo>();

  financialConceptsGroupsName = '';

  cardHint = 'Seleccionar los filtros';

  commandExecuted = false;

  displayExportModal = false;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.financialConceptsList) {
      this.setText();
    }
  }

  onCreateFinancialConceptClicked() {
    sendEvent(this.financialConceptsViewerEvent,
      FinancialConceptsViewerEventType.CREATE_FINANCIAL_CONCEPT_CLICKED);
  }


  onFinancialConceptsFilterEvent(event: EventInfo) {
    switch (event.type as FinancialConceptsFilterEventType) {
      case FinancialConceptsFilterEventType.SEARCH_FINANCIAL_CONCEPTS_CLICKED:
        Assertion.assertValue(event.payload.financialConceptCommand, 'event.payload.financialConceptCommand');
        Assertion.assertValue(event.payload.financialConceptsGroupsName,
          'event.payload.financialConceptsGroupsName');

        this.financialConceptsGroupsName = event.payload.financialConceptsGroupsName;
        this.commandExecuted = true;
        sendEvent(this.financialConceptsViewerEvent,
          FinancialConceptsViewerEventType.SEARCH_FINANCIAL_CONCEPTS_CLICKED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFinancialConceptsTableEvent(event: EventInfo) {
    switch (event.type as FinancialConceptsTableEventType) {

      case FinancialConceptsTableEventType.ENTRIES_DISPLAYED_TEXT:
        Assertion.assertValue(event.payload.entriesDisplayedText, 'event.payload.entriesDisplayedText');
        this.setText(event.payload.entriesDisplayedText);
        return;

      case FinancialConceptsTableEventType.EXPORT_DATA:
        this.setDisplayExportModal(true);
        return;

      case FinancialConceptsTableEventType.FINANCIAL_CONCEPT_CLICKED:
        Assertion.assertValue(event.payload.financialConcept, 'event.payload.financialConcept');
        sendEvent(this.financialConceptsViewerEvent,
          FinancialConceptsViewerEventType.SELECT_FINANCIAL_CONCEPT_CLICKED,
          {financialConcept: event.payload.financialConcept});

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
        sendEvent(this.financialConceptsViewerEvent,
          FinancialConceptsViewerEventType.EXPORT_DATA_BUTTON_CLICKED);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
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

    this.cardHint = `${this.financialConceptsGroupsName} - ${this.financialConceptsList.length}` +
      ` registros encontrados`;
  }


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.excelFileUrl = '';
  }

}
