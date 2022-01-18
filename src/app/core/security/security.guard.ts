/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Injectable } from '@angular/core';

import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot,
         NavigationEnd } from '@angular/router';

import { filter, take } from 'rxjs/operators';

import { SessionService } from '../general/session.service';


@Injectable()
export class SecurityGuard implements CanActivate, CanActivateChild {

  isRoutingInitialized = false;

  constructor(private router: Router,
              private session: SessionService) {
    this.initRouting();
  }


  canActivate() {
    return this.isAuthenticated();
  }


  canActivateChild(childRoute: ActivatedRouteSnapshot) {
    if (!this.isAuthenticated()) {
      return false;
    }

    if (!!childRoute.data.permission && !this.session.hasPermission(childRoute.data.permission)) {
      const firstValidRouteInModule = this.isRoutingInitialized ?
        this.session.getFirstValidRouteInModule(childRoute.data.permission) : null;

      this.router.navigateByUrl(firstValidRouteInModule ?? 'unauthorized');

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


  private initRouting() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), take(1))
      .subscribe((events: NavigationEnd) => this.isRoutingInitialized = !!events.urlAfterRedirects);
  }

}
