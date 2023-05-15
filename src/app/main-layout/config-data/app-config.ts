/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { AppConfig } from '../common-models/common';


export const APP_CONFIG: AppConfig = {
  data: {
    name: 'Sistema de Contabilidad Financiera',
    hint: 'Secretaría de Hacienda y Crédito Público',
    organization: 'Banco Nacional de Obras y Servicios Públicos S.N.C.',
    description: '',
  },
  security: {
    enablePermissions: true,
    encriptLocalStorageData: true,
  },
  layout: {
    displayNavbarHeader: false,
    displayMenuUser: false,
    displayChangeLanguage: false,
    displayChangePassword: false,
    displayAsideLeft: false,
    displaySubMenu: true,
    displayHeader: false,
    displayFooter: false,
  }
};
