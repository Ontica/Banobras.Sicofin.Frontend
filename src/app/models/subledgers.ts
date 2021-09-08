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
