/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

export interface BalanceStorageCommand {
  accountsChartUID: string;
  balancesDate: DateString;
}


export interface StoredBalanceSet extends Identifiable {
  accountsChart: Identifiable;
  balancesDate: string;
  calculated: boolean;
  calculationTime: string;
  protected: boolean;
  balances?: StoredBalance[];
}


export const EmptyStoredBalanceSet: StoredBalanceSet = {
  uid: '',
  accountsChart: Empty,
  name: '',
  balancesDate: '',
  calculated: false,
  calculationTime: '',
  protected: false,
};


export interface StoredBalance {
  standardAccountId: number;
  ledgerAccountId: number;
  ledger: Identifiable;
  currency: Identifiable;
  subledgerAccountId: number;
  sectorCode: string;
  accountName: string;
  accountNumber: string;
  subledgerAccountNumber: string;
  subledgerAccountName: string;
  balance: number;
}
