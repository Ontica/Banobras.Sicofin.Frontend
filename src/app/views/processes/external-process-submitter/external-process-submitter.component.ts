/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Assertion, DateString, Identifiable, Validate } from '@app/core';

import { FormHelper } from '@app/shared/utils';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { ExternalProcessDataService } from '@app/data-services';

import { ConcilacionSICExternalProcessCommand, DateRange, ExportBalancesCommand, ExternalProcessTypeList,
         ExternalProcessTypes, RentabilidadExternalProcessCommand, StoreBalancesInto,
         StoreBalancesIntoForMonthlyExportList } from '@app/models';

interface ExternalProcessFormModel extends FormGroup<{
  year: FormControl<number>;
  month: FormControl<number>;
  methodology: FormControl<number>;
  period: FormControl<DateRange>;
  storeInto: FormControl<StoreBalancesInto>;
  date: FormControl<DateString>;
}> { }

@Component({
  selector: 'emp-fa-external-process-submitter',
  templateUrl: './external-process-submitter.component.html',
})
export class ExternalProcessSubmitterComponent implements OnInit {

  @Input() externalProcessType: ExternalProcessTypes = ExternalProcessTypes.Rentabilidad;

  @Output() closeEvent = new EventEmitter<void>();

  title = 'Procesos externos';

  form: ExternalProcessFormModel;

  formHelper = FormHelper;

  submitted = false;

  externalProcessTypeList: Identifiable[] = ExternalProcessTypeList;

  storeBalancesIntoForMonthlyExportList: Identifiable[] = StoreBalancesIntoForMonthlyExportList;

  externalProcessTypes = ExternalProcessTypes;

  constructor(private externalProcessData: ExternalProcessDataService,
              private messageBox: MessageBoxService) {
  }


  get isRentabilidadType(): boolean {
    return this.externalProcessType === ExternalProcessTypes.Rentabilidad;
  }


  get isConciliacionSICType(): boolean {
    return this.externalProcessType === ExternalProcessTypes.ConciliacionSIC;
  }


  get isExportacionSaldosMensualesType(): boolean {
    return this.externalProcessType === ExternalProcessTypes.ExportacionSaldosMensuales;
  }


  get isExportacionSaldosDiariosType(): boolean {
    return this.externalProcessType === ExternalProcessTypes.ExportacionSaldosDiarios;
  }


  ngOnInit() {
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

    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      this.validateExecuteExternalProcess();
    }
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
        this.form.reset();
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
        this.form.reset();
        this.messageBox.show(x, this.title);
      })
      .finally(() => this.submitted = false);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      year: [],
      month: [],
      methodology: [],
      period: [],
      storeInto: [this.isExportacionSaldosDiariosType ? StoreBalancesInto.Diario : null],
      date: [],
    });

    this.initValidators();
  }


  private initValidators() {
    if (this.isRentabilidadType) {
      this.formHelper.setControlValidators(this.form.controls.year,
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)]);

      this.formHelper.setControlValidators(this.form.controls.month,
        [Validators.required, Validators.min(1), Validators.max(12)]);

      this.formHelper.setControlValidators(this.form.controls.methodology, Validators.required);
      return;
    }

    if (this.isConciliacionSICType) {
      this.formHelper.setControlValidators(this.form.controls.period,
        [Validators.required, Validate.periodRequired]);
      return;
    }

    if (this.isExportacionSaldosMensualesType || this.isExportacionSaldosDiariosType) {
      this.formHelper.setControlValidators(this.form.controls.storeInto, Validators.required);
      this.formHelper.setControlValidators(this.form.controls.date, Validators.required);
    }
  }


  private getRentabilidadExternalProcessCommand(): RentabilidadExternalProcessCommand {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: RentabilidadExternalProcessCommand = {
      anio: formModel.year ?? null,
      mes: formModel.month ?? null,
      metodologia: formModel.methodology ?? null,
    };

    return data;
  }


  private getConcilacionSICExternalProcessCommand(): ConcilacionSICExternalProcessCommand {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: ConcilacionSICExternalProcessCommand = {
      fechaInicio: formModel.period.fromDate ?? '',
      fechaFin: formModel.period.toDate ?? '',
    };

    return data;
  }


  private getExportBalancesCommand(): ExportBalancesCommand {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: ExportBalancesCommand = {
      storeInto: formModel.storeInto ?? null,
      toDate: formModel.date ?? '',
    };

    return data;
  }

}
