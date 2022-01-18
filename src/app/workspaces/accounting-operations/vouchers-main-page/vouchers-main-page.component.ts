/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo, StringLibrary } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { EmptySearchVouchersCommand, EmptyVoucher, mapVoucherDescriptorFromVoucher,
         mapVoucherStageFromViewName, SearchVouchersCommand, Voucher, VoucherDescriptor,
         VouchersOperationCommand, VouchersOperationResult, VouchersOperationType} from '@app/models';

import { View } from '@app/workspaces/main-layout';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { VouchersDataService } from '@app/data-services';

import { ArrayLibrary } from '@app/shared/utils';

import { ExportReportModalEventType } from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

import { VouchersExplorerEventType } from '@app/views/vouchers/vouchers-explorer/vouchers-explorer.component';

import { VouchersImporterEventType } from '@app/views/vouchers/vouchers-importer/vouchers-importer.component';

import { VoucherCreatorEventType } from '@app/views/vouchers/voucher-creator/voucher-creator.component';

import { VoucherTabbedViewEventType } from '@app/views/vouchers/voucher-tabbed-view/voucher-tabbed-view.component';

type VouchersMainPageModalOptions = 'VoucherCreator' | 'VouchersImporter';


@Component({
  selector: 'emp-fa-vouchers-main-page',
  templateUrl: './vouchers-main-page.component.html'
})
export class VouchersMainPageComponent implements OnInit, OnDestroy {

  currentView: View;

  searchVouchersCommand: SearchVouchersCommand = Object.assign({}, EmptySearchVouchersCommand);

  voucherList: VoucherDescriptor[] = [];

  selectedVoucher: Voucher = EmptyVoucher;

  displayVoucherTabbedView = false;

  displayOptionModalSelected: VouchersMainPageModalOptions = null;

  displayExportModal = false;

  excelFileUrl = '';

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
        Assertion.assertValue(event.payload.operation, 'event.payload.operation');
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        Assertion.assertValue(event.payload.command.vouchers, 'event.payload.command.vouchers');
        this.bulkOperationVouchers(event.payload.operation as VouchersOperationType,
                                   event.payload.command);
        return;

      case VouchersExplorerEventType.EXPORT_VOUCHERS_BUTTON_CLICKED:
        this.setDisplayExportModal(true);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event) {
    switch (event.type as ExportReportModalEventType) {

      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;

      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
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
        this.onOptionModalClosed();
        return;

      case VouchersImporterEventType.VOUCHERS_IMPORTED:
        this.onOptionModalClosed();
        this.refreshVouchers();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private onCurrentViewChanged(newView: View) {
    this.currentView = newView;
    this.applyVoucherFilter(this.searchVouchersCommand);
  }


  private applyVoucherFilter(newFilter: SearchVouchersCommand) {
    this.searchVouchersCommand =  Object.assign({}, newFilter,
      {stage: mapVoucherStageFromViewName(this.currentView.name)});
  }


  private refreshVouchers() {
    this.searchVouchers();
  }


  private searchVouchers() {
    if (!this.searchVouchersCommand.accountsChartUID) {
      return;
    }

    this.isLoading = true;

    this.vouchersData.searchVouchers(this.searchVouchersCommand)
      .toPromise()
      .then(x => {
        this.setVoucherListData(x);
        this.setSelectedVoucher(EmptyVoucher);
      })
      .finally(() => this.isLoading = false);
  }


  private exportVouchersToExcel() {
    setTimeout(() => {
      this.excelFileUrl = 'data-dummy';
      this.messageBox.showInDevelopment('Exportar pólizas',
        {type: 'EXPORT_VOUCHERS', command: this.searchVouchersCommand});
    }, 500);
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


  private bulkOperationVouchers(operation: VouchersOperationType, command: VouchersOperationCommand) {
    this.isLoadingVoucher = true;

    this.vouchersData.bulkOperationVouchers(operation, command)
      .toPromise()
      .then(x => {
        if (operation === VouchersOperationType.print) {
          this.displayVouchersToPrint(x);
        } else {
          this.messageBox.show(x.message, 'Operación ejecutada');
          this.searchVouchers();
        }
      })
      .finally(() => this.isLoadingVoucher = false);
  }


  private setVoucherListData(voucherList: VoucherDescriptor[]) {
    this.voucherList = voucherList;
    this.searchVouchersCommand = Object.assign({}, this.searchVouchersCommand);
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


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.excelFileUrl = '';
  }


  private onOptionModalClosed() {
    this.displayOptionModalSelected = null;
  }


  private displayVouchersToPrint(result: VouchersOperationResult) {
    if (StringLibrary.isValidHttpUrl(result?.file?.url || '')) {
      window.open(result.file.url, '_blank', `resizable=yes`);
      return;
    }
    this.messageBox.showError(result?.message || '');
  }

}
