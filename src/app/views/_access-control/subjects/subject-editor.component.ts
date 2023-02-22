/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { EmptySubject, Subject, SubjectFields } from '@app/models';

import { sendEvent } from '@app/shared/utils';

import { SubjectHeaderEventType } from './subject-header.component';

export enum SubjectEditorEventType {
  SUBJECT_UPDATED = 'SubjectEditorComponent.Event.SubjectUpdated',
}

@Component({
  selector: 'emp-ng-subject-editor',
  templateUrl: './subject-editor.component.html',
})
export class SubjectEditorComponent {

  @Input() subject: Subject = EmptySubject;

  @Output() subjectEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;

  get canEdit(): boolean {
    return false;
  }


  onSubjectHeaderEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as SubjectHeaderEventType) {

      case SubjectHeaderEventType.UPDATE_SUBJECT:
        Assertion.assertValue(event.payload.subject, 'event.payload.subject');
        this.updateSubject(event.payload.subject as SubjectFields);
        return;

      case SubjectHeaderEventType.SUSPEND_SUBJECT:
        this.suspendSubject();
        return;

      case SubjectHeaderEventType.ACTIVE_SUBJECT:
        this.activateSubject();
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private updateSubject(subjectFields: SubjectFields) {
    this.submitted = true;

    setTimeout(() => {
      sendEvent(this.subjectEditorEvent, SubjectEditorEventType.SUBJECT_UPDATED,
        {subject: subjectFields});
      this.submitted = false
    }, 200);
  }


  private activateSubject() {
    this.submitted = true;

    setTimeout(() => {
      sendEvent(this.subjectEditorEvent, SubjectEditorEventType.SUBJECT_UPDATED,
        {subject: this.subject});
      this.submitted = false
    }, 200);
  }


  private suspendSubject() {
    this.submitted = true;

    setTimeout(() => {
      sendEvent(this.subjectEditorEvent, SubjectEditorEventType.SUBJECT_UPDATED,
        {subject: this.subject});
      this.submitted = false
    }, 200);
  }

}
