/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString } from '@app/core';

import { DataTable, DataTableColumn } from './data-table';


export interface GroupingRuleCommand {
  accountsChartUID: string;
  rulesSetUID?: string;
  date?: DateString;
}


export interface GroupingRule {
  uid: string;
  code: string;
  concept: string;
  position: number;
  level: number;
  parentUID: string;
  accountsChartName: string;
  rulesSetName: string;
}


export interface GroupingRuleDataTable extends DataTable {
  command: GroupingRuleCommand;
  entries: GroupingRule[];
}


export const DefaultGroupingRulesColumns: DataTableColumn[] = [
  {
    field: 'code',
    title: 'Clave',
    type: 'text-nowrap',
  },
  {
    field: 'concept',
    title: 'Concepto',
    type: 'text',
  },
];


export enum GroupingRuleItemType {
  Agrupation = 'Agrupation',
  Account = 'Account',
  FixedValue = 'FixedValue',
}


export interface GroupingRuleItem {
  uid: string;
  type: GroupingRuleItemType;
  itemName: string;
  itemCode: string;
  subledgerAccount: string;
  sectorCode: string;
  operator: string;
}


export const EmptyGroupingRuleCommand: GroupingRuleCommand = {
  accountsChartUID: '',
  rulesSetUID: '',
  date: '',
};


export const EmptyGroupingRuleDataTable: GroupingRuleDataTable = {
  command: EmptyGroupingRuleCommand,
  columns: DefaultGroupingRulesColumns,
  entries: [],
};


export const EmptyGroupingRule: GroupingRule = {
  uid: '',
  code: '',
  concept: '',
  position: 0,
  level: 0,
  parentUID: '',
  accountsChartName: '',
  rulesSetName: '',
};
