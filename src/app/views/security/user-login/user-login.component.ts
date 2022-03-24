/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { AuthenticationService } from '@app/core';

import { APP_CONFIG } from '@app/main-layout';

type ShowPasswordMode = 'icon' | 'check';

@Component({
  selector: 'emp-ng-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {

  appLayoutData = APP_CONFIG.data;

  showPasswordModeSelected: ShowPasswordMode = 'check';

  showPassword = false;

  submitted = false;

  form = new FormGroup({
    userID: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  exceptionMsg: string;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    this.logout();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.form.invalid || this.submitted) {
      this.form.markAllAsTouched();
      return;
    }

    this.authenticate();
  }

  private authenticate() {
    this.submitted = true;

    this.authenticationService.login(this.form.value.userID, this.form.value.password)
      .then(
        x => this.router.navigate([x]),
        err => this.exceptionMsg = err
      )
      .finally(() => this.submitted = false);
  }


  private logout() {
    this.submitted = true;
    this.authenticationService.logout()
      .finally(() => this.submitted = false);
  }

}
