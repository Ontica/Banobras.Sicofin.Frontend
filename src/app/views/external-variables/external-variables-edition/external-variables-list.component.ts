/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { Assertion, Empty, EventInfo } from '@app/core';

import { EmptyExternalVariable, ExternalVariable, ExternalVariableSet } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { sendEvent } from '@app/shared/utils';

import { ExternalVariableEditorEventType } from './external-variable-editor.component';

export enum ExternalVariablesListEventType {
  UPDATE_BUTTON_CLICKED = 'ExternalVariablesListComponent.Event.UpdateButtonClicked',
  REMOVE_BUTTON_CLICKED = 'ExternalVariablesListComponent.Event.RemoveButtonClicked',
}

@Component({
  selector: 'emp-fa-external-variables-list',
  templateUrl: './external-variables-list.component.html',
})
export class ExternalVariablesListComponent implements OnChanges {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() externalVariablesList: ExternalVariable[] = [];

  @Input() queryExecuted = false;

  @Input() externalVariableSet: ExternalVariableSet = Empty;

  @Output() externalVariablesListEvent = new EventEmitter<EventInfo>();

  externalVariablesSelected: ExternalVariable = EmptyExternalVariable;

  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.externalVariablesList) {
      this.scrollToTop();
      this.externalVariablesSelected = EmptyExternalVariable;
    }
  }


  onEditExternalVariableClicked(variable: ExternalVariable) {
    this.externalVariablesSelected = variable;
  }


  onExternalVariableEditorEvent(event: EventInfo) {
    switch (event.type as ExternalVariableEditorEventType) {

      case ExternalVariableEditorEventType.UPDATE_BUTTON_CLICKED:
        Assertion.assertValue(event.payload.externalVariablesSetUID, 'event.payload.externalVariablesSetUID');
        Assertion.assertValue(event.payload.externalVariableUID, 'event.payload.externalVariableUID');
        Assertion.assertValue(event.payload.externalVariableFields, 'event.payload.externalVariableFields');

        sendEvent(this.externalVariablesListEvent,
          ExternalVariablesListEventType.UPDATE_BUTTON_CLICKED, event.payload);
        return;

      case ExternalVariableEditorEventType.CANCEL_BUTTON_CLICKED:
        this.externalVariablesSelected = EmptyExternalVariable;
        return;

      default:
        console.log(`Unhandled type interface event ${event.type}`);
        return;
    }
  }


  onUpdateExternalVariableClicked(variable: ExternalVariable) {
    this.messageBox.showInDevelopment('Actualizar Variable', {variable});
  }


  onRemoveExternalVariableClicked(variable: ExternalVariable) {
    const message = this.getConfirmMessage(variable);

    this.messageBox.confirm(message, 'Eliminar variable', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          const payload = {
            externalVariablesSetUID: variable.setUID,
            externalVariableUID: variable.uid,
          };
          sendEvent(this.externalVariablesListEvent,
            ExternalVariablesListEventType.REMOVE_BUTTON_CLICKED, payload);
        }
      });
  }


  private getConfirmMessage(variable: ExternalVariable): string {
    return `Esta operación eliminará la variable <strong>(${variable.code}) ${variable.name}</strong> ` +
           `del conjunto <strong>${this.externalVariableSet.name}</strong>` +
           `<br><br>¿Elimino la variable?`;
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(-1);
    }
  }

}
