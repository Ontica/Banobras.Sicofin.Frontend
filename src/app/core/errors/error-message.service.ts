/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { CLIENT_SIDE_ERROR_MESSAGE, INVALID_CREDENTIALS_MESSAGE, OFFLINE_ERROR_MESSAGE,
         SESSION_EXPIRED_MESSAGE } from './error-messages';


@Injectable()
export class ErrorMessageService {

  constructor(private messageBox: MessageBoxService,
              private router: Router) { }


  handleOfflineError() {
    this.displayConsoleMessage('OFFLINE ERROR', OFFLINE_ERROR_MESSAGE);
    this.showErrorMessage(OFFLINE_ERROR_MESSAGE);
  }


  handleClientSideError(error) {
    this.displayConsoleMessage('CLIENT SIDE ERROR', error.message);
    this.showErrorMessage(CLIENT_SIDE_ERROR_MESSAGE);
  }


  handleServerSideError(error, request?) {
    this.displayConsoleMessage('SERVER SIDE ERROR', `Status: ${error.status}.`, error.message);

    switch (error.status) {
      case 401:
        this.handle401Error(error.error.request.withCredentials ?? false);
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


  private handle401Error(withCredentials) {
    const errorMessage = withCredentials ? SESSION_EXPIRED_MESSAGE : INVALID_CREDENTIALS_MESSAGE;

    if (!this.messageBox.isOpen()) {
      this.messageBox.showError(errorMessage)
        .toPromise()
        .then(x => this.validateRedirectToLogin(withCredentials));
    }
  }


  private validateRedirectToLogin(withCredentials: boolean) {
    if (withCredentials) {
      this.router.navigateByUrl('security/login');
    }
  }

}
