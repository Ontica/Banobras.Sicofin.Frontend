/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit,
         Output } from '@angular/core';

import { combineLatest } from 'rxjs';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, DateSearchFieldList, EmptySearchVouchersCommand, SearchVouchersCommand,
         VoucherStage} from '@app/models';

import { AccountChartStateSelector,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { expandCollapse } from '@app/shared/animations/animations';

export enum VoucherFilterEventType {
  SEARCH_VOUCHERS_CLICKED = 'VoucherFilterComponent.Event.SearchVouchersClicked',
  CLEAR_VOUCHERS_CLICKED = 'VoucherFilterComponent.Event.ClearVouchersClicked',
}


@Component({
  selector: 'emp-fa-voucher-filter',
  templateUrl: './voucher-filter.component.html',
  animations: [expandCollapse],
})
export class VoucherFilterComponent implements OnInit, AfterViewChecked, OnDestroy {

  @Input() voucherFilter: SearchVouchersCommand = Object.assign({}, EmptySearchVouchersCommand);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() voucherFilterEvent = new EventEmitter<EventInfo>();

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  accountChartSelected: AccountsChartMasterData = null;

  dateSearchFieldList: Identifiable[] = DateSearchFieldList;

  transactionTypesList: Identifiable[] = [];

  voucherTypesList: Identifiable[] = [];

  isLoading = false;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer, private cdRef: ChangeDetectorRef) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadDataLists();
  }


  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isDateSearchFieldRequired() {
    return !!this.voucherFilter.toDate || !!this.voucherFilter.fromDate;
  }


  get isDateSearchFieldValid() {
    return this.isDateSearchFieldRequired ? !!this.voucherFilter.dateSearchField : true;
  }


  onShowFiltersClicked(){
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onAccountChartChanges(accountChart: AccountsChartMasterData) {
    this.accountChartSelected = accountChart;
    this.validateFieldToClear();
  }


  onClearFilters() {
    this.voucherFilter = Object.assign({}, EmptySearchVouchersCommand,
      { accountsChartUID: this.voucherFilter.accountsChartUID });

    this.sendEvent(VoucherFilterEventType.CLEAR_VOUCHERS_CLICKED, this.getSearchVoucherCommand());
  }


  onSearchVoucherClicked() {
    this.sendEvent(VoucherFilterEventType.SEARCH_VOUCHERS_CLICKED, this.getSearchVoucherCommand());
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
      .filter(x => this.voucherFilter.ledgerUID === x.uid).length > 0 ? this.voucherFilter.ledgerUID : '';
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


  private getSearchVoucherCommand(): SearchVouchersCommand {
    const searchVouchersCommand: SearchVouchersCommand = {
      stage: this.voucherFilter.stage ?? VoucherStage.All,
      accountsChartUID: this.voucherFilter.accountsChartUID ?? '',
      keywords: this.voucherFilter.keywords ?? '',
      ledgersGroupUID: this.voucherFilter.ledgersGroupUID ?? '',
      ledgerUID: this.voucherFilter.ledgerUID ?? '',
      accountKeywords: this.voucherFilter.accountKeywords ?? '',
      subledgerAccountKeywords: this.voucherFilter.subledgerAccountKeywords ?? '',
      dateSearchField: this.voucherFilter.dateSearchField ?? null,
      transactionTypeUID: this.voucherFilter.transactionTypeUID ?? '',
      voucherTypeUID: this.voucherFilter.voucherTypeUID ?? '',
    };

    if (this.voucherFilter.fromDate) {
      searchVouchersCommand.fromDate = this.voucherFilter.fromDate;
    }

    if (this.voucherFilter.toDate) {
      searchVouchersCommand.toDate = this.voucherFilter.toDate;
    }

    return searchVouchersCommand;
  }

}
