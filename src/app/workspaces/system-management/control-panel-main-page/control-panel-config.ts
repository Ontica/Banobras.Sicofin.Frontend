/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ExternalProcessTypes, PermissionsLibrary } from '@app/models';


type ControlPanelOptionType = 'AccountingCalendars' |
                              'ExternalProcessRentabilidad' |
                              'ExternalProcessConciliacionSIC' |
                              'ExternalProcessExportacionSaldosMensuales' |
                              'ExternalProcessExportacionSaldosDiarios';



export interface ControlPanelOption {
  title: string;
  description: string;
  actionTitle: string;
  type: ControlPanelOptionType;
  permission: PermissionsLibrary;
  externalProcessType?: ExternalProcessTypes;
}


export const ControlPanelOptionList: ControlPanelOption[] = [
  {
    title: 'Períodos',
    description: 'Edición de fechas de los calendarios.' ,
    actionTitle: 'Períodos',
    type: 'AccountingCalendars',
    permission: PermissionsLibrary.FEATURE_ACCOUNTING_CALENDARS_EDITION,
  },
  {
    title: 'Rentabilidad',
    description: 'Ejecución de proceso de rentabilidad.' ,
    actionTitle: 'Rentabilidad',
    type: 'ExternalProcessRentabilidad',
    permission: PermissionsLibrary.FEATURE_EP_RENTABILIDAD,
    externalProcessType: ExternalProcessTypes.Rentabilidad,
  },
  {
    title: 'Conciliación de cartera',
    description: 'Ejecución de proceso de conciliación de cartera.' ,
    actionTitle: 'Conciliación',
    type: 'ExternalProcessConciliacionSIC',
    permission: PermissionsLibrary.FEATURE_EP_CONCILIACION_SIC,
    externalProcessType: ExternalProcessTypes.ConciliacionSIC,
  },
  {
    title: 'Exportación de saldos mensuales',
    description: 'Proceso de exportación de saldos mensuales.' ,
    actionTitle: 'Exportar',
    type: 'ExternalProcessExportacionSaldosMensuales',
    permission: PermissionsLibrary.FEATURE_EP_EXPORTACION_SALDOS_MENSUALES,
    externalProcessType: ExternalProcessTypes.ExportacionSaldosMensuales,
  },
  {
    title: 'Exportación de saldos diarios',
    description: 'Proceso de exportación de saldos diarios.' ,
    actionTitle: 'Exportar',
    type: 'ExternalProcessExportacionSaldosDiarios',
    permission: PermissionsLibrary.FEATURE_EP_EXPORTACION_SALDOS_DIARIOS,
    externalProcessType: ExternalProcessTypes.ExportacionSaldosDiarios,
  },
];
