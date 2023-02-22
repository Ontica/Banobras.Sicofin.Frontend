/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, isEmpty } from '@app/core';

import { SubscriptionHelper } from '@app/core/presentation';

import { EmptySubject, Subject, SubjectFields} from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormHandler, sendEvent } from '@app/shared/utils';

export enum SubjectHeaderEventType {
  CREATE_SUBJECT  = 'SubjectHeaderComponent.Event.CreateSubject',
  UPDATE_SUBJECT  = 'SubjectHeaderComponent.Event.UpdateSubject',
  SUSPEND_SUBJECT = 'SubjectHeaderComponent.Event.SuspendSubject',
  ACTIVE_SUBJECT  = 'SubjectHeaderComponent.Event.ActiveSubject',
}

enum SubjectHeaderFormControls {
  fullName = 'fullName',
  nickName = 'nickName',
  userID = 'userID',
  eMail = 'eMail',
}

@Component({
  selector: 'emp-ng-subject-header',
  templateUrl: './subject-header.component.html',
})
export class SubjectHeaderComponent implements OnChanges {

  @Input() subject: Subject = EmptySubject;

  @Input() canEdit = false;

  @Output() subjectHeaderEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;

  controls = SubjectHeaderFormControls;

  editionMode = false;

  isLoading = false;

  isLoadingData = false;

  helper: SubscriptionHelper;


  constructor(private messageBox: MessageBoxService) {
    this.initForm();
    this.enableEditor(true);
  }


  ngOnChanges() {
    if (this.isSaved) {
      this.enableEditor(false);
    }
  }


  get isSaved(): boolean {
    return !isEmpty(this.subject);
  }


  get isSuspended(): boolean {
    return this.subject?.status === 'suspended';
  }


  enableEditor(enable) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.formHandler.disableForm(!this.editionMode);
  }


  onSubmitForm() {
    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    const eventType = this.isSaved ? SubjectHeaderEventType.UPDATE_SUBJECT :
      SubjectHeaderEventType.CREATE_SUBJECT;

    sendEvent(this.subjectHeaderEvent, eventType, {subject: this.getFormData()});
  }


  onSuspendButtonClicked() {
    this.showConfirmMessage(SubjectHeaderEventType.SUSPEND_SUBJECT);
  }


  onActiveButtonClicked() {
    this.showConfirmMessage(SubjectHeaderEventType.ACTIVE_SUBJECT);
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        fullName: new FormControl('', Validators.required),
        nickName: new FormControl('', Validators.required),
        userID: new FormControl('', Validators.required),
        eMail: new FormControl('', Validators.required),
      })
    );
  }


  private setFormData() {
    this.formHandler.form.reset({
      fullName: this.subject.fullName,
      nickName: this.subject.nickName,
      userID: this.subject.userID,
      eMail: this.subject.eMail,
    });
  }


  private getFormData(): SubjectFields {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: SubjectFields = {
      fullName: formModel.fullName ?? '',
      nickName: formModel.nickName ?? '',
      userID: formModel.userID ?? '',
      eMail: formModel.eMail ?? '',
    };

    return data;
  }


  private showConfirmMessage(eventType: SubjectHeaderEventType) {
    let confirmType: 'AcceptCancel' | 'DeleteCancel' = 'AcceptCancel';
    let title = 'Activar usuario';
    let message = `Esta operación activará al usuario
                   <strong> ${this.subject.userID}: ${this.subject.fullName}</strong>.
                   <br><br>¿Activo al usuario?`;

    if (eventType === SubjectHeaderEventType.SUSPEND_SUBJECT) {
      confirmType = 'DeleteCancel';
      title = 'Suspender usuario';
      message = `Esta operación suspenderá al usuario
        <strong> ${this.subject.userID}: ${this.subject.fullName}</strong>.
        <br><br>¿Suspendo al usuario?`;
    }

    this.messageBox.confirm(message, title, confirmType)
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.subjectHeaderEvent, eventType, {subject: this.subject});
        }
      });
  }

}
