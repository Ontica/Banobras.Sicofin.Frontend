/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from '@app/core';


export interface Subledger {
  uid: string;
  typeName: string;
  baseLedger: Identifiable;
  name: string;
  description: string;
  accountsPrefix: string;
}


export interface SubledgerAccount {
  id: number;
  baseLedger: Identifiable;
  subledger: Identifiable;
  number: string;
  name: string;
  keywords: string;
  description: string;
}


export interface SubledgerAccountDescriptor {
  id: number;
  number: string;
  name: string;
  fullname: string;
}


export const EmptySubledgerAccountDescriptor: SubledgerAccountDescriptor = {
  id: 0,
  number: '',
  name: '',
  fullname: '',
};
