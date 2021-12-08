/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

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

import { AccountsChartMasterData, DateSearchFieldList, SearchVouchersCommand,
         VoucherStage, EditorTypeList, EmptySearchVouchersCommand } from '@app/models';


export enum VoucherFilterEventType {
  SEARCH_VOUCHERS_CLICKED = 'VoucherFilterComponent.Event.SearchVouchersClicked',
  CLEAR_VOUCHERS_CLICKED = 'VoucherFilterComponent.Event.ClearVouchersClicked',
}


@Component({
  selector: 'emp-fa-voucher-filter',
  templateUrl: './voucher-filter.component.html',
  animations: [expandCollapse],
})
export class VoucherFilterComponent implements OnInit, OnDestroy {

  @Input() showFilters = false;

  @Output() showFiltersChange = new EventEmitter<boolean>();

  @Output() voucherFilterEvent = new EventEmitter<EventInfo>();

  filter: SearchVouchersCommand = Object.assign({}, EmptySearchVouchersCommand);

  accountsChartMasterDataList: AccountsChartMasterData[] = [];
  dateSearchFieldList: Identifiable[] = DateSearchFieldList;
  editorTypeList: Identifiable[] = EditorTypeList;
  transactionTypesList: Identifiable[] = [];
  voucherTypesList: Identifiable[] = [];

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


  ngOnInit(): void {
    this.loadDataLists();
    this.subscribeEditorList();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isDateSearchFieldRequired() {
    return !!this.filter.toDate || !!this.filter.fromDate;
  }


  get isDateSearchFieldValid() {
    return this.isDateSearchFieldRequired ? !!this.filter.dateSearchField : true;
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
      this.getSearchVoucherCommand());
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

      this.setAndEmitDefaultFilter();
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
    this.filter.ledgerUID = this.accountChartSelected.ledgers
      .filter(x => this.filter.ledgerUID === x.uid).length > 0 ? this.filter.ledgerUID : '';
  }


  private setAndEmitDefaultFilter() {
    this.setDefaultFieldsSelected();

    this.filter = Object.assign({}, EmptySearchVouchersCommand,
      { accountsChartUID: this.filter.accountsChartUID });

    sendEvent(this.voucherFilterEvent, VoucherFilterEventType.CLEAR_VOUCHERS_CLICKED,
      this.getSearchVoucherCommand());
  }


  private setDefaultFieldsSelected() {
    this.accountChartSelected = this.accountsChartMasterDataList[0] ?? null;
    this.editorSelected = null;
    this.filter.accountsChartUID = this.accountChartSelected?.uid ?? '';
    this.filter.editorUID = '';
  }


  private getSearchVoucherCommand(): SearchVouchersCommand {
    const command: SearchVouchersCommand = {
      stage: this.filter.stage ?? VoucherStage.All,
      accountsChartUID: this.filter.accountsChartUID ?? '',
      keywords: this.filter.keywords ?? '',
      number: this.filter.number ?? '',
      concept: this.filter.concept ?? '',
      ledgerUID: this.filter.ledgerUID ?? '',
      accountKeywords: this.filter.accountKeywords ?? '',
      subledgerAccountKeywords: this.filter.subledgerAccountKeywords ?? '',
      dateSearchField: this.filter.dateSearchField ?? null,
      transactionTypeUID: this.filter.transactionTypeUID ?? '',
      voucherTypeUID: this.filter.voucherTypeUID ?? '',
      editorType: this.filter.editorType ?? null,
      editorUID: this.filter.editorUID ?? '',
    };

    this.validateSearchVoucherCommandFieldsNoRequired(command);

    return command;
  }


  private validateSearchVoucherCommandFieldsNoRequired(command: SearchVouchersCommand) {
    if (this.filter.fromDate) {
      command.fromDate = this.filter.fromDate;
    }

    if (this.filter.toDate) {
      command.toDate = this.filter.toDate;
    }
  }

}
