/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { ROUTES_LIBRARY } from '@app/models';

import { LayoutType } from '../common-models';

import { APP_LAYOUTS } from '../config-data';

@Component({
  selector: 'emp-ng-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {

  routes = ROUTES_LIBRARY;

  getMenuTitleFromLayoutType(layoutType: LayoutType): string {
    const layout = APP_LAYOUTS.filter(x => x.name === layoutType).shift();
    return layout?.defaultTitle.toUpperCase();
  }


  getUrlFromRoutePath(path: string): string {
    return '/' + path;
  }

}
