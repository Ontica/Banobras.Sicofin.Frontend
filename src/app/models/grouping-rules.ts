/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DataTable, DataTableColumn } from './data-table';


export interface GroupingRuleCommand {
  accountsChartUID: string;
  rulesSetUID?: string;
  date?: string;
}


export function getEmptyGroupingRuleCommand(): GroupingRuleCommand {
  return {
    accountsChartUID: '',
    rulesSetUID: '',
    date: '',
  };
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


export const EmptyGroupingRule: DataTable = {
  command: getEmptyGroupingRuleCommand(),
  columns: DefaultGroupingRulesColumns,
  entries: [],
};
