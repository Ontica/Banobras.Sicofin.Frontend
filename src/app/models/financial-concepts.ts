/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable, isEmpty } from '@app/core';


export interface FinancialConceptsGroup {
  uid: string;
  name: string;
  accountsChart: Identifiable;
  startDate: DateString;
  endDate: DateString;
  calculationRules: string[];
  dataColumns: string[];
  externalVariablesSets: Identifiable[];
}


export interface ExternalVariable {
  uid: string;
  code: string;
  name: string;
  notes: string;
  position: number;
  setUID: string;
}


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


export enum PositioningRule {
  AtStart = 'AtStart',
  BeforeOffset = 'BeforeOffset',
  AfterOffset = 'AfterOffset',
  AtEnd = 'AtEnd',
  ByPositionValue = 'ByPositionValue',
}


export const PositioningRuleList: Identifiable[] = [
  {uid: PositioningRule.AtStart,         name: 'Al principio'},
  {uid: PositioningRule.BeforeOffset,    name: 'Antes de'},
  {uid: PositioningRule.AfterOffset,     name: 'Despues de'},
  {uid: PositioningRule.AtEnd,           name: 'Al final'},
  {uid: PositioningRule.ByPositionValue, name: 'En posición'},
];


export interface FinancialConceptEditionCommand {
  financialConceptUID?: string;
  groupUID: string;
  code: string;
  name: string;
  positioningRule: PositioningRule;
  positioningOffsetConceptUID?: string;
  position?: number;
  startDate: DateString;
  endDate: DateString;
}


export enum FinancialConceptEntryType {
  Account = 'Account',
  ExternalVariable = 'ExternalVariable',
  FinancialConceptReference = 'FinancialConceptReference'
}


export const FinancialConceptEntryTypeList: Identifiable[] = [
  {uid: FinancialConceptEntryType.FinancialConceptReference, name: 'Referencia a concepto'},
  {uid: FinancialConceptEntryType.ExternalVariable,          name: 'Dato operativo'},
  {uid: FinancialConceptEntryType.Account,                   name: 'Cuenta'},
];


export function getFinancialConceptEntryTypeName(type: FinancialConceptEntryType): string {
  const financialConceptEntryType = FinancialConceptEntryTypeList.find(x => x.uid === type);
  return isEmpty(financialConceptEntryType) ? type : financialConceptEntryType.name;
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


export enum OperatorType {
  Add = 'Add',
  Substract = 'Substract',
  AbsoluteValue = 'AbsoluteValue'
}


export const OperatorTypeList: Identifiable[] = [
  {uid: OperatorType.Add,           name: '+'},
  {uid: OperatorType.Substract,     name: '-'},
  {uid: OperatorType.AbsoluteValue, name: 'Valor absoluto'},
];


export interface FinancialConceptEntryEditionCommand {
  financialConceptEntryUID?: string;
  financialConceptUID: string;
  entryType: FinancialConceptEntryType;
  referencedFinancialConceptUID?: string;
  externalVariableCode?: string;
  accountNumber?: string;
  subledgerAccountNumber?: string;
  sectorCode?: string;
  currencyCode?: string;
  operator: OperatorType;
  positioningRule: PositioningRule;
  positioningOffsetEntryUID?: string;
  position?: number;
  calculationRule: string;
  dataColumn: string;
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
