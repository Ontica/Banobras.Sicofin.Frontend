/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';


export interface ExchangeRate {
  id: number;
  exchangeRateType: Identifiable;
  date: string;
  fromCurrency: Identifiable;
  toCurrency: Identifiable;
  value: number;
}
