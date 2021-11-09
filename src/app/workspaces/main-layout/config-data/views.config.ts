/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { View } from '../common-models/common';


export const AccountingOperationViews: View[] = [
  {
    name: 'AccountingOperation.MyInbox',
    title: 'Mis pólizas pendientes',
    url: '/operacion-contable/mis-polizas-pendientes'
  },
  {
    name: 'AccountingOperation.ControlDesk',
    title: 'Mesa de control',
    menuTitle: 'Mesa de control',
    url: '/operacion-contable/mesa-de-control'
  },
  {
    name: 'AccountingOperation.Finished',
    title: 'Pólizas en libros',
    menuTitle: 'Pólizas en libros',
    url: '/operacion-contable/polizas-en-libros'
  },
  {
    name: 'AccountingOperation.All',
    title: 'Todas las pólizas',
    menuTitle: 'Todas las pólizas',
    url: '/operacion-contable/todas-las-polizas'
  }
];


export const AccountingDashboardsViews: View[] = [
  {
    name: 'AccountingDashboards.AccountsBalancesAndTrialBalances',
    title: 'Saldos y balanzas',
    url: '/tableros/saldos-y-balanzas'
  },
  {
    name: 'AccountingDashboards.AccountGroupsBalances',
    title: 'Reportes regulatorios',
    url: '/tableros/reportes-regulatorios'
  },
  {
    name: 'AccountingDashboards.OperationalReports',
    title: 'Reportes operativos',
    url: '/tableros/reportes-operativos'
  },
  {
    name: 'AccountingDashboards.FinancialReports',
    title: 'Reportes fiscales',
    url: '/tableros/reportes-fiscales'
  },
  // {
  //   name: 'AccountingDashboards.FinancialFacts',
  //   title: 'Indicadores financieros',
  //   url: '/tableros/indicadores-financieros'
  // },
  // {
  //   name: 'AccountingDashboards.Alerts',
  //   title: 'Alertas',
  //   url: '/tableros/alertas'
  // }
];


export const AccountingCataloguesAndRulesViews: View[] = [
  {
    name: 'AccountingCataloguesAndRulesViews.AccountsChart',
    title: 'Catálogos de cuentas',
    url: '/reglas-y-catalogos/catalogos-de-cuentas'
  },
  {
    name: 'AccountingCataloguesAndRulesViews.SubledgerAccounts',
    title: 'Auxiliares',
    url: '/reglas-y-catalogos/auxiliares'
  },
  {
    name: 'AccountingCataloguesAndRulesViews.OperationsData',
    title: 'Datos operación',
    url: '/reglas-y-catalogos/datos-operacion'
  },
  {
    name: 'AccountingCataloguesAndRulesViews.AccountsGroups',
    title: 'Agrupaciones',
    url: '/reglas-y-catalogos/agrupaciones'
  },
  {
    name: 'AccountingCataloguesAndRulesViews.ReportsDesigner',
    title: 'Configuración de reportes',
    url: '/reglas-y-catalogos/configuracion-de-reportes'
  }
  // {
  //   name: 'AccountingCataloguesAndRulesViews.AccountingRules',
  //   title: 'Reglas contabilizadoras',
  //   url: '/reglas-y-catalogos/reglas-contabilizadoras'
  // },
];


export const AccountingSystemManagementViews: View[] = [
  {
    name: 'AccountingSystemManagementViews.BalanceGeneration',
    title: 'Generación de saldos',
    url: '/administracion/generacion-de-saldos'
  }
];


export const UnauthorizedViews: View[] = [
  {
    name: 'Unauthorized',
    title: '',
    url: '/unauthorized'
  },
];
