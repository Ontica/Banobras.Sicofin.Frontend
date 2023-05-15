/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PERMISSIONS } from './permissions-config';

import { ROUTES } from './routes-config';

import { View } from '../common-models/common';


export const AccountingOperationViews: View[] = [
  {
    name: 'AccountingOperation.MyInbox',
    title: 'Mis pólizas pendientes',
    url: ROUTES.operacion_contable_mis_polizas_pendientes.fullpath,
    permission: ROUTES.operacion_contable_mis_polizas_pendientes.permission,
    actions: [
      { action: 'ActionImport', name: 'Importar pólizas', permission: PERMISSIONS.FEATURE_POLIZAS_IMPORTACION_DESDE_ARCHIVOS},
      { action: 'ActionCreate', name: 'Nueva póliza', permission: PERMISSIONS.FEATURE_POLIZAS_EDICION_MANUAL},
    ]
  },
  {
    name: 'AccountingOperation.ControlDesk',
    title: 'Mesa de control',
    menuTitle: 'Mesa de control',
    url: ROUTES.operacion_contable_mesa_de_control.fullpath,
    permission: ROUTES.operacion_contable_mesa_de_control.permission,
  },
  {
    name: 'AccountingOperation.Finished',
    title: 'Pólizas en libros',
    menuTitle: 'Pólizas en libros',
    url: ROUTES.operacion_contable_polizas_en_libros.fullpath,
    permission: ROUTES.operacion_contable_polizas_en_libros.permission,
  },
  {
    name: 'AccountingOperation.All',
    title: 'Todas las pólizas',
    menuTitle: 'Todas las pólizas',
    url: ROUTES.operacion_contable_todas_las_polizas.fullpath,
    permission: ROUTES.operacion_contable_todas_las_polizas.permission,
  },
  {
    name: 'AccountingOperation.TransactionSlips',
    title: 'Volantes',
    menuTitle: 'Volantes',
    url: ROUTES.operacion_contable_volantes.fullpath,
    permission: ROUTES.operacion_contable_volantes.permission,
  }
];


export const AccountingDashboardsViews: View[] = [
  {
    name: 'AccountingDashboards.AccountsBalancesAndTrialBalances',
    title: 'Saldos y balanzas',
    url: ROUTES.tableros_saldos_y_balanzas.fullpath,
    permission: ROUTES.tableros_saldos_y_balanzas.permission,
  },
  {
    name: 'AccountingDashboards.FinancialReports',
    title: 'Reportes regulatorios',
    url: ROUTES.tableros_reportes_regulatorios.fullpath,
    permission: ROUTES.tableros_reportes_regulatorios.permission,
  },
  {
    name: 'AccountingDashboards.OperationalReports',
    title: 'Reportes operativos',
    url: ROUTES.tableros_reportes_operativos.fullpath,
    permission: ROUTES.tableros_reportes_operativos.permission,
  },
  {
    name: 'AccountingDashboards.FiscalReports',
    title: 'Reportes fiscales',
    url: ROUTES.tableros_reportes_fiscales.fullpath,
    permission: ROUTES.tableros_reportes_fiscales.permission,
  },
  {
    name: 'AccountingDashboards.BalanceReconciliation',
    title: 'Conciliaciones',
    url: ROUTES.tableros_conciliaciones.fullpath,
    permission: ROUTES.tableros_conciliaciones.permission,
  },
];


export const AccountingCataloguesAndRulesViews: View[] = [
  {
    name: 'AccountingCataloguesAndRulesViews.AccountsChart',
    title: 'Catálogos de cuentas',
    url: ROUTES.reglas_y_catalogos_catalogos_de_cuentas.fullpath,
    permission: ROUTES.reglas_y_catalogos_catalogos_de_cuentas.permission,
  },
  {
    name: 'AccountingCataloguesAndRulesViews.SubledgerAccounts',
    title: 'Auxiliares',
    url: ROUTES.reglas_y_catalogos_auxiliares.fullpath,
    permission: ROUTES.reglas_y_catalogos_auxiliares.permission,
  },
  {
    name: 'AccountingCataloguesAndRulesViews.ExternalVariables',
    title: 'Valores externos',
    url: ROUTES.reglas_y_catalogos_valores_externos.fullpath,
    permission: ROUTES.reglas_y_catalogos_valores_externos.permission,
  },
  {
    name: 'AccountingCataloguesAndRulesViews.AccountsGroups',
    title: 'Agrupaciones',
    url: ROUTES.reglas_y_catalogos_agrupaciones.fullpath,
    permission: ROUTES.reglas_y_catalogos_agrupaciones.permission,
  },
  {
    name: 'AccountingCataloguesAndRulesViews.ReportsDesigner',
    title: 'Configuración de reportes',
    url: ROUTES.reglas_y_catalogos_configuracion_de_reportes.fullpath,
    permission: ROUTES.reglas_y_catalogos_configuracion_de_reportes.permission,
  },
];


export const AccountingSystemManagementViews: View[] = [
  {
    name: 'AccountingSystemManagementViews.ExchangeRates',
    title: 'Tipos de cambio',
    url: ROUTES.administracion_tipos_de_cambio.fullpath,
    permission: ROUTES.administracion_tipos_de_cambio.permission,
  },
  {
    name: 'AccountingSystemManagementViews.BalanceGeneration',
    title: 'Generación de saldos',
    url: ROUTES.administracion_generacion_de_saldos.fullpath,
    permission: ROUTES.administracion_generacion_de_saldos.permission,
  },
  {
    name: 'AccountingSystemManagementViews.ControlPanel',
    title: 'Panel de control',
    url: ROUTES.administracion_panel_de_control.fullpath,
    permission: ROUTES.administracion_panel_de_control.permission,
  },
  {
    name: 'AccountingSystemManagementViews.AccessControl',
    title: 'Control de accesos',
    url: ROUTES.administracion_control_de_accesos.fullpath,
    permission: ROUTES.administracion_control_de_accesos.permission,
  },
];


export const UnauthorizedViews: View[] = [
  {
    name: 'Unauthorized',
    title: '',
    url: ROUTES.unauthorized.fullpath,
  },
];
