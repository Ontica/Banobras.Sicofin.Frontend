/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ROUTES_LIBRARY } from '@app/models';

import { View } from '../common-models/common';


export const AccountingOperationViews: View[] = [
  {
    name: 'AccountingOperation.MyInbox',
    title: 'Mis pólizas pendientes',
    url: '/operacion-contable/mis-polizas-pendientes',
    permission: ROUTES_LIBRARY.operacion_contable_mis_polizas_pendientes.permission,
  },
  {
    name: 'AccountingOperation.ControlDesk',
    title: 'Mesa de control',
    menuTitle: 'Mesa de control',
    url: '/operacion-contable/mesa-de-control',
    permission: ROUTES_LIBRARY.operacion_contable_mesa_de_control.permission,
  },
  {
    name: 'AccountingOperation.Finished',
    title: 'Pólizas en libros',
    menuTitle: 'Pólizas en libros',
    url: '/operacion-contable/polizas-en-libros',
    permission: ROUTES_LIBRARY.operacion_contable_polizas_en_libros.permission,
  },
  {
    name: 'AccountingOperation.All',
    title: 'Todas las pólizas',
    menuTitle: 'Todas las pólizas',
    url: '/operacion-contable/todas-las-polizas',
    permission: ROUTES_LIBRARY.operacion_contable_todas_las_polizas.permission,
  },
  {
    name: 'AccountingOperation.TransactionSlips',
    title: 'Volantes',
    menuTitle: 'Volantes',
    url: '/operacion-contable/volantes',
    permission: ROUTES_LIBRARY.operacion_contable_volantes.permission,
  }
];


export const AccountingDashboardsViews: View[] = [
  {
    name: 'AccountingDashboards.AccountsBalancesAndTrialBalances',
    title: 'Saldos y balanzas',
    url: '/tableros/saldos-y-balanzas',
    permission: ROUTES_LIBRARY.tableros_saldos_y_balanzas.permission,
  },
  {
    name: 'AccountingDashboards.AccountGroupsBalances',
    title: 'Reportes regulatorios',
    url: '/tableros/reportes-regulatorios',
    permission: ROUTES_LIBRARY.tableros_reportes_regulatorios.permission,
  },
  {
    name: 'AccountingDashboards.BalanceReconciliation',
    title: 'Conciliaciones',
    url: '/tableros/conciliaciones',
    permission: ROUTES_LIBRARY.tableros_conciliaciones.permission,
  },
  {
    name: 'AccountingDashboards.OperationalReports',
    title: 'Reportes operativos',
    url: '/tableros/reportes-operativos',
    permission: ROUTES_LIBRARY.tableros_reportes_operativos.permission,
  },
  {
    name: 'AccountingDashboards.FinancialReports',
    title: 'Reportes fiscales',
    url: '/tableros/reportes-fiscales',
    permission: ROUTES_LIBRARY.tableros_reportes_fiscales.permission,
  },
];


export const AccountingCataloguesAndRulesViews: View[] = [
  {
    name: 'AccountingCataloguesAndRulesViews.AccountsChart',
    title: 'Catálogos de cuentas',
    url: '/reglas-y-catalogos/catalogos-de-cuentas',
    permission: ROUTES_LIBRARY.reglas_y_catalogos_catalogos_de_cuentas.permission,
  },
  {
    name: 'AccountingCataloguesAndRulesViews.SubledgerAccounts',
    title: 'Auxiliares',
    url: '/reglas-y-catalogos/auxiliares',
    permission: ROUTES_LIBRARY.reglas_y_catalogos_auxiliares.permission,
  },
  {
    name: 'AccountingCataloguesAndRulesViews.OperationsData',
    title: 'Datos operación',
    url: '/reglas-y-catalogos/datos-operacion',
    permission: ROUTES_LIBRARY.reglas_y_catalogos_datos_operacion.permission,
  },
  {
    name: 'AccountingCataloguesAndRulesViews.AccountsGroups',
    title: 'Agrupaciones',
    url: '/reglas-y-catalogos/agrupaciones',
    permission: ROUTES_LIBRARY.reglas_y_catalogos_agrupaciones.permission,
  },
  {
    name: 'AccountingCataloguesAndRulesViews.ReportsDesigner',
    title: 'Configuración de reportes',
    url: '/reglas-y-catalogos/configuracion-de-reportes',
    permission: ROUTES_LIBRARY.reglas_y_catalogos_configuracion_de_reportes.permission,
  },
];


export const AccountingSystemManagementViews: View[] = [
  {
    name: 'AccountingSystemManagementViews.BalanceGeneration',
    title: 'Generación de saldos',
    url: '/administracion/generacion-de-saldos',
    permission: ROUTES_LIBRARY.administracion_generacion_de_saldos.permission,
  },
  {
    name: 'AccountingSystemManagementViews.ControlPanel',
    title: 'Panel de control',
    url: '/administracion/panel-de-control',
    permission: ROUTES_LIBRARY.administracion_panel_de_control.permission,
  }
];


export const UnauthorizedViews: View[] = [
  {
    name: 'Unauthorized',
    title: '',
    url: '/unauthorized'
  },
];
