/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export enum PermissionsLibrary {

  //
  // EXPLORADOR DE SALDOS (HERRAMIENTA)
  //

  MODULE_EXPLORADOR_DE_SALDOS = 'module-explorador-de-saldos',

  FEATURE_ESTADO_DE_CUENTA = 'feature-estado-de-cuenta',

  //
  // POLIZAS
  //

  MODULE_OPERACIONES_CONTABLES = 'module-operaciones-contables',

  ROUTE_MESA_DE_CONTROL = 'route-mesa-de-control',
  ROUTE_POLIZAS_EN_LIBROS = 'route-polizas-en-libros',
  ROUTE_EDICION_DE_POLIZAS = 'route-edicion-de-polizas', // mis polizas pendientes y todas las polizas
  ROUTE_EXPLORADOR_DE_VOLANTES = 'route-explorador-de-volantes',

  FEATURE_POLIZAS_EDICION_MANUAL = 'feature-polizas-edicion-manual',
  FEATURE_POLIZAS_IMPORTACION_DESDE_ARCHIVOS = 'feature-polizas-importacion-desde-archivos',
  FEATURE_POLIZAS_IMPORTACION_SISTEMAS_TRANSVERSALES = 'feature-polizas-importacion-sistemas-transversales',

  FEATURE_POLIZAS_ENVIAR_AL_DIARIO = 'feature-polizas-enviar-al-diario',
  FEATURE_POLIZAS_ENVIAR_AL_SUPERVISOR = 'feature-polizas-enviar-al-supervisor',
  FEATURE_POLIZAS_REASIGNAR = 'feature-polizas-reasignar',
  FEATURE_POLIZAS_ELIMINAR = 'feature-polizas-eliminar',
  FEATURE_POLIZAS_IMPRIMIR = 'feature-polizas-imprimir',

  //
  // SALDOS Y REPORTES
  //

  MODULE_SALDOS_Y_REPORTES = 'module-saldos-y-reportes',

  ROUTE_SALDOS_Y_BALANZAS = 'route-saldos-y-balanzas',
  ROUTE_REPORTES_REGULATORIOS = 'route-reportes-regulatorios',
  ROUTE_REPORTES_OPERATIVOS = 'route-reportes-operativos',
  ROUTE_REPORTES_FISCALES = 'route-reportes-fiscales',

  // CONCILIACIONES
  ROUTE_CONCILIACIONES = 'route-conciliaciones',

  FEATURE_IMPORTACION_CONCILIACIONES = 'feature-importacion-conciliaciones',

  //
  // REGLAS Y CATALOGOS
  //

  MODULE_REGLAS_Y_CATALOGOS = 'module-reglas-y-catalogos',

  // CATÁLOGOS DE CUENTAS
  ROUTE_CATALOGOS_DE_CUENTAS = 'route-catalogos-de-cuentas',

  FEATURE_EDICION_CUENTAS = 'feature-edicion-cuentas',

  // AUXILIARES
  ROUTE_AUXILIARES = 'route-auxiliares',

  FEATURE_EDICION_AUXILIARES = 'feature-edicion-auxiliares',

  // VALORES EXTERNOS
  ROUTE_VALORES_EXTERNOS = 'route-valores-externos',

  FEATURE_EDICION_VARIABLES_EXTERNAS = 'feature-edicion-variables-externas',

  FEATURE_IMPORTACION_VALORES_EXTERNOS = 'feature-importacion-valores-externos',

  // AGRUPACIONES
  ROUTE_CONCEPTOS = 'route-conceptos',

  FEATURE_EDICION_CONCEPTOS = 'feature-edicion-conceptos',

  // CONFIGURACIÓN DE REPORTES
  ROUTE_CONFIGURACION_DE_REPORTES = 'route-configuracion-de-reportes',

  FEATURE_EDICION_REPORTES = 'feature-edicion-reportes',
  // FEATURE_DISEÑAR_REPORTES = 'feature-diseñar-reportes',

  //
  // ADMINISTRACION
  //

  MODULE_ADMINISTRACION_DE_SISTEMA = 'module-administracion-de-sistema',

  // PANEL DE CONTROL
  ROUTE_PANEL_CONTROL = 'route-panel-control',

  FEATURE_EDICION_PERIODOS = 'feature-edicion-periodos',
  FEATURE_RENTABILIDAD = 'feature-rentabilidad',
  FEATURE_CONCILIACION_SIC = 'feature-conciliacion-sic',
  FEATURE_EXPORTACION_SALDOS_MENSUALES = 'feature-exportacion-saldos-mensuales',
  FEATURE_EXPORTACION_SALDOS_DIARIOS = 'feature-exportacion-saldos-diarios',
  FEATURE_SALDOS_ENCERRADOS = 'feature-saldos-encerrados',
  FEATURE_SALDOS_ENCERRADOS_GENERAR_POLIZA = 'feature-saldos-encerrados-generar-poliza',

  // GENERACIÓN DE SALDOS
  ROUTE_GENERACION_DE_SALDOS = 'route-generacion-de-saldos',

  // TIPOS DE CAMBIO
  ROUTE_TIPOS_CAMBIO = 'route-tipos-cambio',
  FEATURE_EDICION_TIPOS_CAMBIO = 'feature-edicion-tipos-cambio',

  // USUARIOS Y PERMISOS
  ROUTE_USUARIOS_Y_PERMISOS = 'route-usuarios-y-permisos',
}


