/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit,
         Output } from '@angular/core';

import { combineLatest, concat, Observable, of, Subject } from 'rxjs';

import { EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccountsChartMasterData, DateSearchFieldList, EmptySearchVouchersCommand, SearchVouchersCommand,
         VoucherStage, VoucherUserType, VoucherUserTypeList} from '@app/models';

import { AccountChartStateSelector,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { expandCollapse } from '@app/shared/animations/animations';

import { catchError, debounceTime, delay, distinctUntilChanged, filter, switchMap,
         tap } from 'rxjs/operators';

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
  voucherUserTypeList: Identifiable[] = VoucherUserTypeList;
  transactionTypesList: Identifiable[] = [];
  voucherTypesList: Identifiable[] = [];

  accountChartSelected: AccountsChartMasterData = null;
  voucherUserTypeSelected: Identifiable = null;
  voucherUserSelected: Identifiable = null;

  isLoading = false;

  voucherUserList$: Observable<any[]>;
  voucherUserInput$ = new Subject<string>();
  voucherUserLoading = false;
  minTermLength = 5;

  helper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer, private cdRef: ChangeDetectorRef) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit(): void {
    this.loadDataLists();
    this.subscribeVoucherUserList();
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
    this.setDefaultFieldsSelected();

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

    this.voucherUserSelected = null;
    this.voucherUserTypeSelected = this.voucherUserTypeList.length > 0 ? this.voucherUserTypeList[0] : null;
  }


  private subscribeVoucherUserList() {
    this.voucherUserList$ = concat(
      of(this.voucherUserSelected ? [this.voucherUserSelected] : []),
      this.voucherUserInput$.pipe(
          filter(keyword => keyword !== null && keyword.length >= this.minTermLength),
          distinctUntilChanged(),
          debounceTime(800),
          tap(() => this.voucherUserLoading = true),
          switchMap(keyword =>
            of([{uid: 'sasa', name: 'María Luisa de Jesus Jiménez Montanero'}]).pipe(
              delay(2000),
              catchError(() => of([])),
              tap(() => this.voucherUserLoading = false)
          ))
      )
    );
  }


  private buildVoucherUserFilter(keywords: string): any {
    const ledgerAccountFilter: any = { keywords };

    return ledgerAccountFilter;
  }


  private getSearchVoucherCommand(): SearchVouchersCommand {
    const command: SearchVouchersCommand = {
      stage: this.voucherFilter.stage ?? VoucherStage.All,
      accountsChartUID: this.voucherFilter.accountsChartUID ?? '',
      keywords: this.voucherFilter.keywords ?? '',
      number: this.voucherFilter.number ?? '',
      concept: this.voucherFilter.concept ?? '',
      ledgersGroupUID: this.voucherFilter.ledgersGroupUID ?? '',
      ledgerUID: this.voucherFilter.ledgerUID ?? '',
      accountKeywords: this.voucherFilter.accountKeywords ?? '',
      subledgerAccountKeywords: this.voucherFilter.subledgerAccountKeywords ?? '',
      dateSearchField: this.voucherFilter.dateSearchField ?? null,
      transactionTypeUID: this.voucherFilter.transactionTypeUID ?? '',
      voucherTypeUID: this.voucherFilter.voucherTypeUID ?? '',
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

    if (this.voucherUserTypeSelected.uid === VoucherUserType.ElaboratedBy && this.voucherUserSelected?.uid) {
      command.elaboratedByUID = this.voucherUserSelected.uid;
    }

    if (this.voucherUserTypeSelected.uid === VoucherUserType.AuthorizedBy && this.voucherUserSelected?.uid) {
      command.authorizedByUID = this.voucherUserSelected.uid;
    }

    if (this.voucherUserTypeSelected.uid === VoucherUserType.PostedBy && this.voucherUserSelected?.uid) {
      command.postedByUID = this.voucherUserSelected.uid;
    }
  }


  private sendEvent(eventType: VoucherFilterEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.voucherFilterEvent.emit(event);
  }

}
