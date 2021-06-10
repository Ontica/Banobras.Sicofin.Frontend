/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { combineLatest } from 'rxjs';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, DateSearchFieldList, EmptySearchVouchersCommand,
         SearchVouchersCommand } from '@app/models';

import { AccountChartStateSelector, VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { expandCollapse } from '@app/shared/animations/animations';

export enum VoucherFilterEventType {
  SEARCH_VOUCHER_CLICKED = 'VoucherFilterComponent.Event.SearchVoucherClicked',
}


@Component({
  selector: 'emp-fa-voucher-filter',
  templateUrl: './voucher-filter.component.html',
  animations: [expandCollapse],
})
export class VoucherFilterComponent implements OnInit, OnDestroy {

  @Input() voucherFilter: SearchVouchersCommand = Object.assign({}, EmptySearchVouchersCommand);

  @Output() voucherFilterEvent = new EventEmitter<EventInfo>();

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  accountChartSelected: AccountsChartMasterData = null;

  dateSearchFieldList: Identifiable[] = DateSearchFieldList;

  transactionTypesList: Identifiable[] = [];

  voucherTypesList: Identifiable[] = [];

  isLoading = false;

  showFilters = false;

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


  onAccountChartChanges(accountChart: AccountsChartMasterData) {
    this.accountChartSelected = accountChart;
    this.validateFieldToClear();
  }


  onClearFilters() {
    this.voucherFilter = Object.assign({}, EmptySearchVouchersCommand,
      {
        accountsChartUID: this.voucherFilter.accountsChartUID,
        keywords: this.voucherFilter.keywords,
        ledgersGroupUID: this.voucherFilter.ledgersGroupUID,
        ledgerUID: this.voucherFilter.ledgerUID,
      });
  }


  onSearchVoucherClicked() {
    this.sendEvent(VoucherFilterEventType.SEARCH_VOUCHER_CLICKED, this.voucherFilter);
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<AccountsChartMasterData[]>
        (AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.TRANSACTION_TYPES_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.VOUCHER_TYPES_LIST)
    ])
    .subscribe(([x, y, z]) => {
      this.accountsChartMasterDataList = x;
      this.transactionTypesList = y;
      this.voucherTypesList = z;

      this.setDefaultAccountChartSelected();
      this.isLoading = false;
    });
  }


  private validateFieldToClear() {

    this.voucherFilter.ledgerUID = this.accountChartSelected.ledgers
      .filter(x => this.voucherFilter.ledgerUID === x.uID).length > 0 ? this.voucherFilter.ledgerUID : '';

  }


  private setDefaultAccountChartSelected() {
    this.accountChartSelected = this.accountsChartMasterDataList[0];
  }


  private sendEvent(eventType: VoucherFilterEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.voucherFilterEvent.emit(event);
  }

}
