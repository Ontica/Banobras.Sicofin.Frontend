/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Assertion, EventInfo, StringLibrary } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { MainUIStateSelector, VoucherAction,
         VoucherStateSelector } from '@app/presentation/exported.presentation.types';

import { EmptyVoucher, EmptyVoucherFilterData, FileReport, isVoucherStageAll, mapVoucherDescriptorFromVoucher,
         mapVoucherStageFromViewName, Voucher, VoucherDescriptor, VoucherFilterData,
         VouchersBulkOperationData, VouchersOperationCommand, VouchersOperationResult,
         VouchersOperationType } from '@app/models';

import { View } from '@app/main-layout';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { VouchersDataService } from '@app/data-services';

import { ArrayLibrary } from '@app/shared/utils';

import {
  ExportReportModalEventType
} from '@app/views/_reports-controls/export-report-modal/export-report-modal.component';

import { VouchersExplorerEventType } from '@app/views/vouchers/vouchers-explorer/vouchers-explorer.component';

import { VouchersImporterEventType } from '@app/views/vouchers/vouchers-importer/vouchers-importer.component';

import { VoucherCreatorEventType } from '@app/views/vouchers/voucher-creator/voucher-creator.component';

import {
  VoucherTabbedViewEventType
} from '@app/views/vouchers/voucher-tabbed-view/voucher-tabbed-view.component';

type VouchersMainPageModalOptions = 'VoucherCreator' | 'VouchersImporter';


@Component({
  selector: 'emp-fa-vouchers-main-page',
  templateUrl: './vouchers-main-page.component.html'
})
export class VouchersMainPageComponent implements OnInit, OnDestroy {

  currentView: View;

  displayStatus = false;

  voucherFilterData: VoucherFilterData = Object.assign({}, EmptyVoucherFilterData);

  voucherList: VoucherDescriptor[] = [];

  selectedVoucher: Voucher = Object.assign({}, EmptyVoucher);

  displayVoucherTabbedView = false;

  displayOptionModalSelected: VouchersMainPageModalOptions = null;

  displayExportModal = false;

  exportModalMessage = 'Esta operación exportará los movimientos de las pólizas.';

  exportDataSelected: VouchersBulkOperationData = { operation: null, command: null };

  fileUrl = '';

  vouchersToPrintFile: FileReport;

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

    this.subscriptionHelper.select<VoucherFilterData>(VoucherStateSelector.LIST_FILTER_DATA)
      .subscribe(x => this.voucherFilterData = x);
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
        this.validateBulkOperationVouchers(event.payload.operation as VouchersOperationType,
                                           event.payload.command)
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event: EventInfo) {
    switch (event.type as ExportReportModalEventType) {

      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.exportDataSelected = { operation: null, command: null };
        this.setDisplayExportModal(false);
        return;

      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:

        if (this.exportDataSelected.operation === VouchersOperationType.excel) {
          this.bulkOperationVouchers(this.exportDataSelected.operation,
                                     this.exportDataSelected.command);
        }

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

      case VoucherCreatorEventType.ALL_VOUCHERS_CREATED:
        Assertion.assertValue(event.payload.message, 'event.payload.message');
        this.messageBox.show(event.payload.message, 'Nuevas pólizas');
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

    this.displayStatus = isVoucherStageAll(this.currentView.name);

    const currentFilterData =
      this.uiLayer.selectValue<VoucherFilterData>(VoucherStateSelector.LIST_FILTER_DATA);

    this.applyVoucherFilter(currentFilterData);
  }


  private applyVoucherFilter(voucherData: VoucherFilterData) {
    const query = Object.assign({}, voucherData.query,
      {stage: mapVoucherStageFromViewName(this.currentView.name)});
    const filterData = Object.assign({}, voucherData, {query});
    this.uiLayer.dispatch(VoucherAction.SET_LIST_FILTER_DATA, { filterData });
  }


  private refreshVouchers() {
    this.searchVouchers();
  }


  private searchVouchers() {
    if (!this.voucherFilterData.query.accountsChartUID) {
      return;
    }

    this.isLoading = true;

    this.vouchersData.searchVouchers(this.voucherFilterData.query)
      .firstValue()
      .then(x => {
        this.setVoucherListData(x);
        this.setSelectedVoucher(EmptyVoucher);
      })
      .finally(() => this.isLoading = false);
  }


  private getVoucher(idVoucher: number) {
    this.isLoadingVoucher = true;

    this.vouchersData.getVoucher(idVoucher)
      .firstValue()
      .then(x => this.setSelectedVoucher(x))
      .finally(() => this.isLoadingVoucher = false);
  }


  private bulkOperationVouchers(operation: VouchersOperationType, command: VouchersOperationCommand) {
    this.isLoadingVoucher = true;

    this.vouchersData.bulkOperationVouchers(operation, command)
      .firstValue()
      .then(x => this.resolveBulkOperationVouchersResponse(operation, x))
      .finally(() => this.isLoadingVoucher = false);
  }


  private validateBulkOperationVouchers(operation: VouchersOperationType, command: VouchersOperationCommand) {
    if (operation === VouchersOperationType.excel) {
      this.showExportVouchersEntries(operation, command);
    } else {
      this.bulkOperationVouchers(operation, command);
    }
  }


  private resolveBulkOperationVouchersResponse(operation: VouchersOperationType,
                                               result: VouchersOperationResult) {
    switch (operation) {
      case VouchersOperationType.print:
        this.resolvePrintVouchers(result);
        return;

      case VouchersOperationType.excel:
        this.resolveExportVouchersEntries(result);
        return;

      default:
        this.resolveBulkOperation(result);
        return;
    }
  }


  private setVoucherListData(voucherList: VoucherDescriptor[]) {
    this.voucherList = voucherList;
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


  private showExportVouchersEntries(operation: VouchersOperationType, command: VouchersOperationCommand) {
    this.exportDataSelected = {operation, command};

    const message = `Esta operación exportará los movimientos de las ` +
                    `<strong> ${command.vouchers.length} pólizas</strong> seleccionadas.` +
                    `<br><br>¿Exporto los movimientos de las pólizas?`;

    this.setDisplayExportModal(true, message);
  }


  private setDisplayExportModal(display: boolean, message?: string) {
    this.displayExportModal = display;
    this.exportModalMessage = message ?? '';
    this.fileUrl = '';
  }


  private onOptionModalClosed() {
    this.displayOptionModalSelected = null;
  }


  private resolveBulkOperation(result: VouchersOperationResult) {
    this.messageBox.show(result.message, 'Operación ejecutada');
    this.searchVouchers();
  }


  private resolvePrintVouchers(result: VouchersOperationResult) {
    if (StringLibrary.isValidHttpUrl(result?.file?.url || '')) {
      this.vouchersToPrintFile = result.file;
      return;
    }
    this.messageBox.showError(result?.message || '');
  }


  private resolveExportVouchersEntries(result: VouchersOperationResult) {
    this.fileUrl = result.file.url;
    this.exportModalMessage = result.message;
  }

}
