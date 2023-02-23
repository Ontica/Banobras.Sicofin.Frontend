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

  rolesList: Identifiable[] = [];

  featuresList: Identifiable[] = [];

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
      case SecurityItemEditionEventType.ASSIGN_ITEM: {
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        const contextUID = event.payload.itemUID;
        this.assignContextToSubject(this.subject.uid, contextUID);
        return;
      }

      case SecurityItemEditionEventType.REMOVE_ITEM:{
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');
        const contextUID = event.payload.itemUID;
        this.removeContextToSubject(this.subject.uid, contextUID);
        return;
      }

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubjectRolesEditionEvent(event: EventInfo) {
    switch (event.type as SecurityItemEditionEventType) {
      case SecurityItemEditionEventType.SELECTOR_CHANGED:
        this.validateLoadSubjectRolesByContext(event.payload.selectorUID ?? '');
        return;

      case SecurityItemEditionEventType.ASSIGN_ITEM: {
        Assertion.assertValue(event.payload.selectorUID, 'event.payload.selectorUID');
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');

        const contextUID = event.payload.selectorUID;
        const roleUID = event.payload.itemUID;

        this.assignRoleToSubject(this.subject.uid, contextUID, roleUID);
        return;
      }

      case SecurityItemEditionEventType.REMOVE_ITEM: {
        Assertion.assertValue(event.payload.selectorUID, 'event.payload.selectorUID');
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');

        const contextUID = event.payload.selectorUID;
        const roleUID = event.payload.itemUID;

        this.removeRoleToSubject(this.subject.uid, contextUID, roleUID);
        return;
      }

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onSubjectFeaturesEditionEvent(event: EventInfo) {
    switch (event.type as SecurityItemEditionEventType) {
      case SecurityItemEditionEventType.SELECTOR_CHANGED:
        this.validateLoadSubjectFeaturesByContext(event.payload.selectorUID ?? '');
        return;

      case SecurityItemEditionEventType.ASSIGN_ITEM: {
        Assertion.assertValue(event.payload.selectorUID, 'event.payload.selectorUID');
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');

        const contextUID = event.payload.selectorUID;
        const featureUID = event.payload.itemUID;

        this.assignFeatureToSubject(this.subject.uid, contextUID, featureUID);
        return;
      }

      case SecurityItemEditionEventType.REMOVE_ITEM: {
        Assertion.assertValue(event.payload.selectorUID, 'event.payload.selectorUID');
        Assertion.assertValue(event.payload.itemUID, 'event.payload.itemUID');

        const contextUID = event.payload.selectorUID;
        const featureUID = event.payload.itemUID;

        this.removeFeatureToSubject(this.subject.uid, contextUID, featureUID);
        return;
      }

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


  private getRolesByContext(contextUID: string) {
    this.accessControlData.getRolesByContext(contextUID)
      .toPromise()
      .then(x => this.rolesList = x);
  }


  private getFeaturesByContext(contextUID: string) {
    this.accessControlData.getFeaturesByContext(contextUID)
      .toPromise()
      .then(x => this.featuresList = x);
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


  private assignRoleToSubject(subjectUID: string, contextUID: string, roleUID: string) {
    this.submitted = true;

    this.accessControlData.assignRoleToSubject(subjectUID, contextUID, roleUID)
      .toPromise()
      .then(x => this.subjectRolesList = x)
      .finally(() => this.submitted = false);
  }


  private removeRoleToSubject(subjectUID: string, contextUID: string, roleUID: string) {
    this.submitted = true;

    this.accessControlData.removeRoleToSubject(subjectUID, contextUID, roleUID)
      .toPromise()
      .then(x => this.subjectRolesList = x)
      .finally(() => this.submitted = false);
  }


  private assignFeatureToSubject(subjectUID: string, contextUID: string, featureUID: string) {
    this.submitted = true;

    this.accessControlData.assignFeatureToSubject(subjectUID, contextUID, featureUID)
      .toPromise()
      .then(x => this.subjectFeaturesList = x)
      .finally(() => this.submitted = false);
  }


  private removeFeatureToSubject(subjectUID: string, contextUID: string, featureUID: string) {
    this.submitted = true;

    this.accessControlData.removeFeatureToSubject(subjectUID, contextUID, featureUID)
      .toPromise()
      .then(x => this.subjectFeaturesList = x)
      .finally(() => this.submitted = false);
  }



  private validateLoadSubjectRolesByContext(contextUID: string) {
    this.subjectRolesList = [];
    this.rolesList = []

    if (!contextUID) {
      this.isSubjectRolesExcecuted = false;
      return;
    }

    this.getSubjectRolesByContext(contextUID);
    this.getRolesByContext(contextUID);
  }


  private validateLoadSubjectFeaturesByContext(contextUID: string) {
    this.subjectFeaturesList = [];
    this.featuresList = [];

    if (!contextUID) {
      this.isSubjectFeaturesExcecuted = false;
      return;
    }

    this.getSubjectFeaturesByContext(contextUID);
    this.getFeaturesByContext(contextUID);
  }

}
