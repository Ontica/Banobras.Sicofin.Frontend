/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AccountDescriptor, Ledger } from './accounts-chart';

export interface AccountBalance {
  ledger: Ledger;
  account: AccountDescriptor;
  currentBalance: number;
}
