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

  displayChangePasswordModal = false;

  displayAccountingCalendarsEditor = false;

  displayLockedUpBalancesModal = false;

  displayExternalProcessesEditor = false;

  displayOperationsLogModal = false;

  controlPanelOptionList = ControlPanelOptionList;

  externalProcessType: ExternalProcessTypes = null;


  onClickControlPanelOption(option: ControlPanelOption) {
    switch (option.type) {
      case 'ChangePassword':
        this.displayChangePasswordModal = true;
        return;

      case 'AccountingCalendars':
        this.displayAccountingCalendarsEditor = true;
        return;

      case 'ExternalProcessRentabilidad':
      case 'ExternalProcessConciliacionSIC':
      case 'ExternalProcessExportacionSaldosMensuales':
      case 'ExternalProcessExportacionSaldosDiarios':
        this.openExternalProcessesEditor(option.externalProcessType);
        return;

      case 'LockedUpBalances':
        this.displayLockedUpBalancesModal = true;
        return;

      case 'OperationsLog':
        this.displayOperationsLogModal = true;
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
