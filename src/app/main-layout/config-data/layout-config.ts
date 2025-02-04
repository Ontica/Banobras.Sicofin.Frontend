/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ROUTES } from './routes-config';

import { View, Layout } from '../common-models/common';

import {
  UnauthorizedViews,
  SystemManagementViews,
  AccountingOperationViews,
  AccountingDashboardsViews,
  AccountingCataloguesAndRulesViews,
} from './views-config';


export type LAYOUT_TYPE = 'SystemManagement' | 'Unauthorized' |
                          'AccountingOperation' | 'AccountingDashboards' | 'AccountingCataloguesAndRules';


export const APP_VIEWS: View[] = UnauthorizedViews.concat(AccountingOperationViews,
                                                          AccountingDashboardsViews,
                                                          AccountingCataloguesAndRulesViews,
                                                          SystemManagementViews);0


export const APP_LAYOUTS: Layout<LAYOUT_TYPE>[] = [
  {
    name: 'AccountingOperation',
    views: AccountingOperationViews,
    hint: 'Registro de pólizas y operación contable',
    defaultTitle: 'Pólizas',
    url: ROUTES.operacion_contable.fullpath,
    permission: ROUTES.operacion_contable.permission,
  },
  {
    name: 'AccountingDashboards',
    views: AccountingDashboardsViews,
    hint: 'Balanzas de comprobación y tableros de información contable',
    defaultTitle: 'Saldos y reportes',
    url: ROUTES.tableros.fullpath,
    permission: ROUTES.tableros.permission,

  },
  {
    name: 'AccountingCataloguesAndRules',
    views: AccountingCataloguesAndRulesViews,
    hint: 'Administración de reglas contabilizadoras, financieras, y catálogos de cuentas',
    defaultTitle: 'Reglas y catálogos',
    url: ROUTES.reglas_y_catalogos.fullpath,
    permission: ROUTES.reglas_y_catalogos.permission,
  },
  {
    name: 'SystemManagement',
    views: SystemManagementViews,
    hint: 'Herramientas de administración del sistema',
    defaultTitle: 'Administración',
    url: ROUTES.administracion.fullpath,
    permission: ROUTES.administracion.permission,
  },
  {
    name: 'Unauthorized',
    views: UnauthorizedViews,
    hint: '',
    defaultTitle: '401: Unauthorized',
    url: ROUTES.unauthorized.fullpath,
  },
];
