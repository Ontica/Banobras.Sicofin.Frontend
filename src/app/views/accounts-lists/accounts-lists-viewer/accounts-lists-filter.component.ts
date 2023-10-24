/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { AccountsListsDataService } from '@app/data-services';

import { AccountsListQuery } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum AccountsListsFilterEventType {
  SEARCH_CLICKED = 'AccountsListsFilterComponent.Event.SearchClicked',
}

@Component({
  selector: 'emp-fa-accounts-lists-filter',
  templateUrl: './accounts-lists-filter.component.html',
})
export class AccountsListsFilterComponent implements OnInit {

  @Output() accountsListsFilterEvent = new EventEmitter<EventInfo>();

  accountsLists: Identifiable[] = [];

  formData = {
    type: null,
    keywords: null,
  };

  isLoading = false;


  constructor(private accountsListsData: AccountsListsDataService) { }


  ngOnInit() {
    this.loadDataList();
  }


  get isFormValid(): boolean {
    return !isEmpty(this.formData.type);
  }


  onClearKeyword() {
    this.formData.keywords = '';
  }


  onSearchClicked() {
    if (this.isFormValid) {
      const payload = {
        accountsListName: this.formData.type.name,
        query: this.getFormData(),
      };

      sendEvent(this.accountsListsFilterEvent,
        AccountsListsFilterEventType.SEARCH_CLICKED, payload);
    }
  }


  private loadDataList() {
    this.isLoading = true;

    this.accountsListsData.getAccountsListsForEdition()
      .firstValue()
      .then(x => this.accountsLists = x)
      .finally(() => this.isLoading = false);
  }


  private getFormData(): AccountsListQuery {
    Assertion.assert(this.isFormValid,
      'Programming error: formData must be validated before command execution.');

    const data: AccountsListQuery = {
      type: this.formData.type.uid || '',
      keywords: this.formData.keywords || '',
    };

    return data;
  }

}
