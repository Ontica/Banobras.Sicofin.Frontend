/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { EmptySearchVouchersCommand, EmptyVoucher, mapVoucherDescriptorFromVoucher,
         mapVoucherStageFromViewName, SearchVouchersCommand, Voucher, VoucherDescriptor,
         VouchersOperation } from '@app/models';

import { View } from '../main-layout';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { VouchersDataService } from '@app/data-services';

import { ArrayLibrary } from '@app/shared/utils';

import { VouchersExplorerEventType } from '@app/views/vouchers/vouchers-explorer/vouchers-explorer.component';

import { VouchersImporterEventType } from '@app/views/vouchers/importers/vouchers-importer.component';

import { VoucherCreatorEventType } from '@app/views/vouchers/voucher-creator/voucher-creator.component';

import { VoucherTabbedViewEventType } from '@app/views/vouchers/voucher-tabbed-view/voucher-tabbed-view.component';

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

  constructor(private uiLayer: PresentationLayer,
              private vouchersData: VouchersDataService,
              private messageBox: MessageBoxService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnInit() {
    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.onCurrentViewChanged(x));
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
  }


  onVouchersExplorerEvent(event: EventInfo): void {
    switch (event.type as VouchersExplorerEventType) {

      case VouchersExplorerEventType.FILTER_CHANGED:
        this.applyVoucherFilter(event.payload);
        this.searchVouchers();
        return;

      case VouchersExplorerEventType.FILTER_CLEARED:
        this.applyVoucherFilter(event.payload);
        this.setVoucherListData([]);
        this.setSelectedVoucher(EmptyVoucher);
        return;

      case VouchersExplorerEventType.SELECT_VOUCHER_CLICKED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');
        Assertion.assertValue(event.payload.voucher.id, 'event.payload.voucher.id');
        this.getVoucher(event.payload.voucher.id);
        return;

      case VouchersExplorerEventType.CREATE_VOUCHER_BUTTON_CLICKED:
        this.displayOptionModalSelected = 'VoucherCreator';
        return;

      case VouchersExplorerEventType.IMPORT_VOUCHERS_BUTTON_CLICKED:
        this.displayOptionModalSelected = 'VouchersImporter';
        return;

      case VouchersExplorerEventType.EXECUTE_VOUCHERS_OPERATION_CLICKED:
        Assertion.assertValue(event.payload.vouchers, 'event.payload.vouchers');
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        this.bulkOperationVouchers(event.payload.operation as VouchersOperation, event.payload.vouchers);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onVoucherCreatorEvent(event: EventInfo) {
    switch (event.type as VoucherCreatorEventType) {

      case VoucherCreatorEventType.CLOSE_MODAL_CLICKED:
        this.onOptionModalClosed();
        return;

      case VoucherCreatorEventType.VOUCHER_CREATED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');
        this.insertVoucherToList(event.payload.voucher);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onVoucherTabbedViewEvent(event: EventInfo) {
    switch (event.type as VoucherTabbedViewEventType) {

      case VoucherTabbedViewEventType.CLOSE_BUTTON_CLICKED:
        this.setSelectedVoucher(EmptyVoucher);
        return;

      case VoucherTabbedViewEventType.VOUCHER_UPDATED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');
        this.insertVoucherToList(event.payload.voucher);
        return;

      case VoucherTabbedViewEventType.VOUCHER_DELETED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');
        this.removeVoucherFromList(event.payload.voucher);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onVouchersImporterEvent(event: EventInfo) {
    switch (event.type as VouchersImporterEventType) {

      case VouchersImporterEventType.CLOSE_MODAL_CLICKED:
      case VouchersImporterEventType.VOUCHERS_IMPORTED:
        this.onOptionModalClosed();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private onCurrentViewChanged(newView: View) {
    this.currentView = newView;
    this.applyVoucherFilter(this.filter);
  }


  private applyVoucherFilter(newFilter: SearchVouchersCommand) {
    this.filter =  Object.assign({}, newFilter, { stage: mapVoucherStageFromViewName(this.currentView.name)});
  }


  private searchVouchers() {
    if (!this.filter.accountsChartUID) {
      return;
    }

    this.isLoading = true;

    this.vouchersData.searchVouchers(this.filter)
      .toPromise()
      .then(x => {
        this.setVoucherListData(x);
        this.setSelectedVoucher(EmptyVoucher);
      })
      .finally(() => this.isLoading = false);
  }


  private getVoucher(idVoucher: number) {
    this.isLoadingVoucher = true;

    this.vouchersData.getVoucher(idVoucher)
      .toPromise()
      .then(x => {
        this.setSelectedVoucher(x);
      })
      .finally(() => this.isLoadingVoucher = false);
  }


  private bulkOperationVouchers(operation: VouchersOperation, vouchers: string[]) {
    this.isLoadingVoucher = true;

    this.vouchersData.bulkOperationVouchers(operation, vouchers)
      .toPromise()
      .then(x => {
        this.messageBox.show(x, 'Operación ejecutada');
        this.searchVouchers();
      })
      .finally(() => this.isLoadingVoucher = false);
  }


  private setVoucherListData(voucherList: VoucherDescriptor[]) {
    this.voucherList = voucherList;
    this.searchVouchersCommand = Object.assign({}, this.filter);
  }


  private insertVoucherToList(voucherSelected: Voucher) {
    const voucherToInsert = mapVoucherDescriptorFromVoucher(voucherSelected);
    const voucherListNew = ArrayLibrary.insertItemTop(this.voucherList, voucherToInsert, 'id');
    this.setVoucherListData(voucherListNew);
    this.setSelectedVoucher(voucherSelected);
  }


  private removeVoucherFromList(voucherDeleted: Voucher) {
    const voucherListNew = this.voucherList.filter(x => x.id !== voucherDeleted.id);
    this.setVoucherListData(voucherListNew);
    this.setSelectedVoucher(EmptyVoucher);
  }


  private setSelectedVoucher(voucher: Voucher) {
    this.selectedVoucher = voucher;
    this.displayVoucherTabbedView = this.selectedVoucher && this.selectedVoucher.id > 0;
  }


  private onOptionModalClosed() {
    this.displayOptionModalSelected = null;
  }

}
