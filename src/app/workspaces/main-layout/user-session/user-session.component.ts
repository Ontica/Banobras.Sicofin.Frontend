/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, OnInit } from '@angular/core';

import { SessionService } from '@app/core';

import { Principal } from '@app/core/security/principal';


@Component({
  selector: 'emp-ng-user-session',
  templateUrl: './user-session.component.html',
  styleUrls: ['./user-session.component.scss']
})
export class UserSessionComponent implements OnInit {

  principal: Principal = Principal.empty;

  constructor(private session: SessionService) {}

  ngOnInit(): void {
    this.principal = this.session.getPrincipal();
  }

}
