/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { MessageBoxService } from '@app/shared/containers/message-box';


@Injectable()
export class ErrorMessageService {

  constructor(private messageBox: MessageBoxService,
              private router: Router) { }


  handleOfflineError() {
    this.displayConsoleMessage('OFFLINE ERROR', 'No hay conexión a Internet.');
    this.showErrorMessage('No hay conexión a Internet.');
  }


  handleClientSideError(error) {
    this.displayConsoleMessage('CLIENT SIDE ERROR', error.message);
    this.showErrorMessage(`Ocurrió un error de aplicación. Favor de consultar la consola para ver más detalles.`);
  }


  handleServerSideError(error, request?) {
    this.displayConsoleMessage('SERVER SIDE ERROR', `Status: ${error.status}.`, error.message);

    switch (error.status) {
      case 401:
        this.handle401Error();
        return;

      default:
        this.showErrorMessage(error.error.message, error.status);
    }
  }


  private displayConsoleMessage(errorType: string, message1: string, message2?: any) {
    console.log(` \n%c${errorType.toUpperCase()}: `, 'color:red', message1,
      (message2 ? ` \n\n${message2}\n` : ''));
  }


  private showErrorMessage(message: string, status?: string) {
    if (!this.messageBox.isOpen()) {
      const statusMessage = status ? `<strong>(${status})</strong>  ` : '';
      this.messageBox.showError(statusMessage + message);
    }
  }


  private handle401Error() {
    if (!this.messageBox.isOpen()) {
      this.messageBox.showError('La sesión ha expirado. Se requiere iniciar una nueva sesión para continuar.')
        .toPromise()
        .then(x => this.router.navigateByUrl('security/login'));
    }
  }

}
