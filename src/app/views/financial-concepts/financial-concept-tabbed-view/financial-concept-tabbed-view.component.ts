/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { EmptyFinancialConcept, FinancialConcept } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import {
  FinancialConceptEditorEventType
} from '../financial-concept-edition/financial-concept-editor.component';

import {
  FinancialConceptIntegrationEditionEventType
} from '../financial-concept-integration-edition/financial-concept-integration-edition.component';

export enum FinancialConceptTabbedViewEventType {
  CLOSE_BUTTON_CLICKED      = 'FinancialConceptTabbedViewComponent.Event.CloseButtonClicked',
  FINANCIAL_CONCEPT_UPDATED = 'FinancialConceptTabbedViewComponent.Event.FinancialConceptUpdated',
  FINANCIAL_CONCEPT_REMOVED = 'FinancialConceptTabbedViewComponent.Event.FinancialConceptRemoved',
  FINANCIAL_CONCEPT_INTEGRATION_UPDATED = 'FinancialConceptTabbedViewComponent.Event.FinancialConceptIntegrationUpdated',
}

@Component({
  selector: 'emp-fa-financial-concept-tabbed-view',
  templateUrl: './financial-concept-tabbed-view.component.html',
})
export class FinancialConceptTabbedViewComponent implements OnChanges {

  @Input() financialConcept: FinancialConcept = EmptyFinancialConcept;

  @Input() canEdit = false;

  @Output() financialConceptTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 1;

  isLoading = false;


  ngOnChanges() {
    this.setTitle();
  }


  onClose() {
    sendEvent(this.financialConceptTabbedViewEvent, FinancialConceptTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  onFinancialConceptEditorEvent(event: EventInfo) {
    switch (event.type as FinancialConceptEditorEventType) {

      case FinancialConceptEditorEventType.FINANCIAL_CONCEPT_UPDATED:
        sendEvent(this.financialConceptTabbedViewEvent,
          FinancialConceptTabbedViewEventType.FINANCIAL_CONCEPT_UPDATED, event.payload);
        return;

      case FinancialConceptEditorEventType.FINANCIAL_CONCEPT_REMOVED:
        sendEvent(this.financialConceptTabbedViewEvent,
          FinancialConceptTabbedViewEventType.FINANCIAL_CONCEPT_REMOVED);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onFinancialConceptIntegrationEditionEvent(event: EventInfo) {
    switch (event.type as FinancialConceptIntegrationEditionEventType) {

      case FinancialConceptIntegrationEditionEventType.INTEGRATION_UPDATED:
        sendEvent(this.financialConceptTabbedViewEvent,
          FinancialConceptTabbedViewEventType.FINANCIAL_CONCEPT_INTEGRATION_UPDATED,
          {financialConcept: this.financialConcept});
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setTitle() {
    this.title = `${this.financialConcept.code}: ${this.financialConcept.name}`;
    this.hint = `${this.financialConcept.accountsChart?.name} - ${this.financialConcept.group.name}`;
  }

}
