/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export enum PermissionsLibrary {
  MODULE_ACCOUNTING_OPERATIONS = 'module-accounting-operations',
  MODULE_ACCOUNTING_DASHBOARDS = 'module-accounting-dashboards',
  MODULE_ACCOUNTING_CATALOGUES_AND_RULES = 'module-accounting-catalogues-and-rules',
  MODULE_SYSTEM_MANAGEMENT = 'module-system-management',
  MODULE_BALANCE_EXPLORER = 'module-balance-explorer',

  ROUTE_ACCOUNTING_OPERATIONS = 'route-accounting-operations',

  ROUTE_SALDOS_Y_BALANZAS = 'route-saldos-y-balanzas',
  ROUTE_REPORTES_REGULATORIOS = 'route-reportes-regulatorios',
  ROUTE_CONCILIACIONES = 'route-conciliaciones',
  ROUTE_REPORTES_OPERATIVOS = 'route-reportes-operativos',
  ROUTE_REPORTES_FISCALES = 'route-reportes-fiscales',

  ROUTE_ACCOUNTING_CATALOGUES_AND_RULES = 'route-accounting-catalogues-and-rules',
  ROUTE_SYSTEM_MANAGEMENT = 'route-system-management',
  ROUTE_GENERACION_DE_SALDOS = 'route-generacion-de-saldos',

  FEATURE_DATABASE_IMPORT = 'feature-database-import',
  FEATURE_ACCOUNTING_CALENDARS_EDITION = 'feature-accounting-calendars-edition',
  FEATURE_EP_RENTABILIDAD = 'feature-ep-rentabilidad',
  FEATURE_EP_CONCILIACION_SIC = 'feature-ep-conciliacion-sic',
  FEATURE_EP_EXPORTACION_SALDOS_MENSUALES = 'feature-ep-exportacion-saldos-mensuales',
  FEATURE_EP_EXPORTACION_SALDOS_DIARIOS = 'feature-ep-exportacion-saldos-diarios',
}


