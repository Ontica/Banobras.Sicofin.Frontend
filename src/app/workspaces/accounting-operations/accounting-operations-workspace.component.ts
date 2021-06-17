/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector, VoucherAction,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { EmptySearchVouchersCommand, EmptyVoucher, mapVoucherStageFromViewName,
        SearchVouchersCommand, Voucher, VoucherDescriptor} from '@app/models';

import { View } from '../main-layout';

import { VouchersDataService } from '@app/data-services';

import { VouchersExplorerEventType } from '@app/views/vouchers/vouchers-explorer/vouchers-explorer.component';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

type AccountingOperationModalOptions = 'VoucherCreator' | 'VouchersImporter';


@Component({
  selector: 'emp-fa-accounting-operations-workspace',
  templateUrl: './accounting-operations-workspace.component.html'
})
export class AccountingOperationsWorkspaceComponent implements OnInit, OnDestroy {

  currentView: View;

  voucherList: VoucherDescriptor[] = [];
  filter: SearchVouchersCommand = Object.assign({}, EmptySearchVouchersCommand);
  searchVouchersCommand: SearchVouchersCommand = Object.assign({}, EmptySearchVouchersCommand);

  selectedVoucher: Voucher = EmptyVoucher;

  displayVoucherTabbedView = false;
  displayOptionModalSelected: AccountingOperationModalOptions = null;

  isLoading = false;
  isLoadingVoucher = false;

  subscriptionHelper: SubscriptionHelper;

  displayExportModal = false;
  excelFileUrl = '';

  constructor(private uiLayer: PresentationLayer,
              private vouchersData: VouchersDataService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {

    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.onCurrentViewChanged(x));

    this.subscriptionHelper.select<SearchVouchersCommand>(VoucherStateSelector.LIST_FILTER)
      .subscribe(x => {
        this.filter = x;
      });

  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  onVouchersExplorerEvent(event: EventInfo): void {

    switch (event.type as VouchersExplorerEventType) {

      case VouchersExplorerEventType.FILTER_CHANGED:
        this.applyVoucherFilter(event.payload);
        this.searchVouchers();
        this.excelFileUrl = '';
        return;

      case VouchersExplorerEventType.EXPORT_VOUCHERS:
        this.displayExportModal = true;

        return;

      case VouchersExplorerEventType.SELECT_VOUCHER:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');
        Assertion.assertValue(event.payload.voucher.id, 'event.payload.voucher.id');

        this.getVoucher(event.payload.voucher.id);

        return;

      case VouchersExplorerEventType.CREATE_VOUCHER:
        this.displayOptionModalSelected = 'VoucherCreator';
        return;

      case VouchersExplorerEventType.IMPORT_VOUCHERS:
        console.log('IMPORT_VOUCHERS');
        // TODO: open the voucher importer
        // this.displayOptionModalSelected = 'VouchersImporter';
        return;

      case VouchersExplorerEventType.SELECT_VOUCHERS_OPTION:
        Assertion.assertValue(event.payload.vouchers, 'event.payload.vouchers');
        console.log('SELECT_VOUCHERS_OPTION', event.payload.vouchers);
        // TODO: validate the option and open the corresponding editor

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event) {
    switch (event.type as ExportReportModalEventType) {

      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.displayExportModal = false;
        return;

      case ExportReportModalEventType.EXPORT_EXCEL_CLICKED:
        if (!this.searchVouchersCommand.accountsChartUID ) {
          return;
        }

        this.exportVouchersToExcel();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOptionModalClosed() {
    this.displayOptionModalSelected = null;
  }


  onCloseVoucherTabbedView() {
    this.selectedVoucher = EmptyVoucher;
    this.displayVoucherTabbedView = false;
  }


  private onCurrentViewChanged(newView: View) {
    this.currentView = newView;

    const currentFilter =
      this.uiLayer.selectValue<SearchVouchersCommand>(VoucherStateSelector.LIST_FILTER);

    this.applyVoucherFilter(currentFilter);
  }


  private applyVoucherFilter(newFilter: SearchVouchersCommand) {
    const filter: SearchVouchersCommand =
      Object.assign({}, newFilter, { stage: mapVoucherStageFromViewName(this.currentView.name)});

    this.uiLayer.dispatch(VoucherAction.SET_LIST_FILTER, { filter });
  }


  private searchVouchers() {
    if (!this.filter.accountsChartUID) {
      return;
    }

    this.isLoading = true;

    this.vouchersData.searchVouchers(this.filter)
      .toPromise()
      .then(x => {
        this.searchVouchersCommand = Object.assign({}, this.filter);
        this.voucherList = x;
      })
      .finally(() => this.isLoading = false);
  }


  private exportVouchersToExcel() {
    console.log('EXPORT_VOUCHERS', this.searchVouchersCommand);

    setTimeout(() => {
      this.excelFileUrl = 'data-dummy';
    }, 1000);
  }


  private getVoucher(idVoucher: number) {
    this.isLoadingVoucher = true;

    this.vouchersData.getVoucher(idVoucher)
      .toPromise()
      .then(x => {
        this.selectedVoucher = x;
        this.displayVoucherTabbedView = this.selectedVoucher && this.selectedVoucher.id > 0;
      })
      .finally(() => this.isLoadingVoucher = false);
  }

}
