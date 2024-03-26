/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { PERMISSIONS } from '@app/main-layout';

import { ExternalProcessTypes } from '@app/models';


type ControlPanelOptionType = 'ChangePassword' |
                              'AccountingCalendars' |
                              'ExternalProcessRentabilidad' |
                              'ExternalProcessConciliacionSIC' |
                              'ExternalProcessExportacionSaldosMensuales' |
                              'ExternalProcessExportacionSaldosDiarios' |
                              'LockedUpBalances' |
                              'OperationsLog';



export interface ControlPanelOption {
  title: string;
  description: string;
  actionTitle: string;
  type: ControlPanelOptionType;
  permission: PERMISSIONS;
  externalProcessType?: ExternalProcessTypes;
}


export const ControlPanelOptionList: ControlPanelOption[] = [
  {
    title: 'Cambiar contraseña',
    description: 'Herramienta para actualizar la contraseña de la cuenta de acceso.' ,
    actionTitle: 'Cambiar',
    type: 'ChangePassword',
    permission: PERMISSIONS.FEATURE_CHANGE_PASSWORD,
  },
  {
    title: 'Períodos',
    description: 'Herramienta para abrir y cerrar períodos contables.' ,
    actionTitle: 'Períodos',
    type: 'AccountingCalendars',
    permission: PERMISSIONS.FEATURE_EDICION_PERIODOS,
  },
  {
    title: 'Rentabilidad',
    description: 'Ejecución del proceso de rentabilidad.' ,
    actionTitle: 'Rentabilidad',
    type: 'ExternalProcessRentabilidad',
    permission: PERMISSIONS.FEATURE_RENTABILIDAD,
    externalProcessType: ExternalProcessTypes.Rentabilidad,
  },
  {
    title: 'Conciliación de cartera',
    description: 'Ejecución del proceso de conciliación de cartera.' ,
    actionTitle: 'Conciliación',
    type: 'ExternalProcessConciliacionSIC',
    permission: PERMISSIONS.FEATURE_CONCILIACION_SIC,
    externalProcessType: ExternalProcessTypes.ConciliacionSIC,
  },
  {
    title: 'Exportación de saldos mensuales',
    description: 'Proceso de exportación de saldos mensuales.' ,
    actionTitle: 'Exportar',
    type: 'ExternalProcessExportacionSaldosMensuales',
    permission: PERMISSIONS.FEATURE_EXPORTACION_SALDOS_MENSUALES,
    externalProcessType: ExternalProcessTypes.ExportacionSaldosMensuales,
  },
  {
    title: 'Exportación de saldos diarios',
    description: 'Proceso de exportación de saldos diarios.' ,
    actionTitle: 'Exportar',
    type: 'ExternalProcessExportacionSaldosDiarios',
    permission: PERMISSIONS.FEATURE_EXPORTACION_SALDOS_DIARIOS,
    externalProcessType: ExternalProcessTypes.ExportacionSaldosDiarios,
  },
  {
    title: 'Búsqueda de saldos encerrados',
    description: 'Herramienta de consulta y cancelación de saldos encerrados.' ,
    actionTitle: 'Buscar',
    type: 'LockedUpBalances',
    permission: PERMISSIONS.FEATURE_SALDOS_ENCERRADOS,
  },
  {
    title: 'Bitácoras de operación',
    description: 'Herramienta de generación y exportación de bitácoras de operación.',
    actionTitle: 'Generar',
    type: 'OperationsLog',
    permission: PERMISSIONS.FEATURE_BITACORAS_OPERACION,
  },
];
