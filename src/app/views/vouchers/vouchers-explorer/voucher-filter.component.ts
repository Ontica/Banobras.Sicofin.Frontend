/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit,
         Output } from '@angular/core';

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

import { AccountsChartMasterData, DateSearchFieldList, EmptySearchVouchersCommand, SearchVouchersCommand,
         VoucherStage, EditorTypeList} from '@app/models';


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
  dateSearchFieldList: Identifiable[] = DateSearchFieldList;
  editorTypeList: Identifiable[] = EditorTypeList;
  transactionTypesList: Identifiable[] = [];
  voucherTypesList: Identifiable[] = [];

  accountChartSelected: AccountsChartMasterData = null;
  editorSelected: Identifiable = null;

  isLoading = false;

  editorList$: Observable<any[]>;
  editorInput$ = new Subject<string>();
  editorLoading = false;
  minTermLength = 4;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private vouchersData: VouchersDataService,
              private cdRef: ChangeDetectorRef) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadDataLists();
    this.subscribeEditorList();
  }


  ngAfterViewChecked() {
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
    this.setDefaultFieldsSelected();

    this.voucherFilter = Object.assign({}, EmptySearchVouchersCommand,
      { accountsChartUID: this.voucherFilter.accountsChartUID });

    sendEvent(this.voucherFilterEvent, VoucherFilterEventType.CLEAR_VOUCHERS_CLICKED,
      this.getSearchVoucherCommand());
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

      this.setDefaultFieldsSelected();
      this.isLoading = false;
    });
  }


  private validateFieldToClear() {
    this.voucherFilter.ledgerUID = this.accountChartSelected.ledgers
      .filter(x => this.voucherFilter.ledgerUID === x.uid).length > 0 ? this.voucherFilter.ledgerUID : '';
  }


  private setDefaultFieldsSelected() {
    this.accountChartSelected = this.accountsChartMasterDataList[0];
    this.editorSelected = null;
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


  private getSearchVoucherCommand(): SearchVouchersCommand {
    const command: SearchVouchersCommand = {
      stage: this.voucherFilter.stage ?? VoucherStage.All,
      accountsChartUID: this.voucherFilter.accountsChartUID ?? '',
      keywords: this.voucherFilter.keywords ?? '',
      number: this.voucherFilter.number ?? '',
      concept: this.voucherFilter.concept ?? '',
      ledgerUID: this.voucherFilter.ledgerUID ?? '',
      accountKeywords: this.voucherFilter.accountKeywords ?? '',
      subledgerAccountKeywords: this.voucherFilter.subledgerAccountKeywords ?? '',
      dateSearchField: this.voucherFilter.dateSearchField ?? null,
      transactionTypeUID: this.voucherFilter.transactionTypeUID ?? '',
      voucherTypeUID: this.voucherFilter.voucherTypeUID ?? '',
      editorType: this.voucherFilter.editorType ?? null,
      editorUID: this.voucherFilter.editorUID ?? '',
    };

    this.validateSearchVoucherCommandFieldsNoRequired(command);

    return command;
  }


  private validateSearchVoucherCommandFieldsNoRequired(command: SearchVouchersCommand) {
    if (this.voucherFilter.fromDate) {
      command.fromDate = this.voucherFilter.fromDate;
    }

    if (this.voucherFilter.toDate) {
      command.toDate = this.voucherFilter.toDate;
    }
  }

}
