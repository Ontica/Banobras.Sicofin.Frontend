/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PermissionsLibrary as Permissions, ROUTES_LIBRARY } from './permissions-config';

import { View } from '../common-models/common';


export const AccountingOperationViews: View[] = [
  {
    name: 'AccountingOperation.MyInbox',
    title: 'Mis pólizas pendientes',
    url: ROUTES_LIBRARY.operacion_contable_mis_polizas_pendientes.fullpath,
    permission: ROUTES_LIBRARY.operacion_contable_mis_polizas_pendientes.permission,
    actions: [
      {action: 'ActionImport', name: 'Importar pólizas', permission: Permissions.FEATURE_POLIZAS_IMPORTACION_DESDE_ARCHIVOS},
      {action: 'ActionCreate', name: 'Nueva póliza', permission: Permissions.FEATURE_POLIZAS_EDICION_MANUAL},
    ]
  },
  {
    name: 'AccountingOperation.ControlDesk',
    title: 'Mesa de control',
    menuTitle: 'Mesa de control',
    url: ROUTES_LIBRARY.operacion_contable_mesa_de_control.fullpath,
    permission: ROUTES_LIBRARY.operacion_contable_mesa_de_control.permission,
  },
  {
    name: 'AccountingOperation.Finished',
    title: 'Pólizas en libros',
    menuTitle: 'Pólizas en libros',
    url: ROUTES_LIBRARY.operacion_contable_polizas_en_libros.fullpath,
    permission: ROUTES_LIBRARY.operacion_contable_polizas_en_libros.permission,
  },
  {
    name: 'AccountingOperation.All',
    title: 'Todas las pólizas',
    menuTitle: 'Todas las pólizas',
    url: ROUTES_LIBRARY.operacion_contable_todas_las_polizas.fullpath,
    permission: ROUTES_LIBRARY.operacion_contable_todas_las_polizas.permission,
  },
  {
    name: 'AccountingOperation.TransactionSlips',
    title: 'Volantes',
    menuTitle: 'Volantes',
    url: ROUTES_LIBRARY.operacion_contable_volantes.fullpath,
    permission: ROUTES_LIBRARY.operacion_contable_volantes.permission,
  }
];


export const AccountingDashboardsViews: View[] = [
  {
    name: 'AccountingDashboards.AccountsBalancesAndTrialBalances',
    title: 'Saldos y balanzas',
    url: ROUTES_LIBRARY.tableros_saldos_y_balanzas.fullpath,
    permission: ROUTES_LIBRARY.tableros_saldos_y_balanzas.permission,
  },
  {
    name: 'AccountingDashboards.FinancialReports',
    title: 'Reportes regulatorios',
    url: ROUTES_LIBRARY.tableros_reportes_regulatorios.fullpath,
    permission: ROUTES_LIBRARY.tableros_reportes_regulatorios.permission,
  },
  {
    name: 'AccountingDashboards.OperationalReports',
    title: 'Reportes operativos',
    url: ROUTES_LIBRARY.tableros_reportes_operativos.fullpath,
    permission: ROUTES_LIBRARY.tableros_reportes_operativos.permission,
  },
  {
    name: 'AccountingDashboards.FiscalReports',
    title: 'Reportes fiscales',
    url: ROUTES_LIBRARY.tableros_reportes_fiscales.fullpath,
    permission: ROUTES_LIBRARY.tableros_reportes_fiscales.permission,
  },
  {
    name: 'AccountingDashboards.BalanceReconciliation',
    title: 'Conciliaciones',
    url: ROUTES_LIBRARY.tableros_conciliaciones.fullpath,
    permission: ROUTES_LIBRARY.tableros_conciliaciones.permission,
  },
];


export const AccountingCataloguesAndRulesViews: View[] = [
  {
    name: 'AccountingCataloguesAndRulesViews.AccountsChart',
    title: 'Catálogos de cuentas',
    url: ROUTES_LIBRARY.reglas_y_catalogos_catalogos_de_cuentas.fullpath,
    permission: ROUTES_LIBRARY.reglas_y_catalogos_catalogos_de_cuentas.permission,
  },
  {
    name: 'AccountingCataloguesAndRulesViews.SubledgerAccounts',
    title: 'Auxiliares',
    url: ROUTES_LIBRARY.reglas_y_catalogos_auxiliares.fullpath,
    permission: ROUTES_LIBRARY.reglas_y_catalogos_auxiliares.permission,
  },
  {
    name: 'AccountingCataloguesAndRulesViews.ExternalVariables',
    title: 'Valores externos',
    url: ROUTES_LIBRARY.reglas_y_catalogos_valores_externos.fullpath,
    permission: ROUTES_LIBRARY.reglas_y_catalogos_valores_externos.permission,
  },
  {
    name: 'AccountingCataloguesAndRulesViews.AccountsGroups',
    title: 'Agrupaciones',
    url: ROUTES_LIBRARY.reglas_y_catalogos_agrupaciones.fullpath,
    permission: ROUTES_LIBRARY.reglas_y_catalogos_agrupaciones.permission,
  },
  {
    name: 'AccountingCataloguesAndRulesViews.ReportsDesigner',
    title: 'Configuración de reportes',
    url: ROUTES_LIBRARY.reglas_y_catalogos_configuracion_de_reportes.fullpath,
    permission: ROUTES_LIBRARY.reglas_y_catalogos_configuracion_de_reportes.permission,
  },
];


export const AccountingSystemManagementViews: View[] = [
  {
    name: 'AccountingSystemManagementViews.ControlPanel',
    title: 'Panel de control',
    url: ROUTES_LIBRARY.administracion_panel_de_control.fullpath,
    permission: ROUTES_LIBRARY.administracion_panel_de_control.permission,
  },
  {
    name: 'AccountingSystemManagementViews.BalanceGeneration',
    title: 'Generación de saldos',
    url: ROUTES_LIBRARY.administracion_generacion_de_saldos.fullpath,
    permission: ROUTES_LIBRARY.administracion_generacion_de_saldos.permission,
  },
  {
    name: 'AccountingSystemManagementViews.ExchangeRates',
    title: 'Tipos de cambio',
    url: ROUTES_LIBRARY.administracion_tipos_de_cambio.fullpath,
    permission: ROUTES_LIBRARY.administracion_tipos_de_cambio.permission,
  },
  {
    name: 'AccountingSystemManagementViews.AccessControl',
    title: 'Control de accesos',
    url: ROUTES_LIBRARY.administracion_control_de_accesos.fullpath,
    permission: ROUTES_LIBRARY.administracion_control_de_accesos.permission,
  },
];


export const UnauthorizedViews: View[] = [
  {
    name: 'Unauthorized',
    title: '',
    url: ROUTES_LIBRARY.unauthorized.fullpath,
  },
];
