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
  ROUTE_ACCOUNTING_DASHBOARDS = 'route-accounting-dashboards',
  ROUTE_ACCOUNTING_CATALOGUES_AND_RULES = 'route-accounting-catalogues-and-rules',
  ROUTE_SYSTEM_MANAGEMENT = 'route-system-management',

  FEATURE_DATABASE_IMPORT = 'feature-database-import',
  FEATURE_ACCOUNTING_CALENDARS_EDITION = 'feature-accounting-calendars-edition',
  FEATURE_EXTERNAL_PROCESS_EXECUTION = 'feature-external-process-execution',
}


export const ROUTES_LIBRARY = {

  // #region app-routing module

  operacion_contable: {
    permission: PermissionsLibrary.MODULE_ACCOUNTING_OPERATIONS,
    parent: '',
    path: 'operacion-contable'
  },
  tableros: {
    permission: PermissionsLibrary.MODULE_ACCOUNTING_DASHBOARDS,
    parent: '',
    path: 'tableros',
  },
  reglas_y_catalogos: {
    permission: PermissionsLibrary.MODULE_ACCOUNTING_CATALOGUES_AND_RULES,
    parent: '',
    path: 'reglas-y-catalogos',
  },
  administracion: {
    permission: PermissionsLibrary.MODULE_SYSTEM_MANAGEMENT,
    parent: '',
    path: 'administracion',
  },
  security: {
    parent: '',
    path: 'security',
  },

  unauthorized: {
    parent: '',
    path: 'unauthorized',
  },

  // #endregion

  // #region accounting-operation-routing module

  operacion_contable_mis_polizas_pendientes: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_OPERATIONS,
    parent: 'operacion-contable',
    path: 'mis-polizas-pendientes',
  },
  operacion_contable_mesa_de_control: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_OPERATIONS,
    parent: 'operacion-contable',
    path: 'mesa-de-control',
  },
  operacion_contable_polizas_en_libros: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_OPERATIONS,
    parent: 'operacion-contable',
    path: 'polizas-en-libros',
  },
  operacion_contable_todas_las_polizas: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_OPERATIONS,
    parent: 'operacion-contable',
    path: 'todas-las-polizas',
  },
  operacion_contable_volantes: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_OPERATIONS,
    parent: 'operacion-contable',
    path: 'volantes',
  },

  // #endregion

  // #region accounting-dashboards-routing module

  tableros_saldos_y_balanzas: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_DASHBOARDS,
    parent: 'tableros',
    path: 'saldos-y-balanzas',
  },
  tableros_reportes_regulatorios: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_DASHBOARDS,
    parent: 'tableros',
    path: 'reportes-regulatorios',
  },
  tableros_conciliaciones: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_DASHBOARDS,
    parent: 'tableros',
    path: 'conciliaciones',
  },
  tableros_reportes_operativos: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_DASHBOARDS,
    parent: 'tableros',
    path: 'reportes-operativos',
  },
  tableros_reportes_fiscales: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_DASHBOARDS,
    parent: 'tableros',
    path: 'reportes-fiscales',
  },

  // #endregion

  // #region accounting-catalogues-and-rules-routing module

  reglas_y_catalogos_catalogos_de_cuentas: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_CATALOGUES_AND_RULES,
    parent: 'reglas-y-catalogos',
    path: 'catalogos-de-cuentas',
  },
  reglas_y_catalogos_auxiliares: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_CATALOGUES_AND_RULES,
    parent: 'reglas-y-catalogos',
    path: 'auxiliares',
  },
  reglas_y_catalogos_datos_operacion: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_CATALOGUES_AND_RULES,
    parent: 'reglas-y-catalogos',
    path: 'datos-operacion',
  },
  reglas_y_catalogos_agrupaciones: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_CATALOGUES_AND_RULES,
    parent: 'reglas-y-catalogos',
    path: 'agrupaciones',
  },
  reglas_y_catalogos_configuracion_de_reportes: {
    permission: PermissionsLibrary.ROUTE_ACCOUNTING_CATALOGUES_AND_RULES,
    parent: 'reglas-y-catalogos',
    path: 'configuracion-de-reportes',
  },
  // #endregion

  // #region system-management-routing module

  administracion_generacion_de_saldos: {
    permission: PermissionsLibrary.ROUTE_SYSTEM_MANAGEMENT,
    parent: 'administracion',
    path: 'generacion-de-saldos',
  },
  administracion_tipos_de_cambio: {
    permission: PermissionsLibrary.ROUTE_SYSTEM_MANAGEMENT,
    parent: 'administracion',
    path: 'tipos-de-cambio',
  },
  administracion_panel_de_control: {
    permission: PermissionsLibrary.ROUTE_SYSTEM_MANAGEMENT,
    parent: 'administracion',
    path: 'panel-de-control',
  },

  // #endregion

  // #region security-routing module

  security_login: {
    parent: 'security',
    path: 'login',
  },

  // #endregion

};


export const DEFAULT_ROUTE = ROUTES_LIBRARY.tableros_saldos_y_balanzas;


export const DEFAULT_URL = ( DEFAULT_ROUTE.parent ? DEFAULT_ROUTE.parent + '/' : '' ) + DEFAULT_ROUTE.path;


export const UNAUTHORIZED_ROUTE = ROUTES_LIBRARY.unauthorized.path;


export const ROUTES_LIST = Object.keys(ROUTES_LIBRARY)
                                 .map(key => ROUTES_LIBRARY[key])
                                 .filter(x => x.parent && x.permission);
