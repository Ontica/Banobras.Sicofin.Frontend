/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { EmptyFinancialConcept, FinancialConceptDescriptor } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

export enum FinancialConceptTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'FinancialConceptTabbedViewComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-fa-financial-concept-tabbed-view',
  templateUrl: './financial-concept-tabbed-view.component.html',
})
export class FinancialConceptTabbedViewComponent implements OnChanges {

  @Input() financialConcept: FinancialConceptDescriptor = EmptyFinancialConcept;

  @Output() financialConceptTabbedViewEvent = new EventEmitter<EventInfo>();

  title = '';

  hint = '';

  selectedTabIndex = 0;

  isLoading = false;

  constructor(private messageBox: MessageBoxService){}


  ngOnChanges() {
    this.setTitle();
  }


  onClose() {
    sendEvent(this.financialConceptTabbedViewEvent, FinancialConceptTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  private setTitle() {
    this.title = `${this.financialConcept.code}: ${this.financialConcept.name}`;
    this.hint = `${this.financialConcept.accountsChartName} - ${this.financialConcept.groupName}`;
  }

}
