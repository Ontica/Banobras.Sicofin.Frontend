/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { TransactionSlipsDataService } from '@app/data-services';

import { EmptySearchTransactionSlipsCommand, EmptyTransactionSlip, SearchTransactionSlipsCommand,
         TransactionSlip, TransactionSlipDescriptor } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { TransactionSlipsFilterEventType } from './transaction-slips-filter.component';

import { TransactionSlipsListEventType } from './transaction-slips-list.component';

export enum TransactionSlipsExplorerEventType {
  TRANSACTION_SLIP_SELECTED = 'TransactionSlipsExplorerComponent.Event.TransactionSlipSelected',
}

@Component({
  selector: 'emp-fa-transaction-slips-explorer',
  templateUrl: './transaction-slips-explorer.component.html',
})
export class TransactionSlipsExplorerComponent implements OnInit {

  @Input() selectedTransactionSlip: TransactionSlip = EmptyTransactionSlip;

  @Output() transactionSlipsExplorerEvent = new EventEmitter<EventInfo>();

  command: SearchTransactionSlipsCommand = Object.assign({}, EmptySearchTransactionSlipsCommand);

  transactionSlipsList: TransactionSlipDescriptor[] = [];

  cardHint = '';

  textNotFound = '';

  isLoading = false;

  isLoadingTransaction = false;

  commandExecuted = false;

  constructor(private transactionSlipsData: TransactionSlipsDataService) {}


  ngOnInit(): void {
    this.setText();
  }


  onTransactionSlipsFilterEvent(event) {
    switch (event.type as TransactionSlipsFilterEventType) {

      case TransactionSlipsFilterEventType.SEARCH_TRANSACTION_SLIPS_CLICKED:
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        this.command = Object.assign({}, event.payload.command);
        this.clearSearchData();
        this.searchTransactionSlips();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTransactionSlipsListEvent(event) {
    switch (event.type as TransactionSlipsListEventType) {

      case TransactionSlipsListEventType.EXPORT_BUTTON_CLICKED:
        console.log('EXPORT_DATA', this.command);
        return;

      case TransactionSlipsListEventType.TRANSACTION_SLIP_CLICKED:
        Assertion.assertValue(event.payload.transactionSlip, 'event.payload.transactionSlip');
        Assertion.assertValue(event.payload.transactionSlip.uid, 'event.payload.transactionSlip.uid');
        this.getTransactionSlip(event.payload.transactionSlip.uid);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.commandExecuted) {
      this.cardHint = 'Seleccionar los filtros';
      this.textNotFound = 'No se ha invocado la búsqueda de volantes.';
      return;
    }

    this.textNotFound = 'No se encontraron volantes con el filtro proporcionado.';

    if (displayedEntriesMessage) {
      this.cardHint = displayedEntriesMessage;
      return;
    }

    this.cardHint = `${this.transactionSlipsList.length} registros encontrados`;
  }


  private clearSearchData() {
    this.commandExecuted = false;
    this.setTransactionSlipsList([]);
  }


  private searchTransactionSlips() {
    if (!this.command.accountsChartUID) {
      return;
    }

    this.isLoading = true;

    this.transactionSlipsData.searchTransactionSlips(this.command)
      .toPromise()
      .then(x => {
        this.commandExecuted = true;
        this.setTransactionSlipsList(x);
        this.emitSelectedTransactionSlip(EmptyTransactionSlip);
      })
      .finally(() => this.isLoading = false);
  }


  private getTransactionSlip(transactionSlipUID: string) {
    this.isLoadingTransaction = true;

    this.transactionSlipsData.getTransactionSlip(transactionSlipUID)
      .toPromise()
      .then(x => this.emitSelectedTransactionSlip(x))
      .finally(() => this.isLoadingTransaction = false);
  }


  private setTransactionSlipsList(transactionSlipsList: TransactionSlipDescriptor[]) {
    this.transactionSlipsList = transactionSlipsList;
    this.setText();
  }


  private emitSelectedTransactionSlip(transactionSlip: TransactionSlip) {
    sendEvent(this.transactionSlipsExplorerEvent, TransactionSlipsExplorerEventType.TRANSACTION_SLIP_SELECTED,
      {transactionSlip});
  }

}
