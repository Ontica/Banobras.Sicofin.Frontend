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

export enum FinancialConceptTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'FinancialConceptTabbedViewComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-fa-financial-concept-tabbed-view',
  templateUrl: './financial-concept-tabbed-view.component.html',
})
export class FinancialConceptTabbedViewComponent implements OnChanges {

  @Input() financialConcept: FinancialConcept = EmptyFinancialConcept;

  @Output() financialConceptTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;

  isLoading = false;


  ngOnChanges() {
    this.setTitle();
  }


  onClose() {
    sendEvent(this.financialConceptTabbedViewEvent, FinancialConceptTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  private setTitle() {
    this.title = `${this.financialConcept.code}: ${this.financialConcept.name}`;
    this.hint = `${this.financialConcept.accountsChart?.name} - ${this.financialConcept.group.name}`;
  }

}
