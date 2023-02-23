/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccessControlStateSelector } from '@app/presentation/exported.presentation.types';

import { AccessControlDataService } from '@app/data-services';

import { EmptySubject, SecurityItemType, Subject } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { SecurityItemEditionEventType } from '../security-item/security-item-edition.component';

export enum SubjectTabbedViewEventType {
  SUBJECT_UPDATED = 'SubjectTabbedViewComponent.Event.SubjectUpdated',
}

@Component({
  selector: 'emp-ng-subject-tabbed-view',
  templateUrl: './subject-tabbed-view.component.html',
})
export class SubjectTabbedViewComponent implements OnChanges, OnInit, OnDestroy {

  @Input() subject: Subject = EmptySubject;

  @Input() canEdit = true;

  @Output() subjectTabbedViewEvent = new EventEmitter<EventInfo>();

  contextsList: Identifiable[] = [];

  subjectContextsList: Identifiable[] = [];

  subjectRolesList: Identifiable[] = [];

  subjectFeaturesList: Identifiable[] = [];

  submitted = false;

  isLoading = false;

  isLoadingContexts = false;

  isSubjectRolesExcecuted = false;

  isSubjectFeaturesExcecuted = false;

  securityItemType = SecurityItemType;

  helper: SubscriptionHelper;


  constructor(private accessControlData: AccessControlDataService,
              private messageBox: MessageBoxService,
              private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
  }


  ngOnChanges() {
    this.resetData()
    this.getSubjectContexts();
  }


  ngOnInit() {
    this.loadContexts();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  onSubjectContextsEditionEvent(event: EventInfo) {
    switch (event.type as SecurityItemEditionEventType) {
      case SecurityItemEditionEventType.ASSIGN_ITEM:
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        this.assignContextToSubject(this.subject.uid, event.payload.itemUID);
        return;

      case SecurityItemEditionEventType.REMOVE_ITEM:
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        this.removeContextToSubject(this.subject.uid, event.payload.itemUID);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubjectRolesEditionEvent(event: EventInfo) {
    switch (event.type as SecurityItemEditionEventType) {
      case SecurityItemEditionEventType.FILTER_CHANGED:
        this.validateExecuteGetSubjectRolesByContext(event.payload.itemUID ?? '');
        return;

      case SecurityItemEditionEventType.ASSIGN_ITEM:
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        this.messageBox.showInDevelopment('Agregar rol a usuario', event.payload);
        return;

      case SecurityItemEditionEventType.REMOVE_ITEM:
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        this.messageBox.showInDevelopment('Remover rol a usuario', event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubjectFeaturesEditionEvent(event: EventInfo) {
    switch (event.type as SecurityItemEditionEventType) {
      case SecurityItemEditionEventType.FILTER_CHANGED:
        this.validateExecuteGetSubjectFeaturesByContext(event.payload.itemUID ?? '');
        return;

      case SecurityItemEditionEventType.ASSIGN_ITEM:
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        this.messageBox.showInDevelopment('Agregar permiso a usuario', event.payload);
        return;

      case SecurityItemEditionEventType.REMOVE_ITEM:
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        this.messageBox.showInDevelopment('Remover permiso a usuario', event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private resetData() {
    this.subjectContextsList = [];
    this.subjectRolesList = [];
    this.subjectFeaturesList = [];

    this.isSubjectRolesExcecuted = false;
    this.isSubjectFeaturesExcecuted = false;
  }


  private loadContexts() {
    this.isLoadingContexts = true;

    this.helper.select<Identifiable[]>(AccessControlStateSelector.CONTEXTS_LIST)
      .subscribe(x => {
        this.contextsList = x;
        this.isLoadingContexts = false;
      });
  }


  private getSubjectContexts() {
    this.isLoading = true;

    this.accessControlData.getSubjectContexts(this.subject.uid)
      .toPromise()
      .then(x => this.subjectContextsList = x)
      .finally(() => this.isLoading = false);
  }


  private getSubjectRolesByContext(contextUID: string) {
    this.isLoading = true;

    this.accessControlData.getSubjectRolesByContext(this.subject.uid, contextUID)
      .toPromise()
      .then(x => this.subjectRolesList = x)
      .finally(() => {
        this.isLoading = false;
        this.isSubjectRolesExcecuted = true;
      });
  }


  private getSubjectFeaturesByContext(contextUID: string) {
    this.isLoading = true;

    this.accessControlData.getSubjectFeaturesByContext(this.subject.uid, contextUID)
      .toPromise()
      .then(x => this.subjectFeaturesList = x)
      .finally(() => {
        this.isLoading = false;
        this.isSubjectFeaturesExcecuted = true;
      });
  }


  private assignContextToSubject(subjectUID: string, contextUID: string) {
    this.submitted = true;

    this.accessControlData.assignContextToSubject(subjectUID, contextUID)
      .toPromise()
      .then(x => this.subjectContextsList = x)
      .finally(() => this.submitted = false);
  }


  private removeContextToSubject(subjectUID: string, contextUID: string) {
    this.submitted = true;

    this.accessControlData.removeContextToSubject(subjectUID, contextUID)
      .toPromise()
      .then(x => this.subjectContextsList = x)
      .finally(() => this.submitted = false);
  }



  private validateExecuteGetSubjectRolesByContext(contextUID: string) {
    this.subjectRolesList = [];

    if (!contextUID) {
      this.isSubjectRolesExcecuted = false;
      return;
    }

    this.getSubjectRolesByContext(contextUID);
  }


  private validateExecuteGetSubjectFeaturesByContext(contextUID: string) {
    this.subjectFeaturesList = [];

    if (!contextUID) {
      this.isSubjectFeaturesExcecuted = false;
      return;
    }

    this.getSubjectFeaturesByContext(contextUID);
  }

}
