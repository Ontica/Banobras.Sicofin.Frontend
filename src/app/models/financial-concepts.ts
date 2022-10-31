/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, FlexibleIdentifiable, Identifiable, isEmpty } from '@app/core';

import { EditionCommand, EditionResult, Positioning, PositioningRule } from './edition-command';


export interface ExternalVariable {
  uid: string;
  code: string;
  name: string;
  notes: string;
  position: number;
  setUID: string;
}


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


export interface FinancialConceptQuery {
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
  integration: FinancialConceptEntryDescriptor[]
}


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
  {uid: FinancialConceptEntryType.ExternalVariable,          name: 'Valor externo'},
  {uid: FinancialConceptEntryType.Account,                   name: 'Cuenta'},
];


export function getFinancialConceptEntryTypeName(type: FinancialConceptEntryType): string {
  const financialConceptEntryType = FinancialConceptEntryTypeList.find(x => x.uid === type);
  return isEmpty(financialConceptEntryType) ? type : financialConceptEntryType.name;
}


export interface FinancialConceptEntryDescriptor {
  uid: string;
  type: FinancialConceptEntryType;
  itemName: string;
  itemCode: string;
  subledgerAccount: string;
  sectorCode: string;
  operator: string;
}


export interface FinancialConceptEntry {
  uid: string;
  type: FinancialConceptEntryType;
  referencedFinancialConcept: FinancialConcept;
  externalVariable: ExternalVariable;
  account: FlexibleIdentifiable;
  subledgerAccount: FlexibleIdentifiable;
  sectorCode: string;
  currencyCode: string;
  operator: string;
  calculationRule: string;
  dataColumn: string;
  positioning: Positioning;
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


export enum FinancialConceptEntryEditionType {
  InsertAccountRule          = 'InsertAccountRule',
  InsertConceptReferenceRule = 'InsertConceptReferenceRule',
  InsertExternalValueRule    = 'InsertExternalValueRule',
  UpdateAccountRule          = 'UpdateAccountRule',
  UpdateConceptReferenceRule = 'UpdateConceptReferenceRule',
  UpdateExternalValueRule    = 'UpdateExternalValueRule',
}


export interface FinancialConceptEntryEditionCommand extends EditionCommand {
  type: FinancialConceptEntryEditionType;
  dryRun: boolean;
  payload: FinancialConceptEntryFields;
}


export interface FinancialConceptEntryFields {
  referencedFinancialConceptUID?: string;
  externalVariableCode?: string;
  accountNumber?: string;
  subledgerAccountNumber?: string;
  sectorCode?: string;
  currencyCode?: string;
  operator: OperatorType;
  calculationRule: string;
  dataColumn: string;
  positioning?: Positioning;
}


export interface FinancialConceptEntryEditionResult extends EditionResult {
  command: FinancialConceptEntryEditionCommand;
  commited: boolean;
  outcome: FinancialConceptEntry;
  message: string;
  actions: string[];
  issues: string[];
  warnings: string[];
}


export const EmptyExternalVariable: ExternalVariable = {
  uid: '',
  code: '',
  name: '',
  notes: '',
  position: 1,
  setUID: '',
};


export const EmptyFinancialConceptQuery: FinancialConceptQuery = {
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
  referencedFinancialConcept: EmptyFinancialConcept,
  externalVariable: EmptyExternalVariable,
  account: Empty,
  subledgerAccount: Empty,
  sectorCode: '',
  currencyCode: '',
  operator: '',
  calculationRule: '',
  dataColumn: '',
  positioning: {rule: PositioningRule.AtEnd},
}
