/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot } from '@angular/router';

import { SessionService } from '../general/session.service';


@Injectable()
export class SecurityGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router,
              private session: SessionService) { }


  canActivate() {
    return this.isAuthenticated();
  }


  canActivateChild(childRoute: ActivatedRouteSnapshot) {
    if (!this.isAuthenticated()) {
      return false;
    }

    if (!this.session.hasPermission(childRoute.data.permission)) {
      this.router.navigateByUrl('unauthorized');
      return false;
    }

    return true;
  }


  private isAuthenticated() {
    const principal = this.session.getPrincipal();

    if (!principal.isAuthenticated) {
      this.router.navigateByUrl('security/login');
      return false;
    }

    return true;
  }

}
