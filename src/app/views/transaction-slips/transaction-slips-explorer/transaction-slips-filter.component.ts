/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { DateStringLibrary, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountChartStateSelector, VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { sendEvent } from '@app/shared/utils';

import { AccountsChartMasterData, DateSearchField, DateSearchFieldList, SearchTransactionSlipsCommand,
         TransactionSlipStatus, TransactionSlipStatusList } from '@app/models';
import { combineLatest } from 'rxjs';

export enum TransactionSlipsFilterEventType {
  SEARCH_TRANSACTION_SLIPS_CLICKED = 'TransactionSlipsFilterComponent.Event.SearchTransactionSlipsClicked',
}

@Component({
  selector: 'emp-fa-transaction-slips-filter',
  templateUrl: './transaction-slips-filter.component.html',
})
export class TransactionSlipsFilterComponent implements OnInit, OnDestroy {

  @Output() transactionSlipsFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    accountsChartUID: '',
    systemUID: '',
    fromDate: DateStringLibrary.today(),
    toDate: DateStringLibrary.today(),
    dateSearchField: DateSearchField.AccountingDate,
    status: TransactionSlipStatus.Pending,
    substatus: null,
  };

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  transactionalSystemsList: Identifiable[] = [];

  dateSearchFieldList: Identifiable[] = DateSearchFieldList;

  statusList: Identifiable[] = TransactionSlipStatusList;

  accountChartSelected: AccountsChartMasterData = null;

  statusSelected: Identifiable = null;

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get periodFieldsValid() {
    return !!this.formData.toDate && !!this.formData.fromDate && !!this.formData.dateSearchField;
  }


  onAccountChartChanges(accountChart: AccountsChartMasterData) {
    this.accountChartSelected = accountChart;
  }


  onSearchTransactionSlipsClicked() {
    sendEvent(this.transactionSlipsFilterEvent,
      TransactionSlipsFilterEventType.SEARCH_TRANSACTION_SLIPS_CLICKED,
      {command: this.getTransactionSlipsCommand()});
  }


  onStatusChanges(transactionSlipStatus: Identifiable) {
    this.statusSelected = transactionSlipStatus;
    this.formData.substatus = '';
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<AccountsChartMasterData[]>
        (AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.TRANSACTIONAL_SYSTEMS_LIST),
    ])
    .subscribe(([x, y]) => {
      this.accountsChartMasterDataList = x;
      this.transactionalSystemsList = y;
      this.setDefaultAccountsChartUID();
      this.isLoading = false;
    });
  }


  private setDefaultAccountsChartUID() {
    const accountChartDefault = this.accountsChartMasterDataList.length > 0 ?
      this.accountsChartMasterDataList[0] : null;
    this.formData.accountsChartUID = accountChartDefault?.uid;
  }


  private getTransactionSlipsCommand(): SearchTransactionSlipsCommand {
    const command: SearchTransactionSlipsCommand = {
      accountsChartUID: this.formData.accountsChartUID ?? '',
      systemUID: this.formData.systemUID ?? '',
      fromDate: this.formData.fromDate ?? '',
      toDate: this.formData.toDate ?? '',
      dateSearchField: this.formData.dateSearchField ?? null,
      status: this.formData.status ?? null,
    };

    return command;
  }

}
