/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, isEmpty } from '@app/core';

import { FinancialConceptsDataService } from '@app/data-services';

import { EmptyFinancialConcept, EmptyFinancialConceptCommand, FinancialConcept, FinancialConceptCommand,
         FinancialConceptDescriptor } from '@app/models';

import {
  FinancialConceptsViewerEventType
} from '@app/views/financial-concepts/financial-concepts-viewer/financial-concepts-viewer.component';


@Component({
  selector: 'emp-fa-financial-concepts-main-page',
  templateUrl: './financial-concepts-main-page.component.html',
})
export class FinancialConceptsMainPageComponent {

  isLoading = false;

  isLoadingFinancialConcept = false;

  financialConceptCommand: FinancialConceptCommand = Object.assign({}, EmptyFinancialConceptCommand);

  financialConceptsList: FinancialConceptDescriptor[] = [];

  excelFileUrl = '';

  displayFinancialConceptTabbed = false;

  selectedFinancialConcept: FinancialConcept = EmptyFinancialConcept;


  constructor(private financialConceptsData: FinancialConceptsDataService) { }


  onFinancialConceptsViewerEvent(event) {
    switch (event.type as FinancialConceptsViewerEventType) {
      case FinancialConceptsViewerEventType.SEARCH_FINANCIAL_CONCEPTS_CLICKED:
        Assertion.assertValue(event.payload.financialConceptCommand, 'event.payload.financialConceptCommand');
        this.financialConceptCommand = event.payload.financialConceptCommand as FinancialConceptCommand;
        this.getFinancialConceptsInGroup();
        return;

      case FinancialConceptsViewerEventType.EXPORT_DATA_BUTTON_CLICKED:
        if (!this.financialConceptCommand.accountsChartUID) {
          return;
        }

        this.exportFinancialConceptsToExcel();
        return;

      case FinancialConceptsViewerEventType.SELECT_FINANCIAL_CONCEPT_CLICKED:
        Assertion.assertValue(event.payload.financialConcept, 'event.payload.financialConcept');
        this.getFinancialConcept(event.payload.financialConcept.uid);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onCloseFinancialConceptTabbedView() {
    this.setSelectedFinancialConcept(EmptyFinancialConcept);
  }


  private getFinancialConceptsInGroup() {
    this.financialConceptsList = [];
    this.isLoading = true;

    this.financialConceptsData.getFinancialConceptsInGroup(this.financialConceptCommand.groupUID)
      .toPromise()
      .then(x => this.financialConceptsList = x)
      .finally(() => this.isLoading = false);
  }


  private exportFinancialConceptsToExcel() {
    this.financialConceptsData.exportFinancialConceptsToExcel(this.financialConceptCommand.groupUID)
      .toPromise()
      .then(x => this.excelFileUrl = x.url);
  }


  private getFinancialConcept(financialConceptUID: string) {
    this.isLoadingFinancialConcept = true;
    this.financialConceptsData.getFinancialConcept(financialConceptUID)
      .toPromise()
      .then(x => this.setSelectedFinancialConcept(x))
      .catch(e => this.onCloseFinancialConceptTabbedView())
      .finally(() => this.isLoadingFinancialConcept = false);
  }


  private setSelectedFinancialConcept(financialConcept: FinancialConcept) {
    this.selectedFinancialConcept = financialConcept;
    this.displayFinancialConceptTabbed = !isEmpty(financialConcept);
  }

}
