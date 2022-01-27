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

import { BalanceType, BalanceTypesForMonthlyExportList, ConcilacionSICExternalProcessCommand,
         ExportBalancesCommand, ExternalProcessTypeList, ExternalProcessTypes,
         RentabilidadExternalProcessCommand } from '@app/models';

enum ExternalProcessSubmitterFormControls {
  year = 'year',
  month = 'month',
  methodology = 'methodology',
  period = 'period',
  date = 'date',
  balanceType = 'balanceType',
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

  balanceTypesForMonthlyExportList: Identifiable[] = BalanceTypesForMonthlyExportList;

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


  get isExportacionSaldosMensualesType() {
    return this.externalProcessType === ExternalProcessTypes.ExportacionSaldosMensuales;
  }


  get isExportacionSaldosDiariosType() {
    return this.externalProcessType === ExternalProcessTypes.ExportacionSaldosDiarios;
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

    this.validateExecuteExternalProcess();
  }


  private validateExecuteExternalProcess() {
    switch (this.externalProcessType) {
      case ExternalProcessTypes.Rentabilidad:
      case ExternalProcessTypes.ConciliacionSIC:
        this.executeExternalProcess();
        return;

      case ExternalProcessTypes.ExportacionSaldosMensuales:
      case ExternalProcessTypes.ExportacionSaldosDiarios:
        this.exportBalances();
        return;

      default:
        break;
    }
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


  private exportBalances() {
    this.submitted = true;

    const command = this.getExportBalancesCommand();

    this.externalProcessData.exportBalances(command)
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
        year: new FormControl(),
        month: new FormControl(),
        methodology: new FormControl(),
        period: new FormControl(),
        date: new FormControl(),
        balanceType: new FormControl(this.isExportacionSaldosDiariosType ? BalanceType.Diario : null),
      })
    );

    this.initValidators();
  }


  private initValidators() {
    if (this.isRentabilidadType) {
      this.formHandler.setControlValidators(this.controls.year,
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)]);

      this.formHandler.setControlValidators(this.controls.month,
        [Validators.required, Validators.min(1), Validators.max(12)]);

      this.formHandler.setControlValidators(this.controls.methodology, Validators.required);
      return;
    }

    if (this.isConciliacionSICType) {
      this.formHandler.setControlValidators(this.controls.period,
        [Validators.required, Validate.periodRequired]);
      return;
    }

    if (this.isExportacionSaldosMensualesType || this.isExportacionSaldosDiariosType) {
      this.formHandler.setControlValidators(this.controls.date, Validators.required);
      this.formHandler.setControlValidators(this.controls.balanceType, Validators.required);
    }
  }


  private getRentabilidadExternalProcessCommand(): RentabilidadExternalProcessCommand {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: RentabilidadExternalProcessCommand = {
      anio: formModel.year ?? '',
      mes: formModel.month ?? '',
      metodologia: formModel.methodology ?? '',
    };

    return data;
  }


  private getConcilacionSICExternalProcessCommand(): ConcilacionSICExternalProcessCommand {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: ConcilacionSICExternalProcessCommand = {
      fechaInicio: formModel.period.fromDate ?? '',
      fechaFin: formModel.period.toDate ?? '',
    };

    return data;
  }


  private getExportBalancesCommand(): ExportBalancesCommand {
    Assertion.assert(this.formHandler.form.valid,
      'Programming error: form must be validated before command execution.');

    const formModel = this.formHandler.form.getRawValue();

    const data: ExportBalancesCommand = {
      balanceType: formModel.balanceType ?? null,
      fecha: formModel.date ?? '',
    };

    return data;
  }

}
