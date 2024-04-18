/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { STATE_HANDLERS } from '@app/core/presentation/presentation.state';

import { MainLayoutPresentationHandler } from './main-layout/main-layout.presentation.handler';

import { AppStatusPresentationHandler } from './app-data/app-status.presentation.handler';

import { AccessControlPresentationHandler } from './security-management/access-control.presentation.handler';

import { AccountChartPresentationHandler } from './financial-accounting/account-chart.presentation.handler';

import { CataloguesPresentationHandler } from './financial-accounting/catalogues.presentation.handler';

import { ExchangeRatesPresentationHandler } from './financial-accounting/exchange-rates.presentation.handler';

import { ExternalVariablesPresentationHandler } from './financial-accounting/external-variables.presentation.handler';

import { FinancialConceptsPresentationHandler } from './financial-accounting/financial-concepts.presentation.handler';

import { ReportingPresentationHandler } from './financial-accounting/reporting.presentation.handler';

import { VoucherPresentationHandler } from './financial-accounting/voucher.presentation.handler';

@NgModule({

  providers: [
    MainLayoutPresentationHandler,
    AppStatusPresentationHandler,
    AccessControlPresentationHandler,
    AccountChartPresentationHandler,
    CataloguesPresentationHandler,
    ExchangeRatesPresentationHandler,
    ExternalVariablesPresentationHandler,
    FinancialConceptsPresentationHandler,
    ReportingPresentationHandler,
    VoucherPresentationHandler,

    { provide: STATE_HANDLERS, useExisting: MainLayoutPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: AppStatusPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: AccessControlPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: AccountChartPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: CataloguesPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: ExchangeRatesPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: ExternalVariablesPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: FinancialConceptsPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: ReportingPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: VoucherPresentationHandler, multi: true },
  ]

})
export class StateHandlersModule { }
