/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Empty, Identifiable } from '@app/core';

import { AccountRole, DebtorCreditorType } from './accounts-chart';


export interface LedgerAccount {
  id: number;
  standardAccountId: number;
  ledger: Identifiable;
  number: string;
  name: string;
  description: string;
  accountType: string;
  role: AccountRole;
  debtorCreditor: DebtorCreditorType;
  level: number;
  currencies: Identifiable[];
  sectors: LedgerAccountSectorRule[];
}


export const EmptyLedgerAccount: LedgerAccount = {
  id: 0,
  standardAccountId: 0,
  ledger: Empty,
  number: '',
  name: '',
  description: '',
  accountType: '',
  role: null,
  debtorCreditor: null,
  level: 0,
  currencies: [],
  sectors: [],
};


export interface LedgerAccountSectorRule {
  id: number;
  code: string;
  name: string;
  role: AccountRole;
}


export const EmptyLedgerAccountSectorRule: LedgerAccountSectorRule = {
  id: 0,
  code: '',
  name: '',
  role: null,
};
