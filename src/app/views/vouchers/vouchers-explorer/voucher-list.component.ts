/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild,
         OnInit, OnDestroy } from '@angular/core';

import { Assertion, EventInfo, Identifiable, isEmpty, SessionService } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { PERMISSIONS, View } from '@app/main-layout';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { SearcherAPIS } from '@app/data-services';

import { sendEvent } from '@app/shared/utils';

import { expandCollapse } from '@app/shared/animations/animations';

import { EmptyVoucher, getVoucherOperation, mapVoucherStageFromViewName, Voucher, VoucherDescriptor,
         VouchersOperation, VouchersOperationCommand, VouchersOperationType,
         VoucherStage } from '@app/models';

import { VoucherListItemEventType } from './voucher-list-item.component';

export enum VoucherListEventType {
  VOUCHER_CLICKED                    = 'VoucherListComponent.Event.VoucherClicked',
  EXECUTE_VOUCHERS_OPERATION_CLICKED = 'VoucherListComponent.Event.ExecuteVouchersOperationClicked',
}


@Component({
  selector: 'emp-fa-voucher-list',
  templateUrl: './voucher-list.component.html',
  animations: [expandCollapse],
})
export class VoucherListComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  @Input() voucherList: VoucherDescriptor[] = [];

  @Input() selectedVoucher: Voucher = EmptyVoucher;

  @Input() textNotFound = 'No se ha invocado la búsqueda de pólizas.';

  @Output() voucherListEvent = new EventEmitter<EventInfo>();

  selection = new SelectionModel<VoucherDescriptor>(true, []);

  operationSelected: VouchersOperation = null;

  editorSelected: Identifiable = null;

  operationsList: VouchersOperation[] = [];

  vouchersEditorsAPI = SearcherAPIS.vouchersEditors;

  helper: SubscriptionHelper;


  constructor(private uiLayer: PresentationLayer,
              private session: SessionService,
              private messageBox: MessageBoxService) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucherList) {
      this.scrollToTop();
      this.selection.clear();
      this.validateOperationList();
    }
  }


  ngOnInit() {
    this.setOperationListByCurrentView();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get operationValid() {
    if (isEmpty(this.operationSelected)) {
      return false;
    }

    if (this.operationSelected.assignToRequired && isEmpty(this.editorSelected)) {
      return false;
    }

    return true;
  }


  isSelected(voucher: VoucherDescriptor) {
    return (this.selectedVoucher.id === voucher.id);
  }


  onVoucherListItemEvent(event: EventInfo) {
    switch (event.type as VoucherListItemEventType) {
      case VoucherListItemEventType.VOUCHER_CLICKED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');
        sendEvent(this.voucherListEvent, VoucherListEventType.VOUCHER_CLICKED, event.payload);
        return;

      case VoucherListItemEventType.CHECK_CLICKED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');
        this.selection.toggle(event.payload.voucher);
        this.validateOperationList();
        return;

      case VoucherListItemEventType.CHECK_ALL_CLICKED:
        Assertion.assertValue(event.payload.vouchers, 'event.payload.vouchers');
        this.validateOperationList();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onOperationChanges() {
    this.editorSelected = null;
  }


  onExecuteOperationClicked() {
    if (!this.operationValid) {
      this.messageBox.showError('Operación no válida. Favor de verificar los datos.');
      return;
    }

    this.validateShowConfirmMessage();
  }


  private setOperationListByCurrentView() {
    this.helper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.setVouchersOperationList(x.name));
  }


  private setVouchersOperationList(viewName: string) {
    let list: VouchersOperation[] = [];

    const voucherStage = mapVoucherStageFromViewName(viewName);

    if (this.hasPermission(PERMISSIONS.FEATURE_POLIZAS_ENVIAR_AL_DIARIO)) {
      list.push(getVoucherOperation(VouchersOperationType.close));
    }

    if (this.hasPermission(PERMISSIONS.FEATURE_POLIZAS_ENVIAR_AL_SUPERVISOR)) {
      list.push(getVoucherOperation(VouchersOperationType.sendToSupervisor));
    }

    if (this.hasPermission(PERMISSIONS.FEATURE_POLIZAS_REASIGNAR) &&
        voucherStage === VoucherStage.ControlDesk) {
      list.push(getVoucherOperation(VouchersOperationType.reasign));
    }

    if (this.hasPermission(PERMISSIONS.FEATURE_POLIZAS_ELIMINAR)) {
      list.push(getVoucherOperation(VouchersOperationType.delete));
    }

    if (this.hasPermission(PERMISSIONS.FEATURE_POLIZAS_IMPRIMIR)) {
      list.push(getVoucherOperation(VouchersOperationType.print));
    }

    if (this.hasPermission(PERMISSIONS.FEATURE_POLIZAS_EXPORTAR_MOVIMIENTOS)) {
      list.push(getVoucherOperation(VouchersOperationType.excel));
    }

    if (this.hasPermission(PERMISSIONS.FEATURE_POLIZAS_CLONE)) {
      list.push(getVoucherOperation(VouchersOperationType.clone));
    }

    this.operationsList = list;
  }


  private validateOperationList() {
    if (this.hasPermission(PERMISSIONS.FEATURE_POLIZAS_CLONE)) {
      const defaultOperationList = this.operationsList.filter(x => x.uid !== VouchersOperationType.clone);
      const showClone = this.selection.selected.length <= 1;

      if (showClone) {
        const cloneOperation = getVoucherOperation(VouchersOperationType.clone)
        defaultOperationList.push(cloneOperation);
      }

      this.operationsList = [...defaultOperationList];
    }
  }


  private hasPermission(permission: string): boolean {
    return this.session.hasPermission(permission);
  }


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }
  }


  private validateShowConfirmMessage() {
    if (this.operationSelected.uid === VouchersOperationType.excel) {
      this.emitExecuteOperation();
    } else {
      this.showConfirmMessage();
    }
  }


  private showConfirmMessage() {
    const type = this.operationSelected.uid === VouchersOperationType.delete ?
      'DeleteCancel' : 'AcceptCancel';

    this.messageBox.confirm(this.getConfirmMessage(), this.getConfirmTitle(), type)
      .firstValue()
      .then(x => {
        if (x) {
          this.emitExecuteOperation();
        }
      });
  }


  private getConfirmTitle(): string {
    const vouchersText = this.selection.selected.length === 1 ? 'la póliza' : `las pólizas`

    switch (this.operationSelected.uid as VouchersOperationType) {
      case VouchersOperationType.close:
      case VouchersOperationType.sendToSupervisor:
      case VouchersOperationType.delete:
      case VouchersOperationType.print:
        return `${this.operationSelected.name} ${vouchersText}`;
      case VouchersOperationType.reasign:
        return `Reasignar ${vouchersText}`;
      case VouchersOperationType.clone:
        return `Clonar ${vouchersText}`;
      default:
        return 'Confirmar operación';
    }
  }


  private getConfirmMessage(): string {
    const vouchersCount = this.selection.selected.length;
    const vouchers = vouchersCount === 1 ? 'la póliza' : `las ${vouchersCount} pólizas`
    const selection = vouchersCount === 1 ? 'la póliza seleccionada.' :
      `las <strong>${vouchersCount} pólizas</strong> seleccionadas.`
    let operation = 'modificará';
    let question = '¿Continuo con la operación?';

    switch (this.operationSelected.uid as VouchersOperationType) {
      case VouchersOperationType.close:
        operation = 'enviará al diario';
        question = `¿Envío al diario ${vouchers}?`;
        break;
      case VouchersOperationType.sendToSupervisor:
        operation = 'enviará al supervisor';
        question = `¿Envío al supervisor ${vouchers}?`;
        break;
      case VouchersOperationType.delete:
        operation = 'eliminará';
        question = `¿Elimino ${vouchers}?`;
        break;
      case VouchersOperationType.print:
        operation = 'imprimirá';
        question = `¿Imprimo ${vouchers}?`;
        break;
      case VouchersOperationType.reasign:
        operation = `reasignará a <strong>${this.editorSelected.name}</strong>`;
        question = `¿Reasigno ${vouchers}?`;
        break;
      case VouchersOperationType.clone:
        operation = 'clonará';
        question = `¿Clono ${vouchers}?`;
        break;
      default:
        break;
    }

    return `Esta operación ${operation} ` + selection + `<br><br>${question}`;
  }


  private emitExecuteOperation() {
    let command: VouchersOperationCommand = { vouchers: this.selection.selected.map(v => v.id) };

    if (this.operationSelected.assignToRequired) {
      command.assignToUID = this.editorSelected.uid;
    }

    sendEvent(this.voucherListEvent, VoucherListEventType.EXECUTE_VOUCHERS_OPERATION_CLICKED,
      { operation: this.operationSelected.uid, command });
  }

}
