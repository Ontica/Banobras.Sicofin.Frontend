/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { Empty, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { ExternalVariablesDatasetsQuery, ExternalVariableSet } from '@app/models';

import { ExternalVariablesStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

export enum ExternalVariableSetSelectorEventType {
  FORM_CHANGED = 'ExternalVariableSetSelectorComponent.Event.FormChanged',
}

@Component({
  selector: 'emp-fa-external-variable-set-selector',
  templateUrl: './external-variable-set-selector.component.html',
})
export class ExternalVariableSetSelectorComponent implements OnInit, OnDestroy {

  @Output() externalVariableSetSelectorEvent = new EventEmitter<EventInfo>();

  helper: SubscriptionHelper;

  externalVariableSetList: ExternalVariableSet[] = [];

  formData = {
    externalVariablesSetUID: null,
    date: '',
  };

  isLoading = false;

  constructor(private uiLayer: PresentationLayer,) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadExternalVariablesSets();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onSelectorChanges() {
    setTimeout(() => {
      const payload = {
        query: this.getExternalVariablesDatasetsQuery(),
        externalVariableSet: this.getExternalVariableSet(),
      };

      sendEvent(this.externalVariableSetSelectorEvent,
        ExternalVariableSetSelectorEventType.FORM_CHANGED, payload);
    });
  }


  private loadExternalVariablesSets() {
    this.isLoading = true;

    this.helper.select<ExternalVariableSet[]>(ExternalVariablesStateSelector.EXTERNAL_VARIABLES_SETS_LIST)
      .subscribe(x => {
        this.externalVariableSetList = x;
        this.isLoading = false;
      });
  }


  private getExternalVariablesDatasetsQuery(): ExternalVariablesDatasetsQuery {
    const query: ExternalVariablesDatasetsQuery = {
      externalVariablesSetUID: this.formData.externalVariablesSetUID,
      date: this.formData.date,
    };

    return query;
  }


  private getExternalVariableSet(): ExternalVariableSet  {
    return this.externalVariableSetList.find(x => x.uid === this.formData.externalVariablesSetUID) ?? Empty;
  }

}
