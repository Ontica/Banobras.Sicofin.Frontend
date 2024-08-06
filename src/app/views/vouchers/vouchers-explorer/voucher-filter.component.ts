/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { combineLatest } from 'rxjs';

import { EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountChartStateSelector,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { expandCollapse } from '@app/shared/animations/animations';

import { sendEvent } from '@app/shared/utils';

import { SearcherAPIS } from '@app/data-services';

import { AccountsChartMasterData, VouchersQuery, VoucherStage, EditorTypeList, EmptyVouchersQuery,
         VoucherFilterData, EmptyVoucherFilterData } from '@app/models';


export enum VoucherFilterEventType {
  SEARCH_VOUCHERS_CLICKED = 'VoucherFilterComponent.Event.SearchVouchersClicked',
  CLEAR_VOUCHERS_CLICKED = 'VoucherFilterComponent.Event.ClearVouchersClicked',
}


@Component({
  selector: 'emp-fa-voucher-filter',
  templateUrl: './voucher-filter.component.html',
  animations: [expandCollapse],
})
export class VoucherFilterComponent implements OnChanges, OnInit, OnDestroy {

  @Input() displayStatus = false;

  @Input() voucherFilterData: VoucherFilterData = Object.assign({}, EmptyVoucherFilterData);

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() voucherFilterEvent = new EventEmitter<EventInfo>();

  accountsChartMasterDataList: AccountsChartMasterData[] = [];

  voucherStatusList: Identifiable[] = [];
  voucherTypesList: Identifiable[] = [];
  transactionTypesList: Identifiable[] = [];
  editorTypeList: Identifiable[] = EditorTypeList;

  vouchersEditorsAPI = SearcherAPIS.vouchersEditors;

  filter: VouchersQuery = Object.assign({}, EmptyVouchersQuery);
  selectedAccountChart: AccountsChartMasterData = null;
  selectedEditor: Identifiable = null;

  isLoading = false;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucherFilterData) {
      this.filter = Object.assign({}, this.voucherFilterData.query);
      this.selectedAccountChart = this.voucherFilterData.accountChart ?? null;
      this.selectedEditor = this.voucherFilterData.editor ?? null;
    }
  }


  ngOnInit() {
    this.loadDataLists();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onShowFiltersClicked(){
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
  }


  onAccountChartChanges(accountChart: AccountsChartMasterData) {
    this.selectedAccountChart = accountChart;
    this.validateFieldToClear();
  }


  onEditorChanges(editor: Identifiable) {
    this.selectedEditor = editor;
  }


  onClearFilters() {
    this.setAndEmitDefaultFilter();
  }


  onSearchVoucherClicked() {
    sendEvent(this.voucherFilterEvent, VoucherFilterEventType.SEARCH_VOUCHERS_CLICKED,
      this.getVoucherFilterData());
  }


  private loadDataLists() {
    this.isLoading = true;

    combineLatest([
      this.helper.select<AccountsChartMasterData[]>
        (AccountChartStateSelector.ACCOUNTS_CHARTS_MASTER_DATA_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.TRANSACTION_TYPES_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.VOUCHER_TYPES_LIST),
      this.helper.select<Identifiable[]>(VoucherStateSelector.VOUCHER_STATUS_LIST),
    ])
    .subscribe(([a, b, c, d]) => {
      this.accountsChartMasterDataList = a;
      this.transactionTypesList = b;
      this.voucherTypesList = c;
      this.voucherStatusList = d;

      this.validateEmitFirstFilter();
      this.isLoading = false;
    });
  }


  private validateFieldToClear() {
    this.filter.ledgerUID = this.selectedAccountChart?.ledgers
      .filter(x => this.filter.ledgerUID === x.uid).length > 0 ? this.filter.ledgerUID : '';
  }


  private validateEmitFirstFilter() {
    if (!this.filter.accountsChartUID) {
      this.setAndEmitDefaultFilter();
    }
  }


  private setAndEmitDefaultFilter() {
    this.setDefaultFieldsSelected();

    this.filter = Object.assign({}, EmptyVouchersQuery,
      { accountsChartUID: this.filter.accountsChartUID });

    sendEvent(this.voucherFilterEvent, VoucherFilterEventType.CLEAR_VOUCHERS_CLICKED,
      this.getVoucherFilterData());
  }


  private setDefaultFieldsSelected() {
    this.selectedAccountChart = this.accountsChartMasterDataList[0] ?? null;
    this.selectedEditor = null;
    this.filter.accountsChartUID = this.selectedAccountChart?.uid ?? '';
    this.filter.editorUID = '';
  }



  private getVoucherFilterData(): VoucherFilterData {
    const payload: VoucherFilterData = {
      query: this.getVouchersQuery(),
      accountChart: this.selectedAccountChart,
      editor: this.selectedEditor,
    };

    return payload;
  }


  private getVouchersQuery(): VouchersQuery {
    const query: VouchersQuery = {
      stage: this.filter.stage ?? VoucherStage.All,
      accountsChartUID: this.filter.accountsChartUID ?? '',
      ledgerUID: this.filter.ledgerUID ?? '',
      keywords: this.filter.keywords ?? '',
      voucherTypeUID: this.filter.voucherTypeUID ?? '',
      vouchersNumbers: this.filter.vouchersNumbers ?? [],
      concept: this.filter.concept ?? '',
      vouchersID: this.filter.vouchersID ?? [],
      accounts: this.filter.accounts ?? [],
      subledgerAccounts: this.filter.subledgerAccounts ?? [],
      verificationNumbers: this.filter.verificationNumbers ?? [],
      transactionTypeUID: this.filter.transactionTypeUID ?? '',
      editorType: this.filter.editorType ?? null,
      editorUID: this.filter.editorUID ?? '',
    };

    this.validateVouchersQueryFieldsNoRequired(query);

    return query;
  }


  private validateVouchersQueryFieldsNoRequired(query: VouchersQuery) {
    if (this.displayStatus && this.filter.status) {
      query.status = this.filter.status;
    }

    if (this.filter.fromRecordingDate) {
      query.fromRecordingDate = this.filter.fromRecordingDate;
    }

    if (this.filter.toRecordingDate) {
      query.toRecordingDate = this.filter.toRecordingDate;
    }

    if (this.filter.fromAccountingDate) {
      query.fromAccountingDate = this.filter.fromAccountingDate;
    }

    if (this.filter.toAccountingDate) {
      query.toAccountingDate = this.filter.toAccountingDate;
    }
  }

}
