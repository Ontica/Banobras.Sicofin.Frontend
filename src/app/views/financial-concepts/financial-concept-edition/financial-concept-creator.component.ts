/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, DateString, EventInfo } from '@app/core';

import { FinancialConceptsDataService } from '@app/data-services';

import { FinancialConceptEditionCommand } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { FinancialConceptHeaderEventType } from './financial-concept-header.component';

export enum FinancialConceptCreatorEventType {
  CLOSE_MODAL_CLICKED = 'FinancialConceptCreatorComponent.Event.CloseModalClicked',
  FINANCIAL_CONCEPT_CREATED = 'FinancialConceptCreatorComponent.Event.FinancialConceptCreated',
}


@Component({
  selector: 'emp-fa-financial-concept-creator',
  templateUrl: './financial-concept-creator.component.html',
})
export class FinancialConceptCreatorComponent {

  @Input() accountsChartUID = '';

  @Input() groupUID = '';

  @Input() queryDate: DateString = null;

  @Output() financialConceptCreatorEvent = new EventEmitter<EventInfo>();

  submitted = false;

  constructor(private financialConceptsData: FinancialConceptsDataService) {}


  onClose() {
    sendEvent(this.financialConceptCreatorEvent, FinancialConceptCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onFinancialConceptHeaderEvent(event: EventInfo) {
    if (this.submitted) {
      return;
    }

    switch (event.type as FinancialConceptHeaderEventType) {

      case FinancialConceptHeaderEventType.CREATE_FINANCIAL_CONCEPT:
        Assertion.assertValue(event.payload.financialConcept, 'event.payload.financialConcept');
        this.insertFinancialConcept(event.payload.financialConcept as FinancialConceptEditionCommand);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private insertFinancialConcept(command: FinancialConceptEditionCommand) {
    this.submitted = true;

    this.financialConceptsData.insertFinancialConcept(command)
      .firstValue()
      .then(x => {
        sendEvent(this.financialConceptCreatorEvent,
          FinancialConceptCreatorEventType.FINANCIAL_CONCEPT_CREATED, {financialConcept: x});
      })
      .finally(() => this.submitted = false);
  }

}
