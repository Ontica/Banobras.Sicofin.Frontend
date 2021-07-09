/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo, isEmpty } from '@app/core';

import { BalancesStoreDataService } from '@app/data-services';

import { AccountsChartMasterData, EmptyStoredBalanceSet, StoredBalanceSet } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import {
  StoredBalanceSetCreatorEventType
} from '@app/views/balances-generation/stored-balance-set-creator/stored-balance-set-creator.component';

import {
  StoredBalanceSetTabbedViewEventType
} from '@app/views/balances-generation/stored-balance-set-tabbed-view/stored-balance-set-tabbed-view.component';

import {
  StoredBalanceSetsTableEventType
} from '@app/views/balances-generation/stored-balance-sets-table/stored-balance-sets-table.component';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';


@Component({
  selector: 'emp-fa-system-management-workspace',
  templateUrl: './system-management-workspace.component.html'
})
export class SystemManagementWorkspaceComponent {

  displayBalanceSetCreator = false;
  displayBalanceSetTabbedView = false;
  displayExportModal = false;

  isLoading = false;
  submitted = false;

  storedBalanceSetList: StoredBalanceSet[] = [];
  selectedStoredBalanceSet: StoredBalanceSet = EmptyStoredBalanceSet;
  selectedAccountChart: AccountsChartMasterData = null;

  excelFileUrl = '';

  constructor(private balancesStoreData: BalancesStoreDataService,
              private messageBox: MessageBoxService) { }


  onStoredBalanceSetsTableEvent(event: EventInfo): void {
    switch (event.type as StoredBalanceSetsTableEventType) {

      case StoredBalanceSetsTableEventType.SEARCH_BALANCES_SET:
        Assertion.assertValue(event.payload.accountsChart, 'event.payload.accountsChart');
        this.selectedAccountChart = event.payload.accountsChart as AccountsChartMasterData;
        this.getBalancesSetsList();
        return;

      case StoredBalanceSetsTableEventType.SELECT_BALANCES_SET:
        Assertion.assertValue(event.payload.storedBalanceSet, 'event.payload.storedBalanceSet');
        Assertion.assertValue(event.payload.storedBalanceSet.uid, 'event.payload.storedBalanceSet.uid');
        this.getStoredBalanceSet(event.payload.storedBalanceSet.uid);
        return;

      case StoredBalanceSetsTableEventType.CREATE_BALANCE_SET:
        this.displayBalanceSetCreator = true;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onStoredBalanceSetCreatorEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as StoredBalanceSetCreatorEventType) {

      case StoredBalanceSetCreatorEventType.CLOSE_MODAL_CLICKED:
        this.displayBalanceSetCreator = false;
        return;

      case StoredBalanceSetCreatorEventType.CREATE_STORED_BALANCE_SET:
        Assertion.assertValue(event.payload.accountsChartUID, 'event.payload.accountsChartUID');
        Assertion.assertValue(event.payload.storedBalanceSet, 'event.payload.storedBalanceSet');
        this.createStoredBalancesSet(event.payload.accountsChartUID, event.payload.storedBalanceSet);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }



  onStoredBalanceSetTabbedViewEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as StoredBalanceSetTabbedViewEventType) {

      case StoredBalanceSetTabbedViewEventType.CLOSE_MODAL_CLICKED:
        this.setSelectedStoredBalanceSet(EmptyStoredBalanceSet);
        return;

      case StoredBalanceSetTabbedViewEventType.CALCULATE_STORED_BALANCE_SET:
        Assertion.assertValue(event.payload.accountsChartUID, 'event.payload.accountsChartUID');
        Assertion.assertValue(event.payload.balanceSetUID, 'event.payload.balanceSetUID');
        Assertion.assertValue(event.payload.storedBalanceSet, 'event.payload.storedBalanceSet');
        this.calculateStoredBalancesSet(event.payload.accountsChartUID,
                                        event.payload.balanceSetUID,
                                        event.payload.storedBalanceSet);
        return;

      case StoredBalanceSetTabbedViewEventType.EXPORT_STORED_BALANCE_SET:
        this.displayExportModal = true;
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event) {
    switch (event.type as ExportReportModalEventType) {

      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.displayExportModal = false;
        return;

      case ExportReportModalEventType.EXPORT_EXCEL_CLICKED:
        if (!this.selectedStoredBalanceSet.accountsChart.name || !this.selectedStoredBalanceSet.uid) {
          return;
        }

        this.exportStoredBalanceSetToExcel();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getBalancesSetsList() {
    if (isEmpty(this.selectedAccountChart)) {
      return;
    }

    this.balancesStoreData.getBalancesSetsList(this.selectedAccountChart.uid)
      .toPromise()
      .then(x => this.storedBalanceSetList = x)
      .catch(error => this.storedBalanceSetList = []);
  }


  private getStoredBalanceSet(balanceSetUID: string) {
    if (isEmpty(this.selectedAccountChart) || !balanceSetUID) {
      return;
    }

    this.isLoading = true;

    this.balancesStoreData.getStoredBalanceSet(this.selectedAccountChart.uid, balanceSetUID)
      .toPromise()
      .then(x => this.setSelectedStoredBalanceSet(x))
      .finally(() => this.isLoading = false);
  }


  private createStoredBalancesSet(accountsChartUID: string, balanceSet: any) {
    this.setSubmitted(true);

    this.balancesStoreData.createStoredBalancesSet(accountsChartUID, balanceSet)
      .toPromise()
      .then(x => {
        this.displayBalanceSetCreator = false;
        this.setSelectedStoredBalanceSet(x);

        if (this.selectedAccountChart?.uid === accountsChartUID) {
          this.getBalancesSetsList();
        }
      })
      .finally(() => this.setSubmitted(false));
  }


  private calculateStoredBalancesSet(accountsChartUID: string, balanceSetUID: string, balanceSet: any) {
    this.setSubmitted(true);

    this.balancesStoreData.calculateStoredBalancesSet(accountsChartUID, balanceSetUID, balanceSet)
      .toPromise()
      .then(x => {
        this.setSelectedStoredBalanceSet(x);

        this.messageBox.show(`Se han generado los saldos acumulados al día
          ${DateStringLibrary.format(this.selectedStoredBalanceSet.calculationTime)}.`,
          'Saldos generados');

        if (this.selectedAccountChart?.uid === accountsChartUID) {
          this.getBalancesSetsList();
        }
      })
      .finally(() => this.setSubmitted(false));
  }


  private setSelectedStoredBalanceSet(storedBalanceSet: StoredBalanceSet) {
    this.selectedStoredBalanceSet = storedBalanceSet;
    this.displayBalanceSetTabbedView = !isEmpty(this.selectedStoredBalanceSet);
    this.excelFileUrl = '';
  }


  private exportStoredBalanceSetToExcel() {
    console.log('EXPORT_STORED_BALANCE_SET',
      'accountsChart: ' + this.selectedStoredBalanceSet.accountsChart.name,
      'balanceSetUID: ' + this.selectedStoredBalanceSet.uid);

    setTimeout(() => {
      this.excelFileUrl = 'data-dummy ' + this.selectedStoredBalanceSet.uid;
    }, 1000);
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }

}
