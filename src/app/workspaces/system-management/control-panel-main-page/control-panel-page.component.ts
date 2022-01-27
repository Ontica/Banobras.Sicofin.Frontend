/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { ExternalProcessTypes } from '@app/models';

import { ControlPanelOption, ControlPanelOptionList } from './control-panel-config';


@Component({
  selector: 'emp-fa-control-panel-main-page',
  templateUrl: './control-panel-main-page.component.html',
})
export class ControlPanelMainPageComponent {

  displayAccountingCalendarsEditor = false;

  displayExternalProcessesEditor = false;

  controlPanelOptionList = ControlPanelOptionList;

  externalProcessType: ExternalProcessTypes = null;


  onClickControlPanelOption(option: ControlPanelOption) {
    switch (option.type) {
      case 'AccountingCalendars':
        this.displayAccountingCalendarsEditor = true;
        return;

      case 'ExternalProcessRentabilidad':
      case 'ExternalProcessConciliacionSIC':
        this.openExternalProcessesEditor(option.externalProcessType);
        return;

      default:
        console.log(`Unhandled user interface event ${option.type}`);
        return;
    }

  }


  onCloseExternalProcessSubmitterEvent() {
    this.closeExternalProcessesEditor();
  }


  private openExternalProcessesEditor(externalProcessType: ExternalProcessTypes) {
    this.displayExternalProcessesEditor = true;
    this.externalProcessType = externalProcessType;
  }


  private closeExternalProcessesEditor() {
    this.displayExternalProcessesEditor = false;
    this.externalProcessType = null;
  }

}