export const ROUTES_LIBRARY = {

  // #region app-routing module

  operacion_contable: {
    permission: PermissionsLibrary.MODULE_ACCOUNTING_OPERATIONS,
    parent: '',
    path: 'operacion-contable',
    fullpath: '/operacion-contable',
  },
  tableros: {
    permission: PermissionsLibrary.MODULE_ACCOUNTING_DASHBOARDS,
    parent: '',
    path: 'tableros',
    fullpath: '/tableros',
  },
  reglas_y_catalogos: {
    permission: PermissionsLibrary.MODULE_ACCOUNTING_CATALOGUES_AND_RULES,
    parent: '',
    path: 'reglas-y-catalogos',
    fullpath: '/reglas-y-catalogos',
  },
  administracion: {
    permission: PermissionsLibrary.MODULE_SYSTEM_MANAGEMENT,
    parent: '',
    path: 'administracion',
    fullpath: '/administracion',
  },
  security: {
    parent: '',
    path: 'security',
    fullpath: '/security',
  },

  unauthorized: {
    parent: '',
    path: 'unauthorized',
    fullpath: '/unauthorized',
  },

  // #endregion

  // #region accounting-operation-routing module

  operacion_contable_mis_polizas_pendientes: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_OPERATIONS,
    parent: 'operacion-contable',
    path: 'mis-polizas-pendientes',
    fullpath: '/operacion-contable/mis-polizas-pendientes',
  },
  operacion_contable_mesa_de_control: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_OPERATIONS,
    parent: 'operacion-contable',
    path: 'mesa-de-control',
    fullpath: '/operacion-contable/mesa-de-control',
  },
  operacion_contable_polizas_en_libros: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_OPERATIONS,
    parent: 'operacion-contable',
    path: 'polizas-en-libros',
    fullpath: '/operacion-contable/polizas-en-libros',
  },
  operacion_contable_todas_las_polizas: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_OPERATIONS,
    parent: 'operacion-contable',
    path: 'todas-las-polizas',
    fullpath: '/operacion-contable/todas-las-polizas',
  },
  operacion_contable_volantes: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_OPERATIONS,
    parent: 'operacion-contable',
    path: 'volantes',
    fullpath: '/operacion-contable/volantes',
  },

  // #endregion

  // #region accounting-dashboards-routing module

  tableros_saldos_y_balanzas: {
    permission: PermissionsLibrary.ROUTE_SALDOS_Y_BALANZAS,
    parent: 'tableros',
    path: 'saldos-y-balanzas',
    fullpath: '/tableros/saldos-y-balanzas',
  },
  tableros_reportes_regulatorios: {
    permission: PermissionsLibrary.ROUTE_REPORTES_REGULATORIOS,
    parent: 'tableros',
    path: 'reportes-regulatorios',
    fullpath: '/tableros/reportes-regulatorios',
  },
  tableros_conciliaciones: {
    permission: PermissionsLibrary.ROUTE_CONCILIACIONES,
    parent: 'tableros',
    path: 'conciliaciones',
    fullpath: '/tableros/conciliaciones',
  },
  tableros_reportes_operativos: {
    permission: PermissionsLibrary.ROUTE_REPORTES_OPERATIVOS,
    parent: 'tableros',
    path: 'reportes-operativos',
    fullpath: '/tableros/reportes-operativos',
  },
  tableros_reportes_fiscales: {
    permission: PermissionsLibrary.ROUTE_REPORTES_FISCALES,
    parent: 'tableros',
    path: 'reportes-fiscales',
    fullpath: '/tableros/reportes-fiscales',
  },

  // #endregion

  // #region accounting-catalogues-and-rules-routing module

  reglas_y_catalogos_catalogos_de_cuentas: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_CATALOGUES_AND_RULES,
    parent: 'reglas-y-catalogos',
    path: 'catalogos-de-cuentas',
    fullpath: '/reglas-y-catalogos/catalogos-de-cuentas',
  },
  reglas_y_catalogos_auxiliares: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_CATALOGUES_AND_RULES,
    parent: 'reglas-y-catalogos',
    path: 'auxiliares',
    fullpath: '/reglas-y-catalogos/auxiliares',
  },
  reglas_y_catalogos_datos_operacion: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_CATALOGUES_AND_RULES,
    parent: 'reglas-y-catalogos',
    path: 'datos-operacion',
    fullpath: '/reglas-y-catalogos/datos-operacion',
  },
  reglas_y_catalogos_agrupaciones: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_CATALOGUES_AND_RULES,
    parent: 'reglas-y-catalogos',
    path: 'agrupaciones',
    fullpath: '/reglas-y-catalogos/agrupaciones',
  },
  reglas_y_catalogos_configuracion_de_reportes: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_CATALOGUES_AND_RULES,
    parent: 'reglas-y-catalogos',
    path: 'configuracion-de-reportes',
    fullpath: '/reglas-y-catalogos/configuracion-de-reportes',
  },
  // #endregion

  // #region system-management-routing module

  administracion_panel_de_control: {
    permission: PermissionsLibrary.ROUTE_SYSTEM_MANAGEMENT,
    parent: 'administracion',
    path: 'panel-de-control',
    fullpath: '/administracion/panel-de-control',
  },
  administracion_generacion_de_saldos: {
    permission: PermissionsLibrary.ROUTE_GENERACION_DE_SALDOS,
    parent: 'administracion',
    path: 'generacion-de-saldos',
    fullpath: '/administracion/generacion-de-saldos',
  },
  administracion_tipos_de_cambio: {
    permission: PermissionsLibrary.ROUTE_SYSTEM_MANAGEMENT,
    parent: 'administracion',
    path: 'tipos-de-cambio',
    fullpath: '/administracion/tipos-de-cambio',
  },

  // #endregion

  // #region security-routing module

  security_login: {
    parent: 'security',
    path: 'login',
    fullpath: '/security/login'
  },

  // #endregion

};


export const DEFAULT_ROUTE = ROUTES_LIBRARY.tableros_saldos_y_balanzas;


export const DEFAULT_URL = ( DEFAULT_ROUTE.parent ? DEFAULT_ROUTE.parent + '/' : '' ) + DEFAULT_ROUTE.path;


export const UNAUTHORIZED_ROUTE = ROUTES_LIBRARY.unauthorized.path;


export const ROUTES_LIST = Object.keys(ROUTES_LIBRARY)
                                 .map(key => ROUTES_LIBRARY[key])
                                 .filter(x => x.parent && x.permission);

export function getAllPermissions() {
    return Object.keys(PermissionsLibrary)
                 .map(key => PermissionsLibrary[key]);
}
