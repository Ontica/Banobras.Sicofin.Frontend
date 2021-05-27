/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';
import { AccountDescriptor } from './accounts-chart';


export const TrialBalanceType: Identifiable[] = [
  {uid: 'Traditional', name: 'Balanza tradicional'},
  {uid: 'Valued', name: 'Balanza valorizada'}
];


export const BalancesType: Identifiable[] = [
  {uid: 'AllAccounts', name: 'Todas las cuentas'},
  {uid: 'WithCurrentBalance', name: 'Cuentas con saldo actual'},
  {uid: 'WithCurrenBalanceOrMovements', name: 'Cuentas con saldo actual o movimientos'},
  {uid: 'WithMovements', name: 'Cuentas con movimientos'}
];


export interface TrialBalanceCommand {
  trialBalanceType: string;
  accountsChartUID: string;
  fromDate: string;
  toDate: string;
  consolidated: boolean;
  ledgers?: string[];
  sectors?: string[];
  fromAccount?: string;
  toAccount?: string;
  level?: number;
  balancesType?: string;
}


export interface TrialBalance {
  command: TrialBalanceCommand;
  entries: TrialBalanceEntry[];
}


export interface TrialBalanceEntry {
  ledger: Identifiable;
  currency: Identifiable;
  account: AccountDescriptor;
  ledgerAccountId?: number;
  sector: Identifiable;
  initialBalance: number;
  debit: number;
  credit: number;
  currentBalance: number;
}
