/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PERMISSIONS } from "./permissions-config";


export const ROUTES = {

  // #region app-routing module

  operacion_contable: {
    permission: PERMISSIONS.MODULE_OPERACIONES_CONTABLES,
    parent: '',
    path: 'operacion-contable',
    fullpath: '/operacion-contable',
  },
  tableros: {
    permission: PERMISSIONS.MODULE_SALDOS_Y_REPORTES,
    parent: '',
    path: 'tableros',
    fullpath: '/tableros',
  },
  reglas_y_catalogos: {
    permission: PERMISSIONS.MODULE_REGLAS_Y_CATALOGOS,
    parent: '',
    path: 'reglas-y-catalogos',
    fullpath: '/reglas-y-catalogos',
  },
  administracion: {
    permission: PERMISSIONS.MODULE_ADMINISTRACION_DE_SISTEMA,
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
    permission: PERMISSIONS.ROUTE_EDICION_DE_POLIZAS,
    parent: 'operacion-contable',
    path: 'mis-polizas-pendientes',
    fullpath: '/operacion-contable/mis-polizas-pendientes',
  },
  operacion_contable_mesa_de_control: {
    permission: PERMISSIONS.ROUTE_MESA_DE_CONTROL,
    parent: 'operacion-contable',
    path: 'mesa-de-control',
    fullpath: '/operacion-contable/mesa-de-control',
  },
  operacion_contable_polizas_en_libros: {
    permission: PERMISSIONS.ROUTE_POLIZAS_EN_LIBROS,
    parent: 'operacion-contable',
    path: 'polizas-en-libros',
    fullpath: '/operacion-contable/polizas-en-libros',
  },
  operacion_contable_todas_las_polizas: {
    permission: PERMISSIONS.ROUTE_EDICION_DE_POLIZAS,
    parent: 'operacion-contable',
    path: 'todas-las-polizas',
    fullpath: '/operacion-contable/todas-las-polizas',
  },
  operacion_contable_volantes: {
    permission: PERMISSIONS.ROUTE_EXPLORADOR_DE_VOLANTES,
    parent: 'operacion-contable',
    path: 'volantes',
    fullpath: '/operacion-contable/volantes',
  },

  // #endregion

  // #region accounting-dashboards-routing module

  tableros_saldos_y_balanzas: {
    permission: PERMISSIONS.ROUTE_SALDOS_Y_BALANZAS,
    parent: 'tableros',
    path: 'saldos-y-balanzas',
    fullpath: '/tableros/saldos-y-balanzas',
  },
  tableros_reportes_regulatorios: {
    permission: PERMISSIONS.ROUTE_REPORTES_REGULATORIOS,
    parent: 'tableros',
    path: 'reportes-regulatorios',
    fullpath: '/tableros/reportes-regulatorios',
  },
  tableros_conciliaciones: {
    permission: PERMISSIONS.ROUTE_CONCILIACIONES,
    parent: 'tableros',
    path: 'conciliaciones',
    fullpath: '/tableros/conciliaciones',
  },
  tableros_reportes_operativos: {
    permission: PERMISSIONS.ROUTE_REPORTES_OPERATIVOS,
    parent: 'tableros',
    path: 'reportes-operativos',
    fullpath: '/tableros/reportes-operativos',
  },
  tableros_reportes_fiscales: {
    permission: PERMISSIONS.ROUTE_REPORTES_FISCALES,
    parent: 'tableros',
    path: 'reportes-fiscales',
    fullpath: '/tableros/reportes-fiscales',
  },

  // #endregion

  // #region accounting-catalogues-and-rules-routing module

  reglas_y_catalogos_catalogos_de_cuentas: {
    permission: PERMISSIONS.ROUTE_CATALOGOS_DE_CUENTAS,
    parent: 'reglas-y-catalogos',
    path: 'catalogos-de-cuentas',
    fullpath: '/reglas-y-catalogos/catalogos-de-cuentas',
  },
  reglas_y_catalogos_auxiliares: {
    permission: PERMISSIONS.ROUTE_AUXILIARES,
    parent: 'reglas-y-catalogos',
    path: 'auxiliares',
    fullpath: '/reglas-y-catalogos/auxiliares',
  },
  reglas_y_catalogos_listas_de_cuentas: {
    permission: PERMISSIONS.ROUTE_LISTAS_DE_CUENTAS,
    parent: 'reglas-y-catalogos',
    path: 'listas-de-cuentas',
    fullpath: '/reglas-y-catalogos/listas-de-cuentas',
  },
  reglas_y_catalogos_valores_externos: {
    permission: PERMISSIONS.ROUTE_VALORES_EXTERNOS,
    parent: 'reglas-y-catalogos',
    path: 'valores-externos',
    fullpath: '/reglas-y-catalogos/valores-externos',
  },
  reglas_y_catalogos_agrupaciones: {
    permission: PERMISSIONS.ROUTE_CONCEPTOS,
    parent: 'reglas-y-catalogos',
    path: 'agrupaciones',
    fullpath: '/reglas-y-catalogos/agrupaciones',
  },
  reglas_y_catalogos_configuracion_de_reportes: {
    permission: PERMISSIONS.ROUTE_CONFIGURACION_DE_REPORTES,
    parent: 'reglas-y-catalogos',
    path: 'configuracion-de-reportes',
    fullpath: '/reglas-y-catalogos/configuracion-de-reportes',
  },

  // #endregion

  // #region system-management-routing module

  administracion_tipos_de_cambio: {
    permission: PERMISSIONS.ROUTE_TIPOS_CAMBIO,
    parent: 'administracion',
    path: 'tipos-de-cambio',
    fullpath: '/administracion/tipos-de-cambio',
  },
  administracion_generacion_de_saldos: {
    permission: PERMISSIONS.ROUTE_GENERACION_DE_SALDOS,
    parent: 'administracion',
    path: 'generacion-de-saldos',
    fullpath: '/administracion/generacion-de-saldos',
  },
  administracion_panel_de_control: {
    permission: PERMISSIONS.ROUTE_PANEL_CONTROL,
    parent: 'administracion',
    path: 'panel-de-control',
    fullpath: '/administracion/panel-de-control',
  },
  administracion_control_de_accesos: {
    permission: PERMISSIONS.ROUTE_CONTROL_DE_ACCESOS,
    parent: 'administracion',
    path: 'control-de-accesos',
    fullpath: '/administracion/control-de-accesos',
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


export const DEFAULT_ROUTE = ROUTES.tableros_saldos_y_balanzas;


export const DEFAULT_PATH = DEFAULT_ROUTE.fullpath;


export const LOGIN_PATH = ROUTES.security_login.fullpath;


export const UNAUTHORIZED_PATH = ROUTES.unauthorized.path;


export const ROUTES_LIST = Object.keys(ROUTES)
                                 .map(key => ROUTES[key])
                                 .filter(x => x.parent && x.permission);
