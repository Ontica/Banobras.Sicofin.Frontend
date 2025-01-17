/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component } from '@angular/core';

import { of } from 'rxjs';

import { EmpObservable } from '@app/core';

import { MessageBoxService } from '@app/shared/services';

import { EditionResult } from '@app/models';


@Component({
  selector: 'emp-fa-confirm-edition-result-modal',
  template: '',
})
export class ConfirmEditionResultModalComponent {


  constructor(private messageBox: MessageBoxService) { }


  validateResult(result: EditionResult): EmpObservable<boolean> {
    if (this.hasError(result)) {
      this.showErrorMessage(result);
      return new EmpObservable(of(false));
    }

    if (this.hasActionsOrWarnings(result)) {
      return this.showConfirmMessage(result);
    }

    return new EmpObservable(of(true));
  }


  private hasError(result: EditionResult): boolean {
    return result.issues.length > 0;
  }


  private hasActionsOrWarnings(result: EditionResult): boolean {
    return result.actions.length > 0 || result.warnings.length > 0;
  }


  private showErrorMessage(result: EditionResult) {
    const message = `No es posible realizar la operación, ` +
      `ya que se detectaron los siguientes problemas: <br><br>` +
      '<ul class="info-list">' + result.issues.map(y => `<li>${y}</li>`).join('') + '</ul>';
    this.messageBox.showError(message);
  }


  private showConfirmMessage(result: EditionResult): EmpObservable<boolean> {
    let message = '';

    if (result.warnings.length > 0) {
      message = 'Se detectaron las siguientes advertencias: <br><br>' +
        '<ul class="info-list">' + result.warnings.map(y => '<li>' + y + '</li>').join('') + '</ul><br>';
    }

    if (result.actions.length > 0) {
      message = 'Se realizarán las siguientes acciones: <br><br>' +
        '<ul class="info-list">' + result.actions.map(y => '<li>' + y + '</li>').join('') + '</ul><br>';
    }

    message += `¿Continuo con la operación?`

    return new EmpObservable(this.messageBox.confirm(message, `Confirmar operación`));
  }

}
