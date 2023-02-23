/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EventInfo, SessionService } from '@app/core';

import { PermissionsLibrary } from '@app/main-layout';

import { AccessControlQueryType, AccessControlSelectionData, EmptyAccessControlSelectionData, Feature,
         Role, Subject } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum AccessControlTabbedViewEventType {
  CLOSE_BUTTON_CLICKED = 'AccessControlTabbedViewComponent.Event.CloseButtonClicked',
  UPDATED              = 'AccessControlTabbedViewComponent.Event.Updated',
  DELETED              = 'AccessControlTabbedViewComponent.Event.Deleted',
}

@Component({
  selector: 'emp-fa-access-control-tabbed-view',
  templateUrl: './access-control-tabbed-view.component.html',
})
export class AccessControlTabbedViewComponent implements OnInit {

  @Input() accessControlItem: AccessControlSelectionData = EmptyAccessControlSelectionData;

  @Output() accessControlTabbedViewEvent = new EventEmitter<EventInfo>();

  canEdit = true;

  AccessControlType = AccessControlQueryType;


  constructor(private session: SessionService){

  }


  ngOnInit() {
    this.setPermission();
  }


  get typeName(): string {
    switch (this.accessControlItem.type) {
      case AccessControlQueryType.Subjects: return 'Usuario';
      case AccessControlQueryType.Roles: return 'Rol';
      case AccessControlQueryType.Features: return 'Permiso';
      default: return this.accessControlItem.type;
    }
  }


  get titleText(): string {
    switch (this.accessControlItem.type) {
      case AccessControlQueryType.Subjects:
        return `(${this.subject.nickName}) ${this.subject.fullName}`;

      case AccessControlQueryType.Roles: return this.role.name;
      case AccessControlQueryType.Features: return this.feature.name;
      default: return '';
    }
  }


  get hintText(): string {
    switch (this.accessControlItem.type) {
      case AccessControlQueryType.Subjects:
        return `<span class="tag tag-small" style="margin-left: 0">${this.subject.status}</span>` +
          `<strong>${this.subject.workplace} &nbsp; &nbsp; | &nbsp; &nbsp;</strong>` +
          `${this.subject.businessID}`;

      case AccessControlQueryType.Roles:
      case AccessControlQueryType.Features:
        return `Información del ${this.typeName} seleccionado.`;
      default: return '';
    }
  }


  get subject(): Subject {
    return this.accessControlItem.item as Subject;
  }


  get role(): Role {
    return this.accessControlItem.item as Role;
  }


  get feature(): Feature {
    return this.accessControlItem.item as Feature;
  }


  onClose() {
    sendEvent(this.accessControlTabbedViewEvent, AccessControlTabbedViewEventType.CLOSE_BUTTON_CLICKED);
  }


  private setPermission() {
    this.canEdit = this.session.hasPermission(PermissionsLibrary.FEATURE_EDICION_CONTROL_DE_ACCESOS);
  }

}