export const ROUTES_LIBRARY = {

  // #region app-routing module

  operacion_contable: {
    permission: PermissionsLibrary.MODULE_OPERACIONES_CONTABLES,
    parent: '',
    path: 'operacion-contable',
    fullpath: '/operacion-contable',
  },
  tableros: {
    permission: PermissionsLibrary.MODULE_SALDOS_Y_REPORTES,
    parent: '',
    path: 'tableros',
    fullpath: '/tableros',
  },
  reglas_y_catalogos: {
    permission: PermissionsLibrary.MODULE_REGLAS_Y_CATALOGOS,
    parent: '',
    path: 'reglas-y-catalogos',
    fullpath: '/reglas-y-catalogos',
  },
  administracion: {
    permission: PermissionsLibrary.MODULE_ADMINISTRACION_DE_SISTEMA,
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
    permission: PermissionsLibrary.ROUTE_EDICION_DE_POLIZAS,
    parent: 'operacion-contable',
    path: 'mis-polizas-pendientes',
    fullpath: '/operacion-contable/mis-polizas-pendientes',
  },
  operacion_contable_mesa_de_control: {
    permission: PermissionsLibrary.ROUTE_MESA_DE_CONTROL,
    parent: 'operacion-contable',
    path: 'mesa-de-control',
    fullpath: '/operacion-contable/mesa-de-control',
  },
  operacion_contable_polizas_en_libros: {
    permission: PermissionsLibrary.ROUTE_POLIZAS_EN_LIBROS,
    parent: 'operacion-contable',
    path: 'polizas-en-libros',
    fullpath: '/operacion-contable/polizas-en-libros',
  },
  operacion_contable_todas_las_polizas: {
    permission: PermissionsLibrary.ROUTE_EDICION_DE_POLIZAS,
    parent: 'operacion-contable',
    path: 'todas-las-polizas',
    fullpath: '/operacion-contable/todas-las-polizas',
  },
  operacion_contable_volantes: {
    permission: PermissionsLibrary.ROUTE_EXPLORADOR_DE_VOLANTES,
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
    permission: PermissionsLibrary.ROUTE_CATALOGOS_DE_CUENTAS,
    parent: 'reglas-y-catalogos',
    path: 'catalogos-de-cuentas',
    fullpath: '/reglas-y-catalogos/catalogos-de-cuentas',
  },
  reglas_y_catalogos_auxiliares: {
    permission: PermissionsLibrary.ROUTE_AUXILIARES,
    parent: 'reglas-y-catalogos',
    path: 'auxiliares',
    fullpath: '/reglas-y-catalogos/auxiliares',
  },
  reglas_y_catalogos_valores_externos: {
    permission: PermissionsLibrary.ROUTE_VALORES_EXTERNOS,
    parent: 'reglas-y-catalogos',
    path: 'valores-externos',
    fullpath: '/reglas-y-catalogos/valores-externos',
  },
  reglas_y_catalogos_agrupaciones: {
    permission: PermissionsLibrary.ROUTE_CONCEPTOS,
    parent: 'reglas-y-catalogos',
    path: 'agrupaciones',
    fullpath: '/reglas-y-catalogos/agrupaciones',
  },
  reglas_y_catalogos_configuracion_de_reportes: {
    permission: PermissionsLibrary.ROUTE_CONFIGURACION_DE_REPORTES,
    parent: 'reglas-y-catalogos',
    path: 'configuracion-de-reportes',
    fullpath: '/reglas-y-catalogos/configuracion-de-reportes',
  },

  // #endregion

  // #region system-management-routing module

  administracion_panel_de_control: {
    permission: PermissionsLibrary.ROUTE_PANEL_CONTROL,
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
    permission: PermissionsLibrary.ROUTE_TIPOS_CAMBIO,
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
