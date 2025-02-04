/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/services';

import { EmptyVoucher, Voucher } from '@app/models';


export enum VoucherSubmitterEventType {
  TOGGLE_EDITION_MODE_CLICKED       = 'VoucherSubmitterComponent.Event.ToggleEditionModeClicked',
  UPDATE_VOUCHER_CLICKED            = 'VoucherSubmitterComponent.Event.UpdateVoucherClicked',
  UPDATE_VOUCHER_CONCEPT_CLICKED    = 'VoucherSubmitterComponent.Event.UpdateVoucherConceptClicked',
  DELETE_VOUCHER_CLICKED            = 'VoucherSubmitterComponent.Event.DeleteVoucherClicked',
  CLONE_VOUCHER_BUTTON_CLICKED      = 'VoucherSubmitterComponent.Event.CloneVoucherButtonClicked',
  SEND_TO_LEDGER_BUTTON_CLICKED     = 'VoucherSubmitterComponent.Event.SendToLedgerButtonClicked',
  SEND_TO_SUPERVISOR_BUTTON_CLICKED = 'VoucherSubmitterComponent.Event.SendToSupervisorButtonClicked',
}

@Component({
  selector: 'emp-fa-voucher-submitter',
  templateUrl: './voucher-submitter.component.html',
  styles: [`button { margin-right: 8px;}`],
})
export class VoucherSubmitterComponent {

  @Input() voucher: Voucher = EmptyVoucher;

  @Input() isValidForm = true;

  @Input() editionMode = false;

  @Output() voucherSubmitterEvent = new EventEmitter<EventInfo>();

  eventType = VoucherSubmitterEventType;


  constructor(private messageBox: MessageBoxService) { }


  get hasActions(): boolean {
    return this.voucher.actions.editVoucher || this.voucher.actions.deleteVoucher ||
           this.voucher.actions.changeConcept || this.voucher.actions.cloneVoucher ||
           this.voucher.actions.sendToSupervisor || this.voucher.actions.sendToLedger;
  }


  get canToggleEditionMode(): boolean {
    return this.voucher.actions.editVoucher || this.voucher.actions.deleteVoucher ||
      this.voucher.actions.changeConcept;
  }


  onToggleEditionMode() {
    sendEvent(this.voucherSubmitterEvent, VoucherSubmitterEventType.TOGGLE_EDITION_MODE_CLICKED);
  }


  onSubmitForm() {
    if (this.voucher.actions.changeConcept) {
      sendEvent(this.voucherSubmitterEvent, VoucherSubmitterEventType.UPDATE_VOUCHER_CONCEPT_CLICKED);
      return;
    }

    sendEvent(this.voucherSubmitterEvent, VoucherSubmitterEventType.UPDATE_VOUCHER_CLICKED);
  }


  onEventButtonClicked(eventType: VoucherSubmitterEventType) {
    if ([VoucherSubmitterEventType.DELETE_VOUCHER_CLICKED,
         VoucherSubmitterEventType.CLONE_VOUCHER_BUTTON_CLICKED,
         VoucherSubmitterEventType.SEND_TO_LEDGER_BUTTON_CLICKED,
         VoucherSubmitterEventType.SEND_TO_SUPERVISOR_BUTTON_CLICKED].includes(eventType)) {
      this.showConfirmMessage(eventType);
      return;
    }
    sendEvent(this.voucherSubmitterEvent, eventType, {voucher: this.voucher});
  }


  private showConfirmMessage(eventType: VoucherSubmitterEventType) {
    const type = eventType === VoucherSubmitterEventType.DELETE_VOUCHER_CLICKED ?
      'DeleteCancel' : 'AcceptCancel';

    this.messageBox.confirm(this.getConfirmMessage(eventType), this.getConfirmTitle(eventType), type)
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.voucherSubmitterEvent, eventType, {voucher: this.voucher});
        }
      });
  }


  private getConfirmTitle(eventType: VoucherSubmitterEventType): string {
    switch (eventType) {
      case VoucherSubmitterEventType.DELETE_VOUCHER_CLICKED:
        return 'Eliminar póliza';
      case VoucherSubmitterEventType.CLONE_VOUCHER_BUTTON_CLICKED:
        return 'Clonar póliza';
      case VoucherSubmitterEventType.SEND_TO_LEDGER_BUTTON_CLICKED:
        return 'Enviar al diario';
      case VoucherSubmitterEventType.SEND_TO_SUPERVISOR_BUTTON_CLICKED:
        return 'Enviar a supervisión';
      default:
        return 'Confirmar operación';
    }
  }


  private getConfirmMessage(eventType: VoucherSubmitterEventType): string {
    let operation = 'modificará';
    let question = '¿Continuo con la operación?';
    switch (eventType) {
      case VoucherSubmitterEventType.DELETE_VOUCHER_CLICKED:
        operation = 'eliminará';
        question = '¿Elimino la póliza?';
        break;
      case VoucherSubmitterEventType.CLONE_VOUCHER_BUTTON_CLICKED:
        operation = 'clonará';
        question = '¿Clono la póliza?';
        break;
      case VoucherSubmitterEventType.SEND_TO_LEDGER_BUTTON_CLICKED:
        operation = 'enviara al diario';
        break;
      case VoucherSubmitterEventType.SEND_TO_SUPERVISOR_BUTTON_CLICKED:
        operation = 'enviara a supervisión';
        break;
      default:
        break;
    }
    return `Esta operación ${operation} la póliza
            <strong> ${this.voucher.number}: ${this.voucher.voucherType.name}</strong>.
            <br><br>${question}`;
  }

}
