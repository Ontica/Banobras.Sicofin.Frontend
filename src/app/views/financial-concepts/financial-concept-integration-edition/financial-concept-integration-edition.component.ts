/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { FinancialConceptsDataService } from '@app/data-services';

import { FinancialConceptEntry, EmptyFinancialConceptEntry, FinancialConcept, EmptyFinancialConcept } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ConceptIntegrationEntriesTableEventType } from './concept-integration-entries-table.component';


@Component({
  selector: 'emp-fa-financial-concept-integration-edition',
  templateUrl: './financial-concept-integration-edition.component.html',
})
export class FinancialConceptIntegrationEditionComponent {

  @Input() financialConcept: FinancialConcept = EmptyFinancialConcept;

  submitted = false;

  canEdit = false;

  displayConceptIntegrationEntryEditor = false;

  selectedConceptIntegrationEntry: FinancialConceptEntry = EmptyFinancialConceptEntry;

  constructor(private financialConceptsData: FinancialConceptsDataService,
              private messageBox: MessageBoxService) {}


  onAddConceptIntegrationEntryClicked() {
    this.setSelectedConceptIntegrationEntry(EmptyFinancialConceptEntry, true);
    this.messageBox.showInDevelopment('Agregar integración');
  }


  onConceptIntegrationEntriesTableEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as ConceptIntegrationEntriesTableEventType) {

      case ConceptIntegrationEntriesTableEventType.UPDATE_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.conceptIntegrationEntry,
          'event.payload.conceptIntegrationEntry');
        this.setSelectedConceptIntegrationEntry(event.payload.conceptIntegrationEntry as FinancialConceptEntry);
        this.messageBox.showInDevelopment('Editar integración', event.payload.conceptIntegrationEntry);
        return;

      case ConceptIntegrationEntriesTableEventType.REMOVE_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.conceptIntegrationEntry.uid,
          'event.payload.conceptIntegrationEntry.uid');
        this.deleteConceptIntegrationEntry(event.payload.conceptIntegrationEntry.uid);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private deleteConceptIntegrationEntry(conceptIntegrationEntryUID: string) {
    this.submitted = true;

    setTimeout(() => {
      this.messageBox.showInDevelopment('Eliminar integración', conceptIntegrationEntryUID);
      this.submitted = false
    }, 500);
  }


  private setSelectedConceptIntegrationEntry(conceptIntegrationEntry: FinancialConceptEntry,
                                             display?: boolean) {
    this.selectedConceptIntegrationEntry = conceptIntegrationEntry;
    this.displayConceptIntegrationEntryEditor = display ?? !isEmpty(this.selectedConceptIntegrationEntry);
  }

}
