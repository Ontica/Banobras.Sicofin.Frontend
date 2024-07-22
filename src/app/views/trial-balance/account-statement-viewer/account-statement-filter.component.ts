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
         TrialBalanceQuery, TrialBalanceEntry, TrialBalanceTypes, AccountStatementOrderList,
         DefaultAccountStatementOrder,
         AccountStatementOrder} from '@app/models';

export enum AccountStatementFilterEventType {
  BUILD_ACCOUNT_STATEMENT_CLICKED = 'AccountStatementFilterComponent.Event.BuildAccountStatementClicked',
}

@Component({
  selector: 'emp-fa-account-statement-filter',
  templateUrl: './account-statement-filter.component.html',
})
export class AccountStatementFilterComponent implements OnChanges {

  @Input() entry: BalanceExplorerEntry | TrialBalanceEntry;

  @Input() query: BalanceExplorerQuery | TrialBalanceQuery;

  @Input() orderBy: AccountStatementOrder = DefaultAccountStatementOrder.uid;

  @Output() accountStatementFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    initialPeriod: {fromDate: null, toDate: null},
    finalPeriod: {fromDate: null, toDate: null},
    accountStatementOrder: DefaultAccountStatementOrder.uid,
  };

  initialPeriodFixedDate = null;

  finalPeriodFixedDate = null;

  accountStatementOrderList = AccountStatementOrderList;


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


  private setAccountStatementOrder(order: AccountStatementOrder) {
    this.formData.accountStatementOrder = order;
  }


  private buildAccountStatementQuery(): AccountStatementQuery {
    const formData = this.getFormData();

    const query = Object.assign({}, this.query, formData);

    const data: AccountStatementQuery = Object.assign({},
      { query, entry: this.entry, orderBy: this.formData.accountStatementOrder });

    return data;
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

}
