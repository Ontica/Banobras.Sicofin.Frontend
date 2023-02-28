/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
         SimpleChanges } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable, isEmpty } from '@app/core';

import { PresentationLayer, SubscriptionHelper } from '@app/core/presentation';

import { AccessControlStateSelector } from '@app/presentation/exported.presentation.types';

import { EmptySubject, Subject, SubjectFields} from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormHandler, sendEvent } from '@app/shared/utils';

export enum SubjectHeaderEventType {
  CREATE_SUBJECT    = 'SubjectHeaderComponent.Event.CreateSubject',
  SUSPEND_SUBJECT   = 'SubjectHeaderComponent.Event.SuspendSubject',
  ACTIVE_SUBJECT    = 'SubjectHeaderComponent.Event.ActiveSubject',
  GENERATE_PASSWORD = 'SubjectHeaderComponent.Event.GeneratePassword',
}

enum SubjectHeaderFormControls {
  fullName = 'fullName',
  userID = 'userID',
  eMail = 'eMail',
  employeeNo = 'employeeNo',
  jobPosition = 'jobPosition',
  workareaUID = 'workareaUID',
}

@Component({
  selector: 'emp-ng-subject-header',
  templateUrl: './subject-header.component.html',
})
export class SubjectHeaderComponent implements OnChanges, OnInit, OnDestroy {

  @Input() subject: Subject = EmptySubject;

  @Input() canEdit = false;

  @Input() canGeneratePassword = false;

  @Input() isSuspended = false;

  @Output() subjectHeaderEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;

  controls = SubjectHeaderFormControls;

  editionMode = false;

  isLoading = false;

  workareasList: Identifiable[] = [];

  helper: SubscriptionHelper;


  constructor(private messageBox: MessageBoxService,
              private uiLayer: PresentationLayer) {
    this.helper = uiLayer.createSubscriptionHelper();
    this.initForm();
    this.enableEditor(true);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.subject && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnInit() {
    this.loadWorkareas();
  }


  ngOnDestroy() {
    this.helper.destroy();
  }


  get isSaved(): boolean {
    return !isEmpty(this.subject);
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.formHandler.disableForm(this.isSaved);
  }


  onCreateButtonClicked() {
    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    sendEvent(this.subjectHeaderEvent, SubjectHeaderEventType.CREATE_SUBJECT, {subject: this.getFormData()});
  }


  onGeneratePasswordButtonClicked() {
    this.showConfirmMessage(SubjectHeaderEventType.GENERATE_PASSWORD);
  }


  onSuspendButtonClicked() {
    this.showConfirmMessage(SubjectHeaderEventType.SUSPEND_SUBJECT);
  }


  onActiveButtonClicked() {
    this.showConfirmMessage(SubjectHeaderEventType.ACTIVE_SUBJECT);
  }


  private loadWorkareas() {
    this.isLoading = true;

    this.helper.select<Identifiable[]>(AccessControlStateSelector.WORKAREAS_LIST)
      .subscribe(x => {
        this.workareasList = x;
        this.isLoading = false;
      });
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        fullName: new FormControl('', Validators.required),
        userID: new FormControl('', Validators.required),
        eMail: new FormControl('', Validators.required),
        employeeNo: new FormControl(''),
        jobPosition: new FormControl('', Validators.required),
        workareaUID: new FormControl('', Validators.required),
      })
    );
  }


  private setFormData() {
    this.formHandler.form.reset({
      fullName: this.subject.fullName,
      userID: this.subject.userID,
      eMail: this.subject.eMail,
      employeeNo: this.subject.employeeNo,
      jobPosition: this.subject.jobPosition,
      workareaUID: this.subject.workareaUID,
    });
  }


  private getFormData(): SubjectFields {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: SubjectFields = {
      fullName: formModel.fullName ?? '',
      userID: formModel.userID ?? '',
      eMail: formModel.eMail ?? '',
      employeeNo: formModel.employeeNo ?? '',
      jobPosition: formModel.jobPosition ?? '',
      workareaUID: formModel.workareaUID ?? '',
    };

    return data;
  }


  private showConfirmMessage(eventType: SubjectHeaderEventType) {
    const confirmType: 'AcceptCancel' | 'DeleteCancel' =
      eventType === SubjectHeaderEventType.SUSPEND_SUBJECT ? 'DeleteCancel' : 'AcceptCancel';
    const title = this.getConfirmTitle(eventType);
    const message = this.getConfirmMessage(eventType);

    this.messageBox.confirm(message, title, confirmType)
      .toPromise()
      .then(x => {
        if (x) {
          sendEvent(this.subjectHeaderEvent, eventType, {subject: this.subject});
        }
      });
  }


  private getConfirmTitle(eventType: SubjectHeaderEventType): string {
    switch (eventType) {
      case SubjectHeaderEventType.GENERATE_PASSWORD: return 'Generar contraseña';
      case SubjectHeaderEventType.SUSPEND_SUBJECT: return 'Dar de baja al usuario';
      case SubjectHeaderEventType.ACTIVE_SUBJECT: return 'Dar de alta al usuario';
      default: return '';
    }
  }


  private getConfirmMessage(eventType: SubjectHeaderEventType): string {
    switch (eventType) {
      case SubjectHeaderEventType.GENERATE_PASSWORD:
        return `Esta operación generará la contraseña y se enviará al correo del usuario:
                <strong> ${this.subject.eMail}</strong>.
                <br><br>¿Genero la contraseña?`;

      case SubjectHeaderEventType.SUSPEND_SUBJECT:
        return `Esta operación <strong>dará de baja / eliminará</strong> al usuario
                <strong> (${this.subject.userID}) ${this.subject.fullName} - ${this.subject.employeeNo}</strong>.
                <br><br>¿Doy de baja al usuario?`;

      case SubjectHeaderEventType.ACTIVE_SUBJECT:
        return `Esta operación <strong>reactivará</strong> al usuario
                <strong> (${this.subject.userID}) ${this.subject.fullName} - ${this.subject.employeeNo}</strong>.
                <br><br>¿Reactivo al usuario?`;

      default: return '';
    }
  }

}
