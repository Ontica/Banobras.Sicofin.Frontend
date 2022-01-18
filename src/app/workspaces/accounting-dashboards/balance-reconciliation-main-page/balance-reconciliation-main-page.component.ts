/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, DateString, EventInfo } from '@app/core';

import { EmptyDataTable, DataTable } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import {
  ImportedDataViewerEventType
} from '@app/views/reports-controls/imported-data-viewer/imported-data-viewer.component';

@Component({
  selector: 'emp-fa-balance-reconciliation-main-page',
  templateUrl: './balance-reconciliation-main-page.component.html',
})
export class BalanceReconciliationMainPageComponent {

  balanceSheetData: DataTable = Object.assign({}, EmptyDataTable);

  excelFileUrl = '';

  dataImportedResult = null;

  submitted = false;

  isLoading = false;

  constructor(private messageBox: MessageBoxService) { }


  onImportedDataViewerEvent(event: EventInfo){
    if (this.submitted) {
      return;
    }

    switch (event.type as ImportedDataViewerEventType) {

      case ImportedDataViewerEventType.SEARCH_DATA:
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        this.searchBalanceSheetData(event.payload.command);
        return;

      case ImportedDataViewerEventType.GET_FORMAT:
        Assertion.assertValue(event.payload.date, 'event.payload.date');
        this.getBalanceFormat(event.payload.date as DateString);
        return;

      case ImportedDataViewerEventType.IMPORT_DATA:
        Assertion.assertValue(event.payload.date, 'event.payload.date');
        Assertion.assertValue(event.payload.files, 'event.payload.files');
        this.dataImportedResult = null;
        this.importBalanceSheetFromExcel(event.payload.date as DateString, event.payload.files as File[]);
        return;

      case ImportedDataViewerEventType.EXPORT_DATA:
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        this.exportBalanceSheetData(event.payload.command);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private searchBalanceSheetData(command) {
    this.setSubmitted(true);
    setTimeout(() => {
      this.messageBox.showInDevelopment('Consultar conciliaciones', command);
      this.balanceSheetData = Object.assign({}, EmptyDataTable,
        {command, columns: [{field: 'uid', title: ''}]});
      this.setSubmitted(false);
    }, 500);
  }


  private getBalanceFormat(date: DateString) {
    this.setSubmitted(true);

    setTimeout(() => {
      this.messageBox.showInDevelopment('obtener formato de datos a conciliar', date);
      this.setSubmitted(false);
    }, 500);
  }


  private importBalanceSheetFromExcel(date: DateString, files: File[]) {
    this.setSubmitted(true);

    setTimeout(() => {
      this.dataImportedResult = {success: true};
      this.setSubmitted(false);
      this.messageBox.showInDevelopment('Importar datos a conciliar', {date, files});
    }, 500);
  }


  private exportBalanceSheetData(command) {
    this.submitted = true;

    setTimeout(() => {
      this.excelFileUrl = 'data-dummy';
      this.messageBox.showInDevelopment('Exportar conciliaciones', command);
      this.submitted = false;
    }, 500);
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }

}
