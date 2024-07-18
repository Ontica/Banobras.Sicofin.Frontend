/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { AccessControlDataService } from './_access-control.data.service';
import { SearcherDataService } from './_searcher.data.service';

import { AccountingCalendarsDataService } from './accounting-calendars.data.service';
import { AccountsChartDataService } from './accounts-chart.data.service';
import { AccountsEditionDataService } from './accounts-edition.data.service';
import { AccountsListsDataService } from './accounts-lists.data.service';
import { BalancesDataService } from './balances.data.service';
import { BalancesStoreDataService } from './balances-store.data.service';
import { CataloguesDataService } from './catalogues.data.service';
import { ExchangeRatesDataService } from './exchange-rates.data.service';
import { ExternalProcessDataService } from './external-process.data.service';
import { ExternalVariablesDataService } from './external-variables.data.service';
import { FinancialConceptsDataService } from './financial-concepts.data.service';
import { FinancialReportsEditionDataService } from './financial-reports-edition.data.service';
import { ImportVouchersDataService } from './import-vouchers.data.service';
import { ReconciliationDataService } from './reconciliation.data.service';
import { ReportingDataService } from './reporting.data.service';
import { SubledgerDataService } from './subledgers.data.service';
import { TransactionSlipsDataService } from './transaction-slips.data.service';
import { VouchersDataService } from './vouchers.data.service';

import { FileDownloadService } from './file-services/file-download.service';
import { getSaver, SAVER } from './file-services/saver.provider';


@NgModule({

  providers: [
    AccessControlDataService,
    SearcherDataService,
    AccountingCalendarsDataService,
    AccountsChartDataService,
    AccountsEditionDataService,
    AccountsListsDataService,
    BalancesDataService,
    BalancesStoreDataService,
    CataloguesDataService,
    ExchangeRatesDataService,
    ExternalProcessDataService,
    ExternalVariablesDataService,
    FileDownloadService,
    FinancialConceptsDataService,
    FinancialReportsEditionDataService,
    ImportVouchersDataService,
    ReconciliationDataService,
    ReportingDataService,
    SubledgerDataService,
    TransactionSlipsDataService,
    VouchersDataService,

    { provide: SAVER, useFactory: getSaver }
  ]

})
export class DataServicesModule { }
