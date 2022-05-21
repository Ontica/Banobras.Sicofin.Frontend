/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges } from '@angular/core';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { FinancialConceptsDataService } from '@app/data-services';

import { ConceptIntegrationEntry, EmptyEmptyConceptIntegrationEntry } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ConceptIntegrationEntriesTableEventType } from './concept-integration-entries-table.component';


@Component({
  selector: 'emp-fa-financial-concept-integration-edition',
  templateUrl: './financial-concept-integration-edition.component.html',
})
export class FinancialConceptIntegrationEditionComponent implements OnChanges {

  @Input() financialConceptUID = '';

  isLoading = false;

  submitted = false;

  canEdit = false;

  conceptIntegrationEntryList: ConceptIntegrationEntry[] = [];

  displayConceptIntegrationEntryEditor = false;

  selectedConceptIntegrationEntry: ConceptIntegrationEntry = EmptyEmptyConceptIntegrationEntry;

  constructor(private financialConceptsData: FinancialConceptsDataService,
              private messageBox: MessageBoxService) {}


  ngOnChanges() {
    this.getConceptIntegration();
  }


  onAddConceptIntegrationEntryClicked() {
    this.setSelectedConceptIntegrationEntry(EmptyEmptyConceptIntegrationEntry, true);
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
        this.setSelectedConceptIntegrationEntry(event.payload.conceptIntegrationEntry as ConceptIntegrationEntry);
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


  private getConceptIntegration() {
    this.isLoading = true;
    this.conceptIntegrationEntryList = [];

    this.financialConceptsData.getConceptIntegration(this.financialConceptUID)
      .toPromise()
      .then(x => this.conceptIntegrationEntryList = x)
      .finally(() => this.isLoading = false);
  }


  private deleteConceptIntegrationEntry(conceptIntegrationEntryUID: string) {
    this.submitted = true;

    setTimeout(() => {
      this.messageBox.showInDevelopment('Eliminar integración', conceptIntegrationEntryUID);
      this.submitted = false
    }, 500);
  }


  private setSelectedConceptIntegrationEntry(conceptIntegrationEntry: ConceptIntegrationEntry,
                                             display?: boolean) {
    this.selectedConceptIntegrationEntry = conceptIntegrationEntry;
    this.displayConceptIntegrationEntryEditor = display ?? !isEmpty(this.selectedConceptIntegrationEntry);
  }

}
