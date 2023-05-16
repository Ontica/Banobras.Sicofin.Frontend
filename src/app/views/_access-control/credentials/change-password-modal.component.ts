/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Assertion, Validate } from '@app/core';

import { FormHandler } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { AccessControlDataService } from '@app/data-services';

import { UpdateCredentialsFields} from '@app/models';


enum ChangePasswordModalFormControls {
  userID = 'userID',
  currentPassword = 'currentPassword',
  newPassword = 'newPassword',
  confirmNewPassword = 'confirmNewPassword',
}

interface PaswordRules {
  minlengthRequired: boolean;
  upperRequired: boolean;
  lowerRequired: boolean;
  numberRequired: boolean;
  specialCharactersRequired: boolean;
  minlength?: number;
}

@Component({
  selector: 'emp-ng-change-password-modal',
  templateUrl: './change-password-modal.component.html',
})
export class ChangePasswordModalComponent implements OnInit {

  @Output() closeEvent = new EventEmitter<void>();

  formHandler: FormHandler;

  controls = ChangePasswordModalFormControls;

  showPassword = false;

  submitted = false;

  passwordRules: PaswordRules = {
    minlengthRequired: true,
    upperRequired: true,
    lowerRequired: true,
    numberRequired: true,
    specialCharactersRequired: true,
    minlength: 8,
  };


  constructor(private accessControlData: AccessControlDataService,
              private messageBox: MessageBoxService) {
  }


  ngOnInit(): void {
    this.initForm();
  }


  get textInfo(): string {
    let rules: string[] = [];

    if (this.passwordRules.minlengthRequired &&
        (this.formHandler.getControl(this.controls.newPassword).errors?.required ||
         this.formHandler.getControl(this.controls.newPassword).errors?.minlength)) {
       rules.push(`al menos ${this.passwordRules.minlength ?? 5} caracteres`);
    }

    if (this.passwordRules.upperRequired &&
        this.formHandler.getControl(this.controls.newPassword).errors?.hasUpper) {
       rules.push('mayúsculas');
    }

    if (this.passwordRules.lowerRequired &&
        this.formHandler.getControl(this.controls.newPassword).errors?.hasLower) {
       rules.push('minúsculas');
    }

    if (this.passwordRules.numberRequired &&
        this.formHandler.getControl(this.controls.newPassword).errors?.hasNumber) {
       rules.push('números');
    }

    if (this.passwordRules.specialCharactersRequired &&
        this.formHandler.getControl(this.controls.newPassword).errors?.hasSpecialCharacters) {
       rules.push('caracteres especiales');
    }

    if (rules.length > 0) {
      let textInfo = 'La nueva contraseña debe contener ';
      textInfo += [rules.slice(0, -1).join(', '), rules.slice(-1)[0]].join(rules.length < 2 ? '' : ' y ');
      return textInfo + '.';
    } else {
      return '';
    }
  }


  onClose() {
    this.closeEvent.emit();
  }


  onUpdateCredentialsClicked() {
    if (this.submitted) {
      return;
    }

    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    this.updateCredentialsToSubject();
  }


  private updateCredentialsToSubject() {
    this.submitted = true;

    const command = this.getUpdateCredentialsFields();

    this.accessControlData.updateCredentialsToSubject(command)
      .toPromise()
      .then(x => {
        this.messageBox.show('La contraseña fue actualizada correctamente.', 'Cambiar contraseña');
        this.onClose();
      })
      .finally(() => this.submitted = false);
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new UntypedFormGroup({
        userID: new UntypedFormControl('', Validators.required),
        currentPassword: new UntypedFormControl('', [Validators.required]),
        newPassword: new UntypedFormControl('', [Validators.required]),
        confirmNewPassword: new UntypedFormControl('', [Validators.required]),
      },
      {
         validators: [Validate.matchOther(this.controls.newPassword, this.controls.confirmNewPassword)]
      }
    ));

    this.setNewPasswordValidators();
  }


  private setNewPasswordValidators() {
    let validators = [Validators.required];

    if (this.passwordRules.minlengthRequired) {
      validators.push(Validators.minLength(this.passwordRules.minlength ?? 5));
    }

    if (this.passwordRules.upperRequired) {
      validators.push(Validate.hasUpper);
    }

    if (this.passwordRules.lowerRequired) {
      validators.push(Validate.hasLower);
    }

    if (this.passwordRules.numberRequired) {
      validators.push(Validate.hasNumber);
    }

    if (this.passwordRules.specialCharactersRequired) {
      validators.push(Validate.hasSpecialCharacters);
    }

    this.formHandler.setControlValidators(this.controls.newPassword, validators);
  }


  private getUpdateCredentialsFields(): UpdateCredentialsFields {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: UpdateCredentialsFields = {
      userID: formModel.userID ?? '',
      currentPassword: formModel.currentPassword ?? '',
      newPassword: formModel.newPassword ?? '',
    };

    return data;
  }

}
