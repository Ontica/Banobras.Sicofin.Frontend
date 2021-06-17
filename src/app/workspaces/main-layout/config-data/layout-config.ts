/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { View, Layout } from '../common-models/common';

import {
  AccountingOperationViews,
  AccountingDashboardsViews,
  AccountingReportsViews,
  AccountingCataloguesAndRulesViews,
  AccountingSystemManagementViews
} from './views.config';


export type LayoutType = 'AccountingOperation' | 'AccountingDashboards' |
                         'AccountingReports' | 'AccountingCataloguesAndRules' | 'Management';


export const APP_VIEWS: View[] = AccountingOperationViews.concat(AccountingDashboardsViews,
                                                                 AccountingReportsViews,
                                                                 AccountingCataloguesAndRulesViews,
                                                                 AccountingSystemManagementViews);


export const APP_LAYOUTS: Layout[] = [
  {
    name: 'AccountingOperation',
    views: AccountingOperationViews,
    hint: 'Registro de volantes y operación contable',
    defaultTitle: 'Operación contable'
  },
  {
    name: 'AccountingDashboards',
    views: AccountingDashboardsViews,
    hint: 'Balanzas de comprobación y tableros de información contable',
    defaultTitle: 'Tableros de información contable'
  },
  {
    name: 'AccountingReports',
    views: AccountingReportsViews,
    hint: 'Reportes regulatorios y de operación contable',
    defaultTitle: 'Reportes financieros y contables'
  },
  {
    name: 'AccountingCataloguesAndRules',
    views: AccountingCataloguesAndRulesViews,
    hint: 'Administración de reglas contabilizadoras, financieras, y catálogos de cuentas',
    defaultTitle: 'Reglas contabilizadoras y catálogos de cuentas'
  },
  {
    name: 'Management',
    views: AccountingSystemManagementViews,
    hint: 'Herramientas de administración del sistema',
    defaultTitle: 'Administración del sistema'
  }
];
