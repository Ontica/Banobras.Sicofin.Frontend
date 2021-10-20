/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export enum PermissionsLibrary {
  ROUTE_OPERACION_CONTABLE = 'route-operacion-contable',
  ROUTE_TABLEROS = 'route-tableros',
  ROUTE_REGLAS_Y_CATALOGOS = 'route-reglas-y-catalogos',
  ROUTE_ADMINISTRACION = 'route-administracion',
  MENU_OPERACION_CONTABLE = 'menu-operacion-contable',
  MENU_TABLEROS = 'menu-tableros',
  MENU_REGLAS_Y_CATALOGOS = 'menu-reglas-y-catalogos',
  MENU_ADMINISTRACION = 'menu-administracion',
  FEATURE_VOUCHERS_ADD = 'feature-vouchers-add',
}


export const ROUTES_LIBRARY = {

  // #region app-routing module

  operacion_contable: {
    permission: PermissionsLibrary.ROUTE_OPERACION_CONTABLE,
    parent: '',
    path: 'operacion-contable'
  },
  tableros: {
    permission: PermissionsLibrary.ROUTE_TABLEROS,
    parent: '',
    path: 'tableros',
  },
  reglas_y_catalogos: {
    permission: PermissionsLibrary.ROUTE_REGLAS_Y_CATALOGOS,
    parent: '',
    path: 'reglas-y-catalogos',
  },
  administracion: {
    permission: PermissionsLibrary.ROUTE_ADMINISTRACION,
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
    permission: PermissionsLibrary.ROUTE_OPERACION_CONTABLE,
    parent: 'operacion-contable',
    path: 'mis-polizas-pendientes',
  },
  operacion_contable_mesa_de_control: {
    permission: PermissionsLibrary.ROUTE_OPERACION_CONTABLE,
    parent: 'operacion-contable',
    path: 'mesa-de-control',
  },
  operacion_contable_polizas_en_libros: {
    permission: PermissionsLibrary.ROUTE_OPERACION_CONTABLE,
    parent: 'operacion-contable',
    path: 'polizas-en-libros',
  },
  operacion_contable_todos_los_polizas: {
    permission: PermissionsLibrary.ROUTE_OPERACION_CONTABLE,
    parent: 'operacion-contable',
    path: 'todas-las-polizas',
  },

  // #endregion

  // #region accounting-dashboards-routing module

  tableros_saldos_y_balanzas: {
    permission: PermissionsLibrary.ROUTE_TABLEROS,
    parent: 'tableros',
    path: 'saldos-y-balanzas',
  },
  tableros_reportes_regulatorios: {
    permission: PermissionsLibrary.ROUTE_TABLEROS,
    parent: 'tableros',
    path: 'reportes-regulatorios',
  },
  tableros_indicadores_financieros: {
    permission: PermissionsLibrary.ROUTE_TABLEROS,
    parent: 'tableros',
    path: 'indicadores-financieros',
  },
  tableros_alertas: {
    permission: PermissionsLibrary.ROUTE_TABLEROS,
    parent: 'tableros',
    path: 'alertas',
  },

  // #endregion

  // #region accounting-catalogues-and-rules-routing module

  reglas_y_catalogos_catalogos_de_cuentas: {
    permission: PermissionsLibrary.ROUTE_REGLAS_Y_CATALOGOS,
    parent: 'reglas-y-catalogos',
    path: 'catalogos-de-cuentas',
  },
  reglas_y_catalogos_auxiliares: {
    permission: PermissionsLibrary.ROUTE_REGLAS_Y_CATALOGOS,
    parent: 'reglas-y-catalogos',
    path: 'auxiliares',
  },
  reglas_y_catalogos_agrupaciones: {
    permission: PermissionsLibrary.ROUTE_REGLAS_Y_CATALOGOS,
    parent: 'reglas-y-catalogos',
    path: 'agrupaciones',
  },
  reglas_y_catalogos_configuracion_de_reportes: {
    permission: PermissionsLibrary.ROUTE_REGLAS_Y_CATALOGOS,
    parent: 'reglas-y-catalogos',
    path: 'configuracion-de-reportes',
  },
  reglas_y_catalogos_datos_operacion: {
    permission: PermissionsLibrary.ROUTE_REGLAS_Y_CATALOGOS,
    parent: 'reglas-y-catalogos',
    path: 'datos-operacion',
  },
  reglas_y_catalogos_reglas_contabilizadoras: {
    permission: PermissionsLibrary.ROUTE_REGLAS_Y_CATALOGOS,
    parent: 'reglas-y-catalogos',
    path: 'reglas-contabilizadoras',
  },
  // #endregion

  // #region system-management-routing module

  administracion_generacion_de_saldos: {
    permission: PermissionsLibrary.ROUTE_ADMINISTRACION,
    parent: 'administracion',
    path: 'generacion-de-saldos',
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


// data dummy
export function getPermissionsList() {
  return Object.keys(PermissionsLibrary)
               .map(key => PermissionsLibrary[key])
               .filter(x => !x.includes('reportes'));
}
