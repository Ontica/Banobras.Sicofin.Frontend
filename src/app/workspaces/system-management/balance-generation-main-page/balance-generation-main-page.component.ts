/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion, DateStringLibrary, EventInfo, isEmpty } from '@app/core';

import { BalancesStoreDataService } from '@app/data-services';

import { AccountsChartMasterData, BalanceStorageCommand, EmptyStoredBalanceSet, StoredBalanceSet } from '@app/models';

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
  selector: 'emp-fa-balance-generation-main-page',
  templateUrl: './balance-generation-main-page.component.html'
})
export class BalanceGenerationMainPageComponent {

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
        this.setSelectedStoredBalanceSet(event.payload.storedBalanceSet);
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
        Assertion.assertValue(event.payload.command, 'event.payload.command');
        Assertion.assertValue(event.payload.command.accountsChartUID, 'event.payload.command.accountsChartUID');
        Assertion.assertValue(event.payload.command.balancesDate, 'event.payload.command.balancesDate');

        this.createStoredBalancesSet(event.payload.command.accountsChartUID,
                                     event.payload.command as BalanceStorageCommand);
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
        this.calculateStoredBalancesSet(event.payload.accountsChartUID, event.payload.balanceSetUID);
        return;

      case StoredBalanceSetTabbedViewEventType.EXPORT_STORED_BALANCE_SET:
        this.setDisplayExportModal(true);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event: EventInfo) {
    switch (event.type as ExportReportModalEventType) {

      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;

      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
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
      .firstValue()
      .then(x => this.storedBalanceSetList = x)
      .catch(error => this.storedBalanceSetList = []);
  }


  private createStoredBalancesSet(accountsChartUID: string, balanceSet: BalanceStorageCommand) {
    this.setSubmitted(true);

    this.balancesStoreData.createStoredBalancesSet(accountsChartUID, balanceSet)
      .firstValue()
      .then(x => {
        this.displayBalanceSetCreator = false;
        this.setSelectedStoredBalanceSet(x);

        if (this.selectedAccountChart?.uid === accountsChartUID) {
          this.getBalancesSetsList();
        }
      })
      .finally(() => this.setSubmitted(false));
  }


  private calculateStoredBalancesSet(accountsChartUID: string, balanceSetUID: string) {
    this.setSubmitted(true);

    this.balancesStoreData.calculateStoredBalancesSet(accountsChartUID, balanceSetUID)
      .firstValue()
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
  }


  private exportStoredBalanceSetToExcel() {
    this.balancesStoreData.exportStoredBalanceSetToExcel(this.selectedStoredBalanceSet.accountsChart.uid,
                                                         this.selectedStoredBalanceSet.uid)
      .firstValue()
      .then(x => {
        this.excelFileUrl = x.url;
      });
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.excelFileUrl = '';
  }

}
