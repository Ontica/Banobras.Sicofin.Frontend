/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { combineLatest, concat, Observable, of, Subject } from 'rxjs';

import { catchError, debounceTime, delay, distinctUntilChanged, filter, switchMap,
         tap } from 'rxjs/operators';

import { EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountChartStateSelector,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { expandCollapse } from '@app/shared/animations/animations';

import { sendEvent } from '@app/shared/utils';

import { VouchersDataService } from '@app/data-services';

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

  filter: VouchersQuery = Object.assign({}, EmptyVouchersQuery);
  accountChartSelected: AccountsChartMasterData = null;
  editorSelected: Identifiable = null;

  isLoading = false;

  editorList$: Observable<Identifiable[]>;
  editorInput$ = new Subject<string>();
  editorLoading = false;
  minTermLength = 4;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private vouchersData: VouchersDataService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucherFilterData) {
      this.filter = Object.assign({}, this.voucherFilterData.query);
      this.accountChartSelected = this.voucherFilterData.accountChart ?? null;
      this.editorSelected = this.voucherFilterData.editor ?? null;
    }
  }


  ngOnInit() {
    this.loadDataLists();
    this.subscribeEditorList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onShowFiltersClicked(){
    this.showFilters = !this.showFilters;
    this.showFiltersChange.emit(this.showFilters);
    this.subscribeEditorList();
  }


  onAccountChartChanges(accountChart: AccountsChartMasterData) {
    this.accountChartSelected = accountChart;
    this.validateFieldToClear();
  }


  onEditorChanges(editor: Identifiable) {
    this.editorSelected = editor;
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


  private subscribeEditorList() {
    this.editorList$ = concat(
      of(isEmpty(this.editorSelected) ? [] : [this.editorSelected]),
      this.editorInput$.pipe(
        filter(keyword => keyword !== null && keyword.length >= this.minTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.editorLoading = true),
        switchMap(keyword =>
          this.vouchersData.searchEditors(keyword)
          .pipe(
            delay(2000),
            catchError(() => of([])),
            tap(() => this.editorLoading = false)
        ))
      )
    );
  }


  private validateFieldToClear() {
    this.filter.ledgerUID = this.accountChartSelected?.ledgers
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
    this.accountChartSelected = this.accountsChartMasterDataList[0] ?? null;
    this.editorSelected = null;
    this.filter.accountsChartUID = this.accountChartSelected?.uid ?? '';
    this.filter.editorUID = '';
  }


  private getVoucherFilterData(): VoucherFilterData {
    const payload: VoucherFilterData = {
      query: this.getVouchersQuery(),
      accountChart: this.accountChartSelected,
      editor: this.editorSelected,
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
      number: this.filter.number ?? '',
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
