/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { AccountStatementQuery, BalancesQuery, BalanceEntry, BalanceTypes, TrialBalanceQuery,
         TrialBalanceEntry, TrialBalanceTypes } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum AccountStatementFilterEventType {
  BUILD_ACCOUNT_STATEMENT_CLICKED = 'AccountStatementFilterComponent.Event.BuildAccountStatementClicked',
}

@Component({
  selector: 'emp-fa-account-statement-filter',
  templateUrl: './account-statement-filter.component.html',
})
export class AccountStatementFilterComponent implements OnChanges {

  @Input() entry: BalanceEntry | TrialBalanceEntry;

  @Input() query: BalancesQuery | TrialBalanceQuery;

  @Output() accountStatementFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    initialPeriod: {fromDate: null, toDate: null},
    finalPeriod: {fromDate: null, toDate: null},
  };

  initialPeriodFixedDate = null;

  finalPeriodFixedDate = null;


  ngOnChanges() {
    this.setInitialPeriodData(this.query);
    this.setFinalPeriodData(this.query as TrialBalanceQuery);
  }


  get trialBalanceType(): BalanceTypes | TrialBalanceTypes {
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


  private setInitialPeriodData(query: BalancesQuery | TrialBalanceQuery) {
    this.formData.initialPeriod.fromDate = this.query.initialPeriod?.fromDate;
    this.formData.initialPeriod.toDate = this.query.initialPeriod?.toDate;

    this.initialPeriodFixedDate = query.initialPeriod.toDate;
  }


  private setFinalPeriodData(query: TrialBalanceQuery) {
    this.formData.finalPeriod.fromDate = query.finalPeriod?.fromDate ?? null;
    this.formData.finalPeriod.toDate = query.finalPeriod?.toDate ?? null;

    this.finalPeriodFixedDate = query.finalPeriod?.toDate ?? null;
  }


  private buildAccountStatementQuery(): AccountStatementQuery {
    const formData = this.getFormData();

    const query = Object.assign({}, this.query, formData);

    const data: AccountStatementQuery = Object.assign({}, { query, entry: this.entry });

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


  private getInitialPeriod(query: BalancesQuery | TrialBalanceQuery) {
    return Object.assign({}, query.initialPeriod, this.formData.initialPeriod);
  }


  private getFinalPeriod(query: TrialBalanceQuery) {
    return Object.assign({}, query.finalPeriod, this.formData.finalPeriod);
  }

}
