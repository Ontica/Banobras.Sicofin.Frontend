/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';

import { ImportAccountsResult } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

@Component({
  selector: 'emp-fa-accounts-importer-details-table',
  templateUrl: './importer-details-table.component.html',
})
export class AccountsImporterDetailsTableComponent implements OnChanges {

  @Input() importResult: ImportAccountsResult[] = [];

  @Input() commandExecuted = false;

  displayedColumns = ['operation', 'accountsCount', 'errorsCount'];

  dataSource: MatTableDataSource<ImportAccountsResult>;

  constructor(private messageBox: MessageBoxService) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.importResult) {
      this.dataSource = new MatTableDataSource(this.importResult || []);
    }
  }


  onShowAccountsDetailClicked(row: ImportAccountsResult) {
    this.showMessage('Detalle de operación', row.operation, row.itemsList);
  }


  onShowErrorsClicked(row: ImportAccountsResult) {
    this.showMessage('Errores detectados', row.operation, row.errorsList);
  }


  private showMessage(title: string, description: string, messageList: string[]) {
    if (messageList.length > 0) {
      let message = `<strong>${description}:</strong> <br><br> `;
      message += '<ul class="info-list">' +
        messageList.map(x => '<li>' + x + '</li>').join('') + '</ul>';
      this.messageBox.show(message, title);
    }
  }

}
