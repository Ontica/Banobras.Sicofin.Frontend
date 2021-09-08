/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { AccountsChartDataService } from './accounts-chart.data.service';
import { BalancesDataService } from './balances.data.service';
import { BalancesStoreDataService } from './balances-store.data.service';
import { ExchangeRatesDataService } from './exchange-rates.data.service';
import { SubledgerDataService } from './subledgers.data.service';
import { VouchersDataService } from './vouchers.data.service';

import { FileDownloadService } from './file-services/file-download.service';
import { getSaver, SAVER } from './file-services/saver.provider';


@NgModule({

  providers: [
    AccountsChartDataService,
    BalancesDataService,
    BalancesStoreDataService,
    ExchangeRatesDataService,
    FileDownloadService,
    SubledgerDataService,
    VouchersDataService,

    { provide: SAVER, useFactory: getSaver }
  ]

})
export class DataServicesModule { }
