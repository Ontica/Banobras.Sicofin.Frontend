/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { Assertion, DateString, EventInfo, isEmpty } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { sendEvent } from '@app/shared/utils';

import { FinancialConceptsDataService } from '@app/data-services';

import { EmptyFinancialConceptEntry, FinancialConcept, EmptyFinancialConcept,
         FinancialConceptEntryEditionResult, FinancialConceptEntryEditionCommand,
         FinancialConceptEntry } from '@app/models';

import { ConfirmEditionResultModalComponent } from './confirm-edition-result-modal.component';

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

  @Input() queryDate: DateString = null;

  @Input() canEdit = false;

  @Output() financialConceptIntegrationEditionEvent = new EventEmitter<EventInfo>();

  @ViewChild(ConfirmEditionResultModalComponent) resultModal: ConfirmEditionResultModalComponent;

  isLoading = false;

  editionSubmitted = false;

  deleteSubmitted = false;

  displayFinancialConceptEntryEditor = false;

  selectedFinancialConceptEntry: FinancialConceptEntry = EmptyFinancialConceptEntry;

  constructor(private financialConceptsData: FinancialConceptsDataService,
              private messageBox: MessageBoxService) {}


  get isSelectedEntrySaved(): boolean {
    return !isEmpty(this.selectedFinancialConceptEntry);
  }


  onAddFinancialConceptEntryClicked() {
    this.setSelectedFinancialConceptEntry(EmptyFinancialConceptEntry, true);
  }


  onFinancialConceptEntriesTableEvent(event: EventInfo): void {
    if (this.editionSubmitted || this.deleteSubmitted) {
      return;
    }

    switch (event.type as FinancialConceptEntriesTableEventType) {

      case FinancialConceptEntriesTableEventType.UPDATE_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.financialConceptEntry.uid,
          'event.payload.financialConceptEntry.uid');
        this.getFinancialConceptEntry(event.payload.financialConceptEntry.uid);
        return;

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
    if (this.editionSubmitted || this.deleteSubmitted) {
      return;
    }

    switch (event.type as FinancialConceptEntryEditorEventType) {

      case FinancialConceptEntryEditorEventType.CLOSE_MODAL_CLICKED:
        this.setSelectedFinancialConceptEntry(EmptyFinancialConceptEntry);
        return;

      case FinancialConceptEntryEditorEventType.INSERT_ENTRY:
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        this.insertFinancialConceptEntry(event.payload.command as FinancialConceptEntryEditionCommand);
        return;

      case FinancialConceptEntryEditorEventType.UPDATE_ENTRY:
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        this.updateFinancialConceptEntry(event.payload.command as FinancialConceptEntryEditionCommand);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getFinancialConceptEntry(financialConceptEntryUID: string) {
    this.isLoading = true;

    this.financialConceptsData.getFinancialConceptEntry(this.financialConcept.uid, financialConceptEntryUID)
      .firstValue()
      .then(x => this.setSelectedFinancialConceptEntry(x))
      .finally(() => this.isLoading = false);
  }


  private insertFinancialConceptEntry(command: FinancialConceptEntryEditionCommand) {
    this.editionSubmitted = true;

    this.financialConceptsData.insertFinancialConceptEntry(this.financialConcept.uid, command)
      .firstValue()
      .then(x => this.validateEditionResult(x))
      .catch(() => this.editionSubmitted = false);
  }


  private updateFinancialConceptEntry(command: FinancialConceptEntryEditionCommand) {
    this.editionSubmitted = true;

    this.financialConceptsData.updateFinancialConceptEntry(this.financialConcept.uid,
                                                           this.selectedFinancialConceptEntry.uid,
                                                           command)
      .firstValue()
      .then(x => this.validateEditionResult(x))
      .catch(() => this.editionSubmitted = false);
  }


  private validateEditionResult(editionResult: FinancialConceptEntryEditionResult) {
    if (editionResult?.command?.dryRun) {
      this.validateDryRunResponse(editionResult);
    } else {
      this.validateExecuteResponse(editionResult);
    }
  }


  private validateDryRunResponse(editionResult: FinancialConceptEntryEditionResult) {
    if (editionResult.actions.length > 0 || editionResult.warnings.length > 0 ||
        editionResult.issues.length > 0) {
      this.editionSubmitted = false;
      this.openValidateResultModal(editionResult);
    } else if (editionResult.command.isValid) {
      this.submitEntryEdition(editionResult.command);
    } else {
      this.messageBox.showError('El comando no es válido.');
      this.editionSubmitted = false;
    }
  }


  private validateExecuteResponse(editionResult: FinancialConceptEntryEditionResult) {
      this.emitIntegrationUpdated(editionResult.message);
      this.editionSubmitted = false;
  }


  private openValidateResultModal(editionResult: FinancialConceptEntryEditionResult) {
    this.resultModal.validateResult(editionResult)
      .firstValue()
      .then(x => {
        if (x) {
          this.submitEntryEdition(editionResult.command);
        }
      });
  }


  private submitEntryEdition(command: FinancialConceptEntryEditionCommand) {
    command.dryRun = false;

    if (this.isSelectedEntrySaved) {
      this.updateFinancialConceptEntry(command);
    } else {
      this.insertFinancialConceptEntry(command);
    }
  }


  private deleteFinancialConceptEntry(financialConceptUID: string,
                                      financialConceptEntryUID: string) {
    this.deleteSubmitted = true;

    this.financialConceptsData.removeFinancialConceptEntry(financialConceptUID, financialConceptEntryUID)
      .firstValue()
      .then(x => this.emitIntegrationUpdated('La regla fue eliminada de la agrupación.'))
      .finally(() => this.deleteSubmitted = false);
  }


  private emitIntegrationUpdated(message: string) {
    if (!!message) {
      this.messageBox.show(message, 'Operación ejecutada');
    }

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
