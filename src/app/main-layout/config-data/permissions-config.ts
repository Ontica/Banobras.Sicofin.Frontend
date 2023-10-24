/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */


export enum PERMISSIONS {

  //
  // DEFAULT
  //

  NOT_REQUIRED = 'permiso-no-requerido',

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
  FEATURE_POLIZAS_EXPORTAR_MOVIMIENTOS = 'feature-polizas-exportar-movimientos',

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

  // LISTAS DE CUENTAS
  ROUTE_LISTAS_DE_CUENTAS = 'route-listas-de-cuentas',

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

  // TIPOS DE CAMBIO
  ROUTE_TIPOS_CAMBIO = 'route-tipos-cambio',
  FEATURE_EDICION_TIPOS_CAMBIO = 'feature-edicion-tipos-cambio',

  // GENERACIÓN DE SALDOS
  ROUTE_GENERACION_DE_SALDOS = 'route-generacion-de-saldos',

  // PANEL DE CONTROL
  ROUTE_PANEL_CONTROL = 'route-panel-control',

  FEATURE_CHANGE_PASSWORD = 'feature-modificar-password',
  FEATURE_EDICION_PERIODOS = 'feature-edicion-periodos',
  FEATURE_RENTABILIDAD = 'feature-rentabilidad',
  FEATURE_CONCILIACION_SIC = 'feature-conciliacion-sic',
  FEATURE_EXPORTACION_SALDOS_MENSUALES = 'feature-exportacion-saldos-mensuales',
  FEATURE_EXPORTACION_SALDOS_DIARIOS = 'feature-exportacion-saldos-diarios',
  FEATURE_SALDOS_ENCERRADOS = 'feature-saldos-encerrados',
  FEATURE_SALDOS_ENCERRADOS_GENERAR_POLIZA = 'feature-saldos-encerrados-generar-poliza',
  FEATURE_BITACORAS_OPERACION = 'feature-bitacoras-operacion',

  // CONTROL DE ACCESOS
  ROUTE_CONTROL_DE_ACCESOS = 'route-control-de-accesos',
  FEATURE_EDICION_CONTROL_DE_ACCESOS = 'feature-edicion-control-de-accesos',
}


export const PERMISSION_NOT_REQUIRED = PERMISSIONS.NOT_REQUIRED;


export function getAllPermissions() {
    return Object.keys(PERMISSIONS)
                 .map(key => PERMISSIONS[key]);
}
