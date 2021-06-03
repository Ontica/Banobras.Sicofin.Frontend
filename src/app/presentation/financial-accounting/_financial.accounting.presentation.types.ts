/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


/* Actions */

import { ActionType as VoucherAction } from './voucher.presentation.handler';
export { ActionType as VoucherAction } from './voucher.presentation.handler';

export type FAActions = VoucherAction;


/* Commands */

export type FACommands = '';


/* Effects */

import { EffectType as VoucherEffectType } from './voucher.presentation.handler';

export type FAEffects = VoucherEffectType;


/* Selectors */

import { SelectorType as AccountChartStateSelector } from './account-chart.presentation.handler';
export { SelectorType as AccountChartStateSelector } from './account-chart.presentation.handler';

import { SelectorType as VoucherStateSelector } from './voucher.presentation.handler';
export { SelectorType as VoucherStateSelector } from './voucher.presentation.handler';

export type FASelectors = AccountChartStateSelector | VoucherStateSelector;
