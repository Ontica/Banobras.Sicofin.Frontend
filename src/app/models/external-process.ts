/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Identifiable } from "@app/core";


export enum ExternalProcessTypes {
  Rentabilidad = 'procesar-rentabilidad',
}


export const ExternalProcessTypeList: Identifiable[] = [
  {
    uid: ExternalProcessTypes.Rentabilidad,
    name: 'Rentabilidad',
  },
];


export interface RentabilidadExternalProcessCommand {
   anio: number;
   mes: number;
   metodologia: number;
}
