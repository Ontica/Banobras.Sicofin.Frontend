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
