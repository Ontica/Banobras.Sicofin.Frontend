/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { SelectionModel } from '@angular/cdk/collections';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild,
         OnInit, OnDestroy} from '@angular/core';

import { concat, Observable, of, Subject } from 'rxjs';

import { catchError, debounceTime, delay, distinctUntilChanged, filter, switchMap,
         tap } from 'rxjs/operators';

import { Assertion, EventInfo, Identifiable, isEmpty, SessionService } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { PermissionsLibrary, View } from '@app/main-layout';

import { MainUIStateSelector } from '@app/presentation/exported.presentation.types';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { VouchersDataService } from '@app/data-services';

import { sendEvent } from '@app/shared/utils';

import { EmptyVoucher, getVoucherOperation, mapVoucherStageFromViewName, Voucher, VoucherDescriptor,
         VouchersOperation, VouchersOperationCommand, VouchersOperationType,
         VoucherStage } from '@app/models';

import { expandCollapse } from '@app/shared/animations/animations';

import { VoucherListItemEventType } from './voucher-list-item.component';

export enum VoucherListEventType {
  VOUCHER_CLICKED                    = 'VoucherListComponent.Event.VoucherClicked',
  EXECUTE_VOUCHERS_OPERATION_CLICKED = 'VoucherListComponent.Event.ExecuteVouchersOperationClicked',
  EXPORT_BUTTON_CLICKED              = 'VoucherListComponent.Event.ExportButtonClicked',
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

  editorList$: Observable<Identifiable[]>;
  editorInput$ = new Subject<string>();
  editorLoading = false;
  minTermLength = 4;

  subscriptionHelper: SubscriptionHelper;

  constructor(private uiLayer: PresentationLayer,
              private vouchersData: VouchersDataService,
              private session: SessionService,
              private messageBox: MessageBoxService) {
    this.subscriptionHelper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.voucherList) {
      this.scrollToTop();
      this.selection.clear();
    }
  }


  ngOnInit() {
    this.setOperationListByCurrentView();
  }


  ngOnDestroy() {
    this.subscriptionHelper.destroy();
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


  onVoucherListItemEvent(event) {

    switch (event.type as VoucherListItemEventType) {
      case VoucherListItemEventType.VOUCHER_CLICKED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');
        sendEvent(this.voucherListEvent, VoucherListEventType.VOUCHER_CLICKED, event.payload);
        return;

      case VoucherListItemEventType.CHECK_CLICKED:
        Assertion.assertValue(event.payload.voucher, 'event.payload.voucher');
        this.selection.toggle(event.payload.voucher);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }

  }


  onOperationChanges(operation: VouchersOperation) {
    this.editorSelected = null;

    if (operation.assignToRequired) {
      this.subscribeEditorList();
    }
  }


  onExecuteOperationClicked() {
    if (!this.operationValid) {
      this.messageBox.showError('Operación no válida. Favor de verificar los datos.');
      return;
    }

    this.showConfirmMessage();
  }


  onExportButtonClicked() {
    sendEvent(this.voucherListEvent, VoucherListEventType.EXPORT_BUTTON_CLICKED);
  }


  private setOperationListByCurrentView() {
    this.subscriptionHelper.select<View>(MainUIStateSelector.CURRENT_VIEW)
      .subscribe(x => this.setVouchersOperationList(x.name));
  }


  private setVouchersOperationList(viewName: string) {
    let list: VouchersOperation[] = [];

    const voucherStage = mapVoucherStageFromViewName(viewName);

    if (this.hasPermission(PermissionsLibrary.FEATURE_POLIZAS_ENVIAR_AL_DIARIO)) {
      list.push(getVoucherOperation(VouchersOperationType.close));
    }

    if (this.hasPermission(PermissionsLibrary.FEATURE_POLIZAS_ENVIAR_AL_SUPERVISOR)) {
      list.push(getVoucherOperation(VouchersOperationType.sendToSupervisor));
    }

    if (this.hasPermission(PermissionsLibrary.FEATURE_POLIZAS_REASIGNAR) &&
        voucherStage === VoucherStage.ControlDesk) {
      list.push(getVoucherOperation(VouchersOperationType.reasign));
    }

    if (this.hasPermission(PermissionsLibrary.FEATURE_POLIZAS_ELIMINAR)) {
      list.push(getVoucherOperation(VouchersOperationType.delete));
    }

    if (this.hasPermission(PermissionsLibrary.FEATURE_POLIZAS_IMPRIMIR)) {
      list.push(getVoucherOperation(VouchersOperationType.print));
    }

    this.operationsList = list;
  }


  private hasPermission(permission: string): boolean {
    return this.session.hasPermission(permission);
  }


  private subscribeEditorList() {
    this.editorList$ = concat(
      of([]),
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


  private scrollToTop() {
    if (this.virtualScroll) {
      this.virtualScroll.scrollToIndex(0);
    }
  }


  private showConfirmMessage() {
    const type = this.operationSelected.uid === VouchersOperationType.delete ?
      'DeleteCancel' : 'AcceptCancel';

    this.messageBox.confirm(this.getConfirmMessage(), this.getConfirmTitle(), type)
      .toPromise()
      .then(x => {
        if (x) {
          this.emitExecuteOperation();
        }
      });
  }


  private getConfirmTitle(): string {
    switch (this.operationSelected.uid as VouchersOperationType) {
      case VouchersOperationType.close:
      case VouchersOperationType.sendToSupervisor:
      case VouchersOperationType.delete:
      case VouchersOperationType.print:
        return `${this.operationSelected.name} las pólizas`;
      case VouchersOperationType.reasign:
        return 'Reasignar las pólizas';
      default:
        return 'Confirmar operación';
    }
  }


  private getConfirmMessage(): string {
    let operation = 'modificará';
    let question = '¿Continuo con la operación?';
    switch (this.operationSelected.uid as VouchersOperationType) {
      case VouchersOperationType.close:
        operation = 'enviará al diario';
        question = '¿Envío al diario las pólizas?';
        break;
      case VouchersOperationType.sendToSupervisor:
        operation = 'enviará al supervisor';
        question = '¿Envío al supervisor las pólizas?';
        break;
      case VouchersOperationType.delete:
        operation = 'eliminará';
        question = '¿Elimino la pólizas?';
        break;
      case VouchersOperationType.print:
        operation = 'imprimirá';
        question = '¿Imprimo las pólizas?';
        break;
      case VouchersOperationType.reasign:
        operation = `reasignará a <strong>${this.editorSelected.name}</strong>`;
        question = '¿Reasigno las pólizas?';
        break;
      default:
        break;
    }
    return `Esta operación ${operation} las ` +
           `<strong> ${this.selection.selected.length} pólizas</strong> seleccionadas.` +
           `<br><br>${question}`;
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
