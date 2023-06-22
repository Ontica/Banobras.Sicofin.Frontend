/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, DateString, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FinancialConceptsDataService } from '@app/data-services';

import { EmptyFinancialConcept, FinancialConcept, FinancialConceptEditionCommand } from '@app/models';

import { FinancialConceptHeaderEventType } from './financial-concept-header.component';

export enum FinancialConceptEditorEventType {
  FINANCIAL_CONCEPT_UPDATED = 'FinancialConceptEditorComponent.Event.FinancialConceptUpdated',
  FINANCIAL_CONCEPT_REMOVED = 'FinancialConceptEditorComponent.Event.FinancialConceptRemoved',
}

@Component({
  selector: 'emp-fa-financial-concept-editor',
  templateUrl: './financial-concept-editor.component.html',
})
export class FinancialConceptEditorComponent {

  @Input() financialConcept: FinancialConcept = EmptyFinancialConcept;

  @Input() queryDate: DateString = null;

  @Input() canEdit = false;

  @Output() financialConceptEditorEvent = new EventEmitter<EventInfo>();


  submitted = false;

  constructor(private financialConceptsData: FinancialConceptsDataService,
              private messageBox: MessageBoxService) {}


  onFinancialConceptHeaderEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as FinancialConceptHeaderEventType) {

      case FinancialConceptHeaderEventType.UPDATE_FINANCIAL_CONCEPT:
        Assertion.assertValue(event.payload.financialConcept, 'event.payload.financialConcept');
        this.updateFinancialConcept(event.payload.financialConcept as FinancialConceptEditionCommand);
        return;

      case FinancialConceptHeaderEventType.REMOVE_FINANCIAL_CONCEPT:
        Assertion.assertValue(event.payload.financialConcept.uid, 'event.payload.financialConcept.uid');
        this.removeFinancialConcept(event.payload.financialConcept.uid as string);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateFinancialConcept(command: FinancialConceptEditionCommand) {
    this.submitted = true;

    this.financialConceptsData.updateFinancialConcept(this.financialConcept.uid, command)
      .firstValue()
      .then(x => {
        sendEvent(this.financialConceptEditorEvent, FinancialConceptEditorEventType.FINANCIAL_CONCEPT_UPDATED,
          {financialConcept: x});
      })
      .finally(() => this.submitted = false);
  }


  private removeFinancialConcept(financialConceptUID: string) {
    this.submitted = true;

    this.financialConceptsData.removeFinancialConcept(financialConceptUID)
      .firstValue()
      .then(x => {
        this.showMessageDeleted();
        sendEvent(this.financialConceptEditorEvent,
          FinancialConceptEditorEventType.FINANCIAL_CONCEPT_REMOVED);
      })
      .finally(() => this.submitted = false);
  }


  private showMessageDeleted() {
    this.messageBox.show('El concepto fue eliminado de la agrupación.', 'Eliminar concepto');
  }

}
