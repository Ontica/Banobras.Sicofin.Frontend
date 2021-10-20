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
  AccountingCataloguesAndRulesViews,
  AccountingSystemManagementViews,
  UnauthorizedViews
} from './views.config';


export const APP_VIEWS: View[] = AccountingOperationViews.concat(AccountingDashboardsViews,
                                                                 AccountingCataloguesAndRulesViews,
                                                                 AccountingSystemManagementViews,
                                                                 UnauthorizedViews);


export const APP_LAYOUTS: Layout[] = [
  {
    name: 'AccountingOperation',
    views: AccountingOperationViews,
    hint: 'Registro de pólizas y operación contable',
    defaultTitle: 'Pólizas'
  },
  {
    name: 'AccountingDashboards',
    views: AccountingDashboardsViews,
    hint: 'Balanzas de comprobación y tableros de información contable',
    defaultTitle: 'Saldos y reportes'
  },
  {
    name: 'AccountingCataloguesAndRules',
    views: AccountingCataloguesAndRulesViews,
    hint: 'Administración de reglas contabilizadoras, financieras, y catálogos de cuentas',
    defaultTitle: 'Reglas y catálogos'
  },
  {
    name: 'Management',
    views: AccountingSystemManagementViews,
    hint: 'Herramientas de administración del sistema',
    defaultTitle: 'Administración'
  },
  {
    name: 'Unauthorized',
    views: UnauthorizedViews,
    hint: '',
    defaultTitle: ''
  },
];
