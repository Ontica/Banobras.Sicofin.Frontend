/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { STATE_HANDLERS } from '@app/core/presentation/presentation.state';

import { MainLayoutPresentationHandler } from './main-layout/main-layout.presentation.handler';

import { AccountChartPresentationHandler } from './financial-accounting/account-chart.presentation.handler';

import { VoucherPresentationHandler } from './financial-accounting/voucher.presentation.handler';

@NgModule({

  providers: [
    MainLayoutPresentationHandler,
    AccountChartPresentationHandler,
    VoucherPresentationHandler,

    { provide: STATE_HANDLERS, useExisting: MainLayoutPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: AccountChartPresentationHandler, multi: true },
    { provide: STATE_HANDLERS, useExisting: VoucherPresentationHandler, multi: true },
  ]

})
export class StateHandlersModule { }
