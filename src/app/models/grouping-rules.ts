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
}


export const DefaultGroupingRulesColumns: DataTableColumn[] = [
  {
    field: 'code',
    title: 'Clave',
    type: 'text',
  },
  {
    field: 'concept',
    title: 'Concepto',
    type: 'text',
  },
];


export const EmptyGroupingRuleCommand: GroupingRuleCommand = {
  accountsChartUID: '',
  rulesSetUID: '',
  date: '',
};


export const EmptyGroupingRule: DataTable = {
  command: EmptyGroupingRuleCommand,
  columns: DefaultGroupingRulesColumns,
  entries: [],
};
