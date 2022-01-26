/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, Identifiable, Validate } from '@app/core';

import { FormHandler } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ExternalProcessDataService } from '@app/data-services';

import { ConcilacionSICExternalProcessCommand, ExternalProcessTypeList, ExternalProcessTypes,
         RentabilidadExternalProcessCommand } from '@app/models';

enum ExternalProcessSubmitterFormControls {
  anio = 'anio',
  mes = 'mes',
  metodologia = 'metodologia',
  periodo = 'periodo',
}

@Component({
  selector: 'emp-fa-external-process-submitter',
  templateUrl: './external-process-submitter.component.html',
})
export class ExternalProcessSubmitterComponent implements OnInit {

  @Input() externalProcessType: ExternalProcessTypes = ExternalProcessTypes.Rentabilidad;

  @Output() closeEvent = new EventEmitter<void>();

  title = 'Procesos externos';

  formHandler: FormHandler;

  controls = ExternalProcessSubmitterFormControls;

  submitted = false;

  externalProcessTypeList: Identifiable[] = ExternalProcessTypeList;

  externalProcessTypes = ExternalProcessTypes;

  constructor(private externalProcessData: ExternalProcessDataService,
              private messageBox: MessageBoxService) {
  }


  get isRentabilidadType() {
    return this.externalProcessType === ExternalProcessTypes.Rentabilidad;
  }


  get isConciliacionSICType() {
    return this.externalProcessType === ExternalProcessTypes.ConciliacionSIC;
  }


  ngOnInit(): void {
    this.title = ExternalProcessTypeList.find(x => x.uid === this.externalProcessType).name;
    this.initForm();
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

    const command = this.isRentabilidadType ? this.getRentabilidadExternalProcessCommand() :
      this.getConcilacionSICExternalProcessCommand();

    this.externalProcessData.executeExternalProcess(this.externalProcessType, command)
      .toPromise()
      .then(x => {
        this.formHandler.resetForm();
        this.messageBox.show(x, this.title);
      })
      .finally(() => this.submitted = false);
  }


  private initForm() {
    if (this.formHandler) {
      return;
    }

    this.formHandler = new FormHandler(
      new FormGroup({
        anio: new FormControl(''),
        mes: new FormControl(''),
        metodologia: new FormControl(''),
        periodo: new FormControl(),
      })
    );

    this.initValidators();
  }


  private initValidators() {
    if (this.isRentabilidadType) {
      this.formHandler.clearControlValidators(this.controls.periodo);

      this.formHandler.setControlValidators(this.controls.anio,
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)]);

      this.formHandler.setControlValidators(this.controls.mes,
        [Validators.required, Validators.min(1), Validators.max(12)]);

      this.formHandler.setControlValidators(this.controls.metodologia, Validators.required);
      return;
    }

    if (this.isConciliacionSICType) {
      this.formHandler.clearControlValidators(this.controls.anio);
      this.formHandler.clearControlValidators(this.controls.mes);
      this.formHandler.clearControlValidators(this.controls.metodologia);

      this.formHandler.setControlValidators(this.controls.periodo,
        [Validators.required, Validate.periodRequired]);
    }
  }


  private getRentabilidadExternalProcessCommand(): RentabilidadExternalProcessCommand {
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


  private getConcilacionSICExternalProcessCommand(): ConcilacionSICExternalProcessCommand {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: ConcilacionSICExternalProcessCommand = {
      fechaInicio: formModel.periodo.fromDate ?? '',
      fechaFin: formModel.periodo.toDate ?? '',
    };

    return data;
  }

}
