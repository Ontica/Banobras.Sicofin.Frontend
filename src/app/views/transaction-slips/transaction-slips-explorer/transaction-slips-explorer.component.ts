/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';

import { EventInfo } from '@app/core';

import { EmptyTransactionSlip, TransactionSlip, TransactionSlipDescriptor } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { TransactionSlipsFilterEventType } from './transaction-slips-filter.component';

import { TransactionSlipsListEventType } from './transaction-slips-list.component';

export enum TransactionSlipsExplorerEventType {
  SEARCH_TRANSACTION_SLIPS = 'TransactionSlipsExplorerComponent.Event.SearchTransactionSlips',
  EXPORT_TRANSACTION_SLIPS = 'TransactionSlipsExplorerComponent.Event.ExportTransactionSlips',
  SELECT_TRANSACTION_SLIP = 'TransactionSlipsExplorerComponent.Event.SelectTransactionSlip',
}

@Component({
  selector: 'emp-fa-transaction-slips-explorer',
  templateUrl: './transaction-slips-explorer.component.html',
})
export class TransactionSlipsExplorerComponent implements OnChanges {

  @Input() transactionSlipsList: TransactionSlipDescriptor[] = [];

  @Input() selectedTransactionSlip: TransactionSlip = EmptyTransactionSlip;

  @Input() isLoading = false;

  @Input() commandExecuted = false;

  @Output() transactionSlipsExplorerEvent = new EventEmitter<EventInfo>();

  cardHint = 'Seleccionar los filtros';

  textNotFound = 'No se ha invocado la búsqueda de volantes.';

  ngOnChanges() {
    this.setText();
  }


  onTransactionSlipsFilterEvent(event) {
    switch (event.type as TransactionSlipsFilterEventType) {

      case TransactionSlipsFilterEventType.SEARCH_TRANSACTION_SLIPS_CLICKED:
        sendEvent(this.transactionSlipsExplorerEvent,
          TransactionSlipsExplorerEventType.SEARCH_TRANSACTION_SLIPS, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionSlipsListEvent(event) {
    switch (event.type as TransactionSlipsListEventType) {

      case TransactionSlipsListEventType.EXPORT_BUTTON_CLICKED:
        sendEvent(this.transactionSlipsExplorerEvent,
          TransactionSlipsExplorerEventType.EXPORT_TRANSACTION_SLIPS);
        return;

      case TransactionSlipsListEventType.TRANSACTION_SLIP_CLICKED:
        sendEvent(this.transactionSlipsExplorerEvent,
          TransactionSlipsExplorerEventType.SELECT_TRANSACTION_SLIP, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText() {
    if (!this.commandExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      this.textNotFound = 'No se ha invocado la búsqueda de volantes.';
      return;
    }

    if (this.isLoading) {
      this.cardHint = `Cargando volantes`;
      this.textNotFound = 'Cargando volantes...';
      return;
    }

    this.cardHint = `${this.transactionSlipsList.length} registros encontrados`;
    this.textNotFound = 'No se encontraron volantes con el filtro proporcionado.';
  }

}
