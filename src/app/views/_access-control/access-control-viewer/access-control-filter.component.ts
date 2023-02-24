/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccessControlStateSelector } from '@app/presentation/exported.presentation.types';

import { AccessControlQueryType, AccessControlQueryTypeList,
         DefaultAccessControlQueryType } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum AccessControlFilterEventType {
  SEARCH_CLICKED = 'AccessControlFilterComponent.Event.SearchClicked',
}

@Component({
  selector: 'emp-ng-access-control-filter',
  templateUrl: './access-control-filter.component.html',
})
export class AccessControlFilterComponent implements OnInit, OnDestroy {

  @Output() accessControlFilterEvent = new EventEmitter<EventInfo>();

  isLoading = false;

  queryTypesList: Identifiable[] = AccessControlQueryTypeList;

  contextsList: Identifiable[] = [];

  formData = {
    queryType: DefaultAccessControlQueryType,
    contextUID: null,
    keywords: null,
  };

  helper: SubscriptionHelper;

  isContextRequired = false;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.loadContexts();
    this.setIsContextRequired();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onQueryTypeChanges() {
    this.setIsContextRequired()
  }


  onClearKeyword() {
    this.formData.keywords = '';
  }


  onSearchClicked() {
    const payload = {
      query: this.getFormData(),
      queryTypeName: this.formData.queryType.name,
    };

    sendEvent(this.accessControlFilterEvent, AccessControlFilterEventType.SEARCH_CLICKED, payload);
  }


  private loadContexts() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(AccessControlStateSelector.CONTEXTS_LIST)
      .subscribe(x => {
        this.contextsList = x;
        this.isLoading = false;
      });
  }


  private setIsContextRequired() {
    this.isContextRequired = [AccessControlQueryType.Roles, AccessControlQueryType.Features]
      .includes(this.formData.queryType.uid as AccessControlQueryType);
  }


  private getFormData(): any {
    const data: any = {
      queryType: this.formData.queryType.uid || '',
      contextUID: this.formData.contextUID || '',
      keywords: this.formData.keywords || '',
    };

    return data;
  }

}
