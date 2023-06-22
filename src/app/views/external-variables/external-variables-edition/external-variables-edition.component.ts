/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { Assertion, Empty, EventInfo } from '@app/core';

import { ExternalVariablesDataService } from '@app/data-services';

import { EmptyExternalVariablesDatasetsQuery, ExternalVariable, ExternalVariableFields,
         ExternalVariablesDatasetsQuery, ExternalVariableSet } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import {
  ExternalVariableEditorComponent,
  ExternalVariableEditorEventType
} from './external-variable-editor.component';

import { ExternalVariableSetSelectorEventType } from './external-variable-set-selector.component';

import { ExternalVariablesListEventType } from './external-variables-list.component';

@Component({
  selector: 'emp-fa-external-variables-edition',
  templateUrl: './external-variables-edition.component.html',
})
export class ExternalVariablesEditionComponent {

  @ViewChild('externalVariableCreator') externalVariableCreator: ExternalVariableEditorComponent;

  @Output() closeEvent = new EventEmitter<void>();

  cardHint = 'Herramienta para editar las variables de un conjunto dado.';

  query: ExternalVariablesDatasetsQuery = Object.assign({}, EmptyExternalVariablesDatasetsQuery);

  externalVariableSet: ExternalVariableSet = Empty;

  externalVariablesList: ExternalVariable[] = [];

  isLoading = false;

  queryExecuted = false;

  submitted = false;


  constructor(private externalVariablesData: ExternalVariablesDataService,
              private messageBox: MessageBoxService){ }


  get isSelectorValid(): boolean {
    return !!this.query.externalVariablesSetUID && !!this.query.date;
  }


  onClose() {
    this.closeEvent.emit();
  }


  onExternalVariableSetSelectorEvent(event: EventInfo) {
    if (this.isLoading || this.submitted) {
      return;
    }

    switch (event.type as ExternalVariableSetSelectorEventType) {

      case ExternalVariableSetSelectorEventType.FORM_CHANGED:
        Assertion.assertValue(event.payload.query, 'event.payload.query');
        Assertion.assertValue(event.payload.externalVariableSet, 'event.payload.externalVariableSet');
        this.query = event.payload.query as ExternalVariablesDatasetsQuery;
        this.externalVariableSet = event.payload.externalVariableSet as ExternalVariableSet;
        this.validateSelectorData();
        return;

      default:
        console.log(`Unhandled type interface event ${event.type}`);
        return;
    }
  }


  onExternalVariableEditorEvent(event: EventInfo) {
    if (this.isLoading || this.submitted) {
      return;
    }

    switch (event.type as ExternalVariableEditorEventType) {

      case ExternalVariableEditorEventType.ADD_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.externalVariablesSetUID, 'event.payload.externalVariablesSetUID');
        Assertion.assertValue(event.payload.externalVariableFields, 'event.payload.externalVariableFields');
        this.addExternalVariable(event.payload.externalVariablesSetUID,
                                 event.payload.externalVariableFields);
        return;

      default:
        console.log(`Unhandled type interface event ${event.type}`);
        return;
    }
  }


  onExternalVariablesListEvent(event: EventInfo) {
    if (this.isLoading || this.submitted) {
      return;
    }

    switch (event.type as ExternalVariablesListEventType) {

      case ExternalVariablesListEventType.UPDATE_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.externalVariablesSetUID, 'event.payload.externalVariablesSetUID');
        Assertion.assertValue(event.payload.externalVariableUID, 'event.payload.externalVariableUID');
        Assertion.assertValue(event.payload.externalVariableFields, 'event.payload.externalVariableFields');
        this.updateExternalVariable(event.payload.externalVariablesSetUID,
                                    event.payload.externalVariableUID,
                                    event.payload.externalVariableFields);
        return;


      case ExternalVariablesListEventType.REMOVE_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.externalVariablesSetUID, 'event.payload.externalVariablesSetUID');
        Assertion.assertValue(event.payload.externalVariableUID, 'event.payload.externalVariableUID');
        this.removeExternalVariable(event.payload.externalVariablesSetUID,
                                    event.payload.externalVariableUID);
        return;

      default:
        console.log(`Unhandled type interface event ${event.type}`);
        return;
    }
  }


  private getExternalVariables(query: ExternalVariablesDatasetsQuery) {
    this.isLoading = true;

    this.externalVariablesData.getExternalVariables(query.externalVariablesSetUID, query.date)
      .firstValue()
      .then(x => this.setExternalVariablesList(x, true))
      .catch(e => this.setExternalVariablesList([], false))
      .finally(() => this.isLoading = false);
  }


  private addExternalVariable(setUID: string, fields: ExternalVariableFields) {
    this.submitted = true;

    this.externalVariablesData.addExternalVariable(setUID, fields)
      .firstValue()
      .then(x => this.refreshData())
      .finally(() => this.submitted = false);
  }


  private updateExternalVariable(setUID: string, variableUID: string, fields: ExternalVariableFields) {
    this.submitted = true;

    this.externalVariablesData.updateExternalVariable(setUID, variableUID, fields)
      .firstValue()
      .then(x => this.refreshData())
      .finally(() => this.submitted = false);
  }


  private removeExternalVariable(setUID: string, variableUID: string) {
    this.submitted = true;

    this.externalVariablesData.removeExternalVariable(setUID, variableUID)
      .firstValue()
      .then(x => this.refreshData())
      .finally(() => this.submitted = false);
  }


  private setExternalVariablesList(data: ExternalVariable[], queryExecuted: boolean) {
    this.externalVariablesList = data;
    this.queryExecuted = queryExecuted;
    this.setTexts();
  }


  private refreshData() {
    this.externalVariableCreator.resetFormData();
    this.validateSelectorData();
  }


  private validateSelectorData() {
    if (this.isSelectorValid) {
      this.getExternalVariables(this.query);
    } else {
      this.setExternalVariablesList([], false);
    }
  }


  private setTexts() {
    if(this.queryExecuted) {
      this.cardHint = `${this.externalVariableSet.name} - ${this.externalVariablesList.length} ` +
        `registros encontrados.`
    } else {
      this.cardHint = 'Herramienta para editar las variables de un conjunto dado.';
    }
  }

}
