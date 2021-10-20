/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

export type LayoutType = 'AccountingOperation' | 'AccountingDashboards' | 'AccountingCataloguesAndRules' |
                         'Management' | 'Unauthorized';


export interface Layout {
  name: LayoutType;
  views: View[];
  hint: string;
  defaultTitle: string;
}


export interface View {
  name: string;
  title: string;
  url: string;
  menuTitle?: string;
  disabled?: boolean;
}


export const DefaultView: View = {
  name: 'Default view',
  title: 'Default view',
  url: '/',
};
