/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NumberValueAccessor } from "@angular/forms";


export enum AccountRole {

  // Summary account (cuenta sumaria)
  Summary,

  // Posting account (cuenta de detalle)
  Posting,

  // Control account (cuenta de control que se maneja a nivel auxiliar)
  Control,

  // Sectorized account (cuenta que maneja sector, con o sin auxiliares)
  Sectorized

}


export enum DebtorCreditorType {

  // Debtor account (cuenta de naturaleza deudora)
  Debtor,

  // Creditor account (cuenta de naturaleza acreedora)
  Creditor
}


export interface AccountsChart {
  uid: string;
  name: string;
  accountsPattern: string;
  accounts: AccountDescriptor[];
}


export interface AccountDescriptor {
  uid: string;
  number: string;
  name: string;
  type: string;
  role: AccountRole;
  debtorCreditor: DebtorCreditorType;
}


export interface AccountsSearchCommand {
  date: string;
  keywords?: string;
  fromAccount: string;
  toAccount: string;
  level: number;
  types?: string[];
  roles?: AccountRole[];
  sectors?: string[];
  currencies?: string[];
}
