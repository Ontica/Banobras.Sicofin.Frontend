/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';


export interface FinancialConceptCommand {
  accountsChartUID: string;
  groupUID?: string;
  date?: DateString;
}


export interface FinancialConceptDescriptor {
  uid: string;
  code: string;
  name: string;
  position: number;
  level: number;
  accountsChartName: string;
  groupName: string;
}


export interface FinancialConcept {
  uid: string;
  code: string;
  name: string;
  position: number;
  level: number;
  startDate: DateString;
  endDate: DateString;
  group: Identifiable;
  accountsChart: Identifiable;
  integration: FinancialConceptEntry[]
}


export enum FinancialConceptEntryType {
  Account = 'Account',
  ExternalVariable = 'ExternalVariable',
  FinancialConceptReference = 'FinancialConceptReference'
}


export interface FinancialConceptEntry {
  uid: string;
  type: FinancialConceptEntryType;
  itemName: string;
  itemCode: string;
  subledgerAccount: string;
  sectorCode: string;
  operator: string;
}


export const EmptyFinancialConceptCommand: FinancialConceptCommand = {
  accountsChartUID: '',
  groupUID: '',
  date: '',
};


export const EmptyFinancialConceptDescriptor: FinancialConceptDescriptor = {
  uid: '',
  code: '',
  name: '',
  position: 0,
  level: 0,
  accountsChartName: '',
  groupName: '',
};


export const EmptyFinancialConcept: FinancialConcept = {
  uid: '',
  code: '',
  name: '',
  position: 0,
  level: 0,
  group: Empty,
  accountsChart: Empty,
  startDate: '',
  endDate: '',
  integration: [],
};


export const EmptyFinancialConceptEntry: FinancialConceptEntry = {
  uid: '',
  type: FinancialConceptEntryType.Account,
  itemName: '',
  itemCode: '',
  subledgerAccount: '',
  sectorCode: '',
  operator: '',
}
