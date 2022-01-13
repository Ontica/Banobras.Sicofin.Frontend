/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { PermissionsLibrary } from '@app/models';

@Component({
  selector: 'emp-fa-control-panel-main-page',
  templateUrl: './control-panel-main-page.component.html',
})
export class ControlPanelMainPageComponent {

  permissions = PermissionsLibrary;

  displayAccountingCalendarsEditor = false;

  displayExternalProcessesEditor = false;

}
