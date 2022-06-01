/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { FinancialConceptsDataService } from '@app/data-services';

import { FinancialConceptEntry, EmptyFinancialConceptEntry, FinancialConcept, EmptyFinancialConcept,
         FinancialConceptEntryEditionCommand } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { FinancialConceptEntriesTableEventType } from './financial-concept-entries-table.component';

import { FinancialConceptEntryEditorEventType } from './financial-concept-entry-editor.component';

export enum FinancialConceptIntegrationEditionEventType {
  INTEGRATION_UPDATED = 'FinancialConceptIntegrationEditionComponent.Event.IntegrationUpdated',
}


@Component({
  selector: 'emp-fa-financial-concept-integration-edition',
  templateUrl: './financial-concept-integration-edition.component.html',
})
export class FinancialConceptIntegrationEditionComponent {

  @Input() financialConcept: FinancialConcept = EmptyFinancialConcept;

  @Output() financialConceptIntegrationEditionEvent = new EventEmitter<EventInfo>();

  submitted = false;

  canEdit = true;

  displayFinancialConceptEntryEditor = false;

  selectedFinancialConceptEntry: FinancialConceptEntry = EmptyFinancialConceptEntry;

  constructor(private financialConceptsData: FinancialConceptsDataService,
              private messageBox: MessageBoxService) {}


  onAddFinancialConceptEntryClicked() {
    this.setSelectedFinancialConceptEntry(EmptyFinancialConceptEntry, true);
  }


  onFinancialConceptEntriesTableEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as FinancialConceptEntriesTableEventType) {

      case FinancialConceptEntriesTableEventType.REMOVE_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.financialConceptEntry.uid,
          'event.payload.financialConceptEntry.uid');
        this.deleteFinancialConceptEntry(this.financialConcept.uid, event.payload.financialConceptEntry.uid);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFinancialConceptEntryEditorEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as FinancialConceptEntryEditorEventType) {

      case FinancialConceptEntryEditorEventType.CLOSE_MODAL_CLICKED:
        this.setSelectedFinancialConceptEntry(EmptyFinancialConceptEntry);
        return;

      case FinancialConceptEntryEditorEventType.CREATE_FINANCIAL_CONCEPT_ENTRY:
        Assertion.assertValue(event.payload.financialConceptEntry, 'event.payload.financialConceptEntry');
        this.insertFinancialConceptEntry(this.financialConcept.uid,
          event.payload.financialConceptEntry as FinancialConceptEntryEditionCommand);
        return;

      case FinancialConceptEntryEditorEventType.UPDATE_FINANCIAL_CONCEPT_ENTRY:
        Assertion.assertValue(event.payload.financialConceptEntryUID, 'event.payload.financialConceptEntryUID');
        Assertion.assertValue(event.payload.financialConceptEntry, 'event.payload.financialConceptEntry');
        this.updateFinancialConceptEntry(this.financialConcept.uid,
          event.payload.financialConceptEntryUID,
          event.payload.financialConceptEntry as FinancialConceptEntryEditionCommand);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private insertFinancialConceptEntry(financialConceptUID: string,
                                      command: FinancialConceptEntryEditionCommand) {
    this.submitted = true;

    this.financialConceptsData.insertFinancialConceptEntry(financialConceptUID, command)
      .toPromise()
      .then(x => this.emitFinancialConceptIntegrationUpdated())
      .finally(() => this.submitted = false);
  }


  private updateFinancialConceptEntry(financialConceptUID: string,
                                      financialConceptEntryUID: string,
                                      command: FinancialConceptEntryEditionCommand) {
    this.submitted = true;

    this.financialConceptsData.updateFinancialConceptEntry(financialConceptUID, financialConceptEntryUID, command)
      .toPromise()
      .then(x => this.emitFinancialConceptIntegrationUpdated())
      .finally(() => this.submitted = false);
  }


  private deleteFinancialConceptEntry(financialConceptUID: string,
                                      financialConceptEntryUID: string) {
    this.submitted = true;

    this.financialConceptsData.removeFinancialConceptEntry(financialConceptUID, financialConceptEntryUID)
      .toPromise()
      .then(x => this.emitFinancialConceptIntegrationUpdated())
      .finally(() => this.submitted = false);
  }


  private emitFinancialConceptIntegrationUpdated() {
    this.setSelectedFinancialConceptEntry(EmptyFinancialConceptEntry);
    sendEvent(this.financialConceptIntegrationEditionEvent,
      FinancialConceptIntegrationEditionEventType.INTEGRATION_UPDATED);
  }


  private setSelectedFinancialConceptEntry(financialConceptEntry: FinancialConceptEntry,
                                           display?: boolean) {
    this.selectedFinancialConceptEntry = financialConceptEntry;
    this.displayFinancialConceptEntryEditor = display ?? !isEmpty(this.selectedFinancialConceptEntry);
  }

}
