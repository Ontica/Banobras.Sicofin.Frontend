/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { AccountStatementQuery, BalanceExplorerQuery, BalanceExplorerEntry, BalanceExplorerTypes,
         TrialBalanceQuery, TrialBalanceEntry, TrialBalanceTypes, AccountStatementSortOrder,
         DefaultAccountStatementSortOrder, AccountStatementOrderTypesList,
         AccountStatementSortTypesList } from '@app/models';

export enum AccountStatementFilterEventType {
  BUILD_ACCOUNT_STATEMENT_CLICKED = 'AccountStatementFilterComponent.Event.BuildAccountStatementClicked',
  CLOSE_BUTTON_CLICKED            = 'AccountStatementFilterComponent.Event.CloseButtonClicked',
}

@Component({
  selector: 'emp-fa-account-statement-filter',
  templateUrl: './account-statement-filter.component.html',
})
export class AccountStatementFilterComponent implements OnChanges {

  @Input() entry: BalanceExplorerEntry | TrialBalanceEntry;

  @Input() query: BalanceExplorerQuery | TrialBalanceQuery;

  @Input() orderBy: AccountStatementSortOrder = DefaultAccountStatementSortOrder;

  @Input() displayCard = false;

  @Output() accountStatementFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    initialPeriod: {fromDate: null, toDate: null},
    finalPeriod: {fromDate: null, toDate: null},
    orderType: DefaultAccountStatementSortOrder.orderType,
    sortType: DefaultAccountStatementSortOrder.sortType,
  };

  initialPeriodFixedDate = null;

  finalPeriodFixedDate = null;

  sortTypesList = AccountStatementSortTypesList;

  orderTypesList = AccountStatementOrderTypesList;


  ngOnChanges() {
    this.setInitialPeriodData(this.query);
    this.setFinalPeriodData(this.query as TrialBalanceQuery);
    this.setAccountStatementOrder(this.orderBy)
  }


  get trialBalanceType(): BalanceExplorerTypes | TrialBalanceTypes {
    return this.query.trialBalanceType;
  }


  get periodsRequired(): boolean {
    return [TrialBalanceTypes.BalanzaValorizadaComparativa]
      .includes(this.trialBalanceType as TrialBalanceTypes);
  }


  onCloseButtonClicked() {
    sendEvent(this.accountStatementFilterEvent, AccountStatementFilterEventType.CLOSE_BUTTON_CLICKED);
  }


  onBuildAccountStatementClicked() {
    const payload = { accountStatementQuery: this.buildAccountStatementQuery() };

    sendEvent(this.accountStatementFilterEvent,
      AccountStatementFilterEventType.BUILD_ACCOUNT_STATEMENT_CLICKED, payload);
  }


  private setInitialPeriodData(query: BalanceExplorerQuery | TrialBalanceQuery) {
    this.formData.initialPeriod.fromDate = this.query.initialPeriod?.fromDate;
    this.formData.initialPeriod.toDate = this.query.initialPeriod?.toDate;

    this.initialPeriodFixedDate = query.initialPeriod.toDate;
  }


  private setFinalPeriodData(query: TrialBalanceQuery) {
    this.formData.finalPeriod.fromDate = query.finalPeriod?.fromDate ?? null;
    this.formData.finalPeriod.toDate = query.finalPeriod?.toDate ?? null;

    this.finalPeriodFixedDate = query.finalPeriod?.toDate ?? null;
  }


  private setAccountStatementOrder(sortOrder: AccountStatementSortOrder) {
    this.formData.sortType = sortOrder.sortType;
    this.formData.orderType = sortOrder.orderType;
  }


  private buildAccountStatementQuery(): AccountStatementQuery {
    const query = { ...{}, ...this.query, ...this.getFormData() };
    const entry = { ...{}, ...this.entry };
    const orderBy = { ...{}, ...this.getSortOrder() };
    return { query, entry, orderBy };
  }


  private getFormData() {
    if (this.periodsRequired) {
      return {
        initialPeriod: this.getInitialPeriod(this.query),
        finalPeriod: this.getFinalPeriod(this.query as TrialBalanceQuery),
      };
    } else {
      return { initialPeriod: this.getInitialPeriod(this.query) };
    }
  }


  private getInitialPeriod(query: BalanceExplorerQuery | TrialBalanceQuery) {
    return Object.assign({}, query.initialPeriod, this.formData.initialPeriod);
  }


  private getFinalPeriod(query: TrialBalanceQuery) {
    return Object.assign({}, query.finalPeriod, this.formData.finalPeriod);
  }


  private getSortOrder(): AccountStatementSortOrder {
    return {
      sortType: this.formData.sortType,
      orderType: this.formData.orderType,
    };
  }

}
