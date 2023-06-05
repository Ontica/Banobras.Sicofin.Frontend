/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, Validate } from '@app/core';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { AccessControlDataService } from '@app/data-services';

import { UpdateCredentialsFields} from '@app/models';

import { FormHelper } from '@app/shared/utils';


interface ChangePasswordFormModel extends FormGroup<{
  userID: FormControl<string>;
  currentPassword: FormControl<string>;
  newPassword: FormControl<string>;
  confirmNewPassword: FormControl<string>;
}> { }

interface IPaswordRules {
  minlengthRequired: boolean;
  upperRequired: boolean;
  lowerRequired: boolean;
  numberRequired: boolean;
  specialCharactersRequired: boolean;
  minlength: number;
}

const DefaultPaswordRules: IPaswordRules = {
  minlengthRequired: true,
  upperRequired: true,
  lowerRequired: true,
  numberRequired: true,
  specialCharactersRequired: true,
  minlength: 8,
};

@Component({
  selector: 'emp-ng-change-password-modal',
  templateUrl: './change-password-modal.component.html',
})
export class ChangePasswordModalComponent  {

  @Output() closeEvent = new EventEmitter<void>();

  form: ChangePasswordFormModel;

  formHelper = FormHelper;

  passwordRules: IPaswordRules = DefaultPaswordRules;

  showPassword = false;

  submitted = false;


  constructor(private accessControlData: AccessControlDataService,
              private messageBox: MessageBoxService) {
    this.initForm();
  }


  get newPasswordErrorsText(): string {
    const errors = this.getNewPasswordErrorsList();

    if (errors.length === 0) {
      return '';
    }

    const errorsText =
      [errors.slice(0, -1).join(', '), errors.slice(-1)[0]].join(errors.length < 2 ? '' : ' y ');

    return `La nueva contraseña debe contener ${errorsText}.`;
  }


  onClose() {
    this.closeEvent.emit();
  }


  onUpdateCredentialsClicked() {
    if (this.submitted) {
      return;
    }

    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      this.updateCredentialsToSubject();
    }
  }


  private updateCredentialsToSubject() {
    this.submitted = true;

    const command = this.getFormData();

    this.accessControlData.updateCredentialsToSubject(command)
      .toPromise()
      .then(x => {
        this.messageBox.show('La contraseña fue actualizada correctamente.', 'Cambiar contraseña');
        this.onClose();
      })
      .finally(() => this.submitted = false);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group(
      {
        userID: ['', Validators.required],
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmNewPassword: ['', Validators.required],
      },
      {
        validators: [Validate.matchOther('newPassword', 'confirmNewPassword')],
      },
    );

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

    this.formHelper.setControlValidators(this.form.controls.newPassword, validators);
  }


  private getNewPasswordErrorsList(): string[] {
    let rules: string[] = [];

    if (this.passwordRules.minlengthRequired &&
      (this.form.controls.newPassword.errors.required || this.form.controls.newPassword.errors.minlength)) {
      rules.push(`al menos ${this.passwordRules.minlength ?? 5} caracteres`);
    }

    if (this.passwordRules.upperRequired && this.form.controls.newPassword.errors.hasUpper) {
      rules.push('mayúsculas');
    }

    if (this.passwordRules.lowerRequired && this.form.controls.newPassword.errors.hasLower) {
      rules.push('minúsculas');
    }

    if (this.passwordRules.numberRequired && this.form.controls.newPassword.errors.hasNumber) {
      rules.push('números');
    }

    if (this.passwordRules.specialCharactersRequired &&
      this.form.controls.newPassword.errors.hasSpecialCharacters) {
      rules.push('caracteres especiales');
    }

    return rules;
  }


  private getFormData(): UpdateCredentialsFields {
    Assertion.assert(this.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: UpdateCredentialsFields = {
      userID: formModel.userID ?? '',
      currentPassword: formModel.currentPassword ?? '',
      newPassword: formModel.newPassword ?? '',
    };

    return data;
  }

}
