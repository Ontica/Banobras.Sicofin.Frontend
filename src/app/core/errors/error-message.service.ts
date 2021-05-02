/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';
import { MessageBoxService } from '@app/shared/containers/message-box';


@Injectable()
export class ErrorMessageService {

  constructor(private messageBox: MessageBoxService) { }

  handleOfflineError() {
    this.showErrorMessage('Sin conexión a Internet', '');
  }

  handleClientSideError(error) {
    this.showErrorMessage(error.message || 'Ocurrió un error de aplicación indefinido.');
  }

  handleServerSideError(error, request?) {

    switch (error.status) {
      case 400:
        this.handle400Error(error);
        return;

      case 404:
        this.handle404Error(error);
        return;

      case 500:
        this.handle500Error(error);
        return;

      default:
        this.handleOtherError(error);
    }

  }

  private handle400Error(error) {
    this.showErrorMessage(error.error.message, error.status);
  }

  private handle404Error(error) {
    this.showErrorMessage(error.error.message, error.status);
  }

  private handle500Error(error) {
    this.showErrorMessage(error.error.message, error.status);
  }

  private handleOtherError(error) {
    this.showErrorMessage(error.error.message, error.status);
  }

  private showErrorMessage(message: string, status?: string) {
    const statusMessage = status ? `<strong>(${status})</strong>  ` : '';
    this.messageBox.showError(statusMessage + message);
  }

}
