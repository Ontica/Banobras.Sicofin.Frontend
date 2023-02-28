/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { EmptySubject, Subject } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

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

  @Input() canEdit = false;

  @Input() canGeneratePassword = false;

  @Input() isSuspended = false;

  @Output() subjectEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private messageBox: MessageBoxService) {

  }


  onSubjectHeaderEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as SubjectHeaderEventType) {
      case SubjectHeaderEventType.GENERATE_PASSWORD:
        this.generatePasswordToSubject();
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


  private generatePasswordToSubject() {
    this.submitted = true;

    setTimeout(() => {
      this.messageBox.showInDevelopment('Generar contraseña', this.subject);
      sendEvent(this.subjectEditorEvent, SubjectEditorEventType.SUBJECT_UPDATED,
        {subject: this.subject});
      this.submitted = false
    }, 200);
  }


  private activateSubject() {
    this.submitted = true;

    setTimeout(() => {
      this.messageBox.showInDevelopment('Dar de alta', this.subject);
      sendEvent(this.subjectEditorEvent, SubjectEditorEventType.SUBJECT_UPDATED,
        {subject: this.subject});
      this.submitted = false
    }, 200);
  }


  private suspendSubject() {
    this.submitted = true;

    setTimeout(() => {
      this.messageBox.showInDevelopment('Dar de baja', this.subject);
      sendEvent(this.subjectEditorEvent, SubjectEditorEventType.SUBJECT_UPDATED,
        {subject: this.subject});
      this.submitted = false
    }, 200);
  }

}
