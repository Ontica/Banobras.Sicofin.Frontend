/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { Assertion } from '@app/core';

import { BalancesDataService } from '@app/data-services';

import { EmptyTrialBalance, EmptyTrialBalanceCommand, getTrialBalanceTypeNameFromUid, TrialBalance,
         TrialBalanceCommand } from '@app/models';
import { ExportReportModalEventType } from '@app/views/reports-controls/export-report-modal/export-report-modal.component';

import { TrialBalanceFilterEventType } from '../trial-balance-filter/trial-balance-filter.component';

import { TrialBalanceTableEventType } from '../trial-balance-table/trial-balance-table.component';

@Component({
  selector: 'emp-fa-trial-balance',
  templateUrl: './trial-balance.component.html',
})
export class TrialBalanceComponent {

  balanceTypeName = '';

  cardHint = 'Selecciona los filtros';

  isLoading = false;

  submitted = false;

  trialBalance: TrialBalance = EmptyTrialBalance;

  trialBalanceCommand: TrialBalanceCommand = Object.assign({}, EmptyTrialBalanceCommand);

  displayExportModal = false;

  excelFileUrl = '';


  constructor(private balancesDataService: BalancesDataService) { }


  onTrialBalanceFilterEvent(event) {
    if (this.submitted) {
      return;
    }

    switch (event.type as TrialBalanceFilterEventType) {

      case TrialBalanceFilterEventType.BUILD_TRIAL_BALANCE_CLICKED:
        Assertion.assertValue(event.payload.trialBalanceCommand, 'event.payload.trialBalanceCommand');

        this.trialBalanceCommand = event.payload.trialBalanceCommand as TrialBalanceCommand;

        this.excelFileUrl = '';

        this.getTrialBalance(this.trialBalanceCommand);

        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onTrialBalanceTableEvent(event) {
    switch (event.type as TrialBalanceTableEventType) {

      case TrialBalanceTableEventType.COUNT_ITEMS_DISPLAYED:
        Assertion.assertValue(event.payload, 'event.payload');
        setTimeout(() => this.setText(event.payload));
        return;

      case TrialBalanceTableEventType.EXPORT_BALANCE:
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
        if (this.submitted || !this.trialBalanceCommand.accountsChartUID ) {
          return;
        }

        this.exportTrialBalanceToExcel();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private getTrialBalance(trialBalanceCommand: TrialBalanceCommand) {
    this.setSubmitted(true);

    this.balancesDataService.getTrialBalance(trialBalanceCommand)
      .toPromise()
      .then(x => {
        this.trialBalance = x;
        this.setText();
      })
      .finally(() => this.setSubmitted(false));
  }


  private exportTrialBalanceToExcel() {
    this.balancesDataService.exportTrialBalanceToExcel(this.trialBalanceCommand)
      .toPromise()
      .then(x => {
        this.excelFileUrl = x.url;
      });
  }


  private setText(itemsDisplayed?: number) {

    if (!this.trialBalance.command.trialBalanceType) {
      this.cardHint =  'Selecciona los filtros';
      return;
    }

    this.balanceTypeName = getTrialBalanceTypeNameFromUid(this.trialBalance.command.trialBalanceType);

    this.cardHint = this.balanceTypeName;

    this.cardHint += itemsDisplayed >= 0 ?
      ` - ${itemsDisplayed} de ${this.trialBalance.entries.length} registros mostrados` :
      ` - ${this.trialBalance.entries.length} registros encontrados`;
  }


  private setSubmitted(submitted: boolean) {
    this.isLoading = submitted;
    this.submitted = submitted;
  }

}
