/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Identifiable } from '@app/core';


export enum ExternalProcessTypes {
  Rentabilidad = 'procesar-rentabilidad',
  ConciliacionSIC = 'procesar-conciliacion-sic',
  ExportacionSaldosMensuales = 'procesar-exportacion-saldos-mensuales',
  ExportacionSaldosDiarios = 'procesar-exportacion-saldos-diarios',
}


export const ExternalProcessTypeList: Identifiable[] = [
  {
    uid: ExternalProcessTypes.Rentabilidad,
    name: 'Rentabilidad',
  },
  {
    uid: ExternalProcessTypes.ConciliacionSIC,
    name: 'Concilación de SIC',
  },
  {
    uid: ExternalProcessTypes.ExportacionSaldosMensuales,
    name: 'Exportación de saldos mensuales',
  },
  {
    uid: ExternalProcessTypes.ExportacionSaldosDiarios,
    name: 'Exportación de saldos diarios',
  },
];


export interface RentabilidadExternalProcessCommand {
   anio: number;
   mes: number;
   metodologia: number;
}


export interface ConcilacionSICExternalProcessCommand {
  fechaInicio: DateString;
  fechaFin: DateString;
}


export enum StoreBalancesInto {
  Diario = 'Diario',
  MensualPorContabilidad = 'MensualPorContabilidad',
  MensualConsolidado = 'MensualConsolidado'
}


export interface ExportBalancesCommand {
  storeInto: StoreBalancesInto;
  toDate: DateString;
}


export const StoreBalancesIntoForMonthlyExportList: Identifiable[] = [
  {uid: StoreBalancesInto.MensualPorContabilidad, name: 'Por contabilidad'},
  {uid: StoreBalancesInto.MensualConsolidado, name: 'Consolidado'},
];
