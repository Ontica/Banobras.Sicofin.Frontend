/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, EventInfo, Identifiable } from '@app/core';

import { SubledgerDataService } from '@app/data-services';

import { Subledger } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormHandler, sendEvent } from '@app/shared/utils';

export enum SubledgerAccountCreatorEventType {
  CLOSE_MODAL_CLICKED = 'SubledgerAccountCreatorComponent.Event.CloseModalClicked',
  SUBLEDGER_ACCOUNT_CREATED = 'SubledgerAccountCreatorComponent.Event.SubledgerAccountCreated',
}

enum SubledgerAccountCreatorFormControls {
  subledger = 'subledger',
  number = 'number',
  name = 'name',
  description = 'description',
}

@Component({
  selector: 'emp-fa-subledger-account-creator',
  templateUrl: './subledger-account-creator.component.html',
})
export class SubledgerAccountCreatorComponent implements OnInit {

  @Input() ledger: Identifiable;

  @Output() subledgerAccountCreatorEvent = new EventEmitter<EventInfo>();

  formHandler: FormHandler;

  controls = SubledgerAccountCreatorFormControls;

  isLoading = false;

  subledgerList: Subledger[] = [];

  constructor(private subledgerData: SubledgerDataService,
              private messageBox: MessageBoxService) {
    this.initForm();
  }


  ngOnInit(): void {
    this.loadSubledgers();
  }


  onClose() {
    sendEvent(this.subledgerAccountCreatorEvent, SubledgerAccountCreatorEventType.CLOSE_MODAL_CLICKED);
  }


  onSubmitForm() {
    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    const payload = {
      ledgerUID: this.ledger.uid,
      subledgerAccount: this.getFormData(),
    };

    this.messageBox.showInDevelopment('Agregar auxiliar', payload);
  }


  private loadSubledgers() {
    this.isLoading = true;

    this.subledgerData.getSubledgers(this.ledger.uid)
      .toPromise()
      .then(x => this.subledgerList = x)
      .finally(() => this.isLoading = false);
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        subledger: new FormControl('', Validators.required),
        number: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
      })
    );
  }


  private getFormData(): any {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: any = {
      subledgerUID: formModel.subledger ?? '',
      number: formModel.number ?? '',
      name: formModel.name ?? '',
      description: formModel.description ?? '',
    };

    return data;
  }

}
