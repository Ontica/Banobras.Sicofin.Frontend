/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ROUTES_LIBRARY } from '../config-data';

import { View, Layout } from '../common-models/common';

import {
  AccountingOperationViews,
  AccountingDashboardsViews,
  AccountingCataloguesAndRulesViews,
  AccountingSystemManagementViews,
  UnauthorizedViews
} from './views-config';


export const APP_VIEWS: View[] = AccountingOperationViews.concat(AccountingDashboardsViews,
                                                                 AccountingCataloguesAndRulesViews,
                                                                 AccountingSystemManagementViews,
                                                                 UnauthorizedViews);


export const APP_LAYOUTS: Layout[] = [
  {
    name: 'AccountingOperation',
    views: AccountingOperationViews,
    hint: 'Registro de pólizas y operación contable',
    defaultTitle: 'Pólizas',
    url: ROUTES_LIBRARY.operacion_contable.fullpath,
    permission: ROUTES_LIBRARY.operacion_contable.permission,
  },
  {
    name: 'AccountingDashboards',
    views: AccountingDashboardsViews,
    hint: 'Balanzas de comprobación y tableros de información contable',
    defaultTitle: 'Saldos y reportes',
    url: ROUTES_LIBRARY.tableros.fullpath,
    permission: ROUTES_LIBRARY.tableros.permission,

  },
  {
    name: 'AccountingCataloguesAndRules',
    views: AccountingCataloguesAndRulesViews,
    hint: 'Administración de reglas contabilizadoras, financieras, y catálogos de cuentas',
    defaultTitle: 'Reglas y catálogos',
    url: ROUTES_LIBRARY.reglas_y_catalogos.fullpath,
    permission: ROUTES_LIBRARY.reglas_y_catalogos.permission,
  },
  {
    name: 'Management',
    views: AccountingSystemManagementViews,
    hint: 'Herramientas de administración del sistema',
    defaultTitle: 'Administración',
    url: ROUTES_LIBRARY.administracion.fullpath,
    permission: ROUTES_LIBRARY.administracion.permission,
  },
  {
    name: 'Unauthorized',
    views: UnauthorizedViews,
    hint: '',
    defaultTitle: '401: Unauthorized',
    url: ROUTES_LIBRARY.unauthorized.fullpath,
  },
];
