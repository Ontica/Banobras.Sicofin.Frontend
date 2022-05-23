/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { isEmpty } from '@app/core';

import { EmptyFinancialConcept, FinancialConceptDescriptor } from '@app/models';

import {
  FinancialConceptsViewerEventType
} from '@app/views/financial-concepts/financial-concepts-viewer/financial-concepts-viewer.component';



@Component({
  selector: 'emp-fa-financial-concepts-main-page',
  templateUrl: './financial-concepts-main-page.component.html',
})
export class FinancialConceptsMainPageComponent {

  displayFinancialConceptTabbed = false;

  selectedFinancialConcept: FinancialConceptDescriptor = EmptyFinancialConcept;


  onFinancialConceptsViewerEvent(event) {
    switch (event.type as FinancialConceptsViewerEventType) {
      case FinancialConceptsViewerEventType.FINANCIAL_CONCEPT_SELECTED:
        this.setSelectedFinancialConcept(event.payload.financialConcept as FinancialConceptDescriptor);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseFinancialConceptTabbedView() {
    this.setSelectedFinancialConcept(EmptyFinancialConcept);
  }


  private setSelectedFinancialConcept(financialConcept: FinancialConceptDescriptor) {
    this.selectedFinancialConcept = financialConcept;
    this.displayFinancialConceptTabbed = !isEmpty(financialConcept);
  }

}
