/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Empty, Identifiable } from '@app/core';


export interface StoredBalanceSet {
  uid: string;
  accountsChart: Identifiable;
  name: string;
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
  subsidiaryAccountId: number;
  sectorCode: string;
  accountName: string;
  accountNumber: string;
  subsidiaryAccountNumber: string;
  subsidiaryAccountName: string;
  balance: number;
}
