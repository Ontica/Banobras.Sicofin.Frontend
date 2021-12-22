/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, Identifiable } from '@app/core';

import { FormHandler } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ExternalProcessDataService } from '@app/data-services';

import { ExternalProcessTypeList, ExternalProcessTypes,
         RentabilidadExternalProcessCommand } from '@app/models';

enum ExternalProcessSubmitterFormControls {
  externalProcessType = 'externalProcessType',
  anio = 'anio',
  mes = 'mes',
  metodologia = 'metodologia',
}

@Component({
  selector: 'emp-fa-external-process-submitter',
  templateUrl: './external-process-submitter.component.html',
})
export class ExternalProcessSubmitterComponent {

  @Output() closeEvent = new EventEmitter<void>();

  formHandler: FormHandler;

  controls = ExternalProcessSubmitterFormControls;

  submitted = false;

  externalProcessTypeList: Identifiable[] = ExternalProcessTypeList;

  externalProcessTypes = ExternalProcessTypes;

  constructor(private externalProcessData: ExternalProcessDataService,
              private messageBox: MessageBoxService) {
    this.initForm();
  }


  get externalProcessType(): ExternalProcessTypes {
    return this.formHandler.getControl(this.controls.externalProcessType).value ?? null;
  }


  onClose() {
    this.closeEvent.emit();
  }


  onExecuteExternalProcessClicked() {
    if (this.submitted) {
      return;
    }

    if (!this.formHandler.validateReadyForSubmit()) {
      this.formHandler.invalidateForm();
      return;
    }

    this.executeExternalProcess();
  }


  private executeExternalProcess() {
    this.submitted = true;

    this.externalProcessData.executeExternalProcess(this.externalProcessType, this.getFormData())
      .toPromise()
      .then(x => {
        this.formHandler.resetForm();
        this.messageBox.show(x, 'Procesos externos');
      })
      .finally(() => this.submitted = false);
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        externalProcessType: new FormControl('', Validators.required),
        anio: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
        mes: new FormControl('', [Validators.required, Validators.min(1), Validators.max(12)]),
        metodologia: new FormControl('', Validators.required),
      })
    );
  }


  private getFormData(): RentabilidadExternalProcessCommand {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: RentabilidadExternalProcessCommand = {
      anio: formModel.anio ?? '',
      mes: formModel.mes ?? '',
      metodologia: formModel.metodologia ?? '',
    };

    return data;
  }

}
