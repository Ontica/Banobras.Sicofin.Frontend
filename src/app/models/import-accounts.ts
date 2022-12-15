/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';


export interface ImportAccountsCommand {
  accountsChartUID: string;
  applicationDate: DateString;
}


export interface ImportAccountsResult {
  operation: string;
  count: number;
  errors: number;
  itemsList: string[];
  errorsList: string[];
}


export const EmptyImportAccountsCommand: ImportAccountsCommand = {
  accountsChartUID: '',
  applicationDate: '',
};
