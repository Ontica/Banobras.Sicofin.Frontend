/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Layout, View, ViewAction } from './common';

import { MenuItem, createMenuItemForView } from './menu-item';


export interface NavigationHeader {
  title: string;
  hint: string;
  mainMenu: MenuItem[];
  actions: ViewAction[];
}


export const DefaultNavigationHeader: NavigationHeader = {
  title: '',
  hint: '',
  mainMenu: [],
  actions: [],
};


export function buildNavigationHeader(layout: Layout,
                                      permissions: string[],
                                      value?: NavigationHeader | View): NavigationHeader {
  const navHeader: NavigationHeader = {
    title: value.title || layout.defaultTitle,
    hint: layout.hint,
    mainMenu: [],
    actions: value.actions,
  };

  for (const view of layout.views) {
    const menuItem = createMenuItemForView(view);

    if (permissions.includes(view.permission)) {
      navHeader.mainMenu.push(menuItem);
    }
  }

  return navHeader;
}
