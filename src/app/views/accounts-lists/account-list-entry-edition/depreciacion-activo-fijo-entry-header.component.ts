/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject, catchError, concat, debounceTime, distinctUntilChanged, filter, of,
         switchMap, tap } from 'rxjs';

import { Assertion, DateString, EventInfo, FlexibleIdentifiable } from '@app/core';

import { AccountsChartDataService, SubledgerDataService } from '@app/data-services';

import { AccountsListEntry, DepreciacionActivoFijoEntry, DepreciacionActivoFijoFields,
         SubledgerAccountIFRSQuery } from '@app/models';

import { MessageBoxService } from '@app/shared/containers/message-box';

import { FormHelper, sendEvent } from '@app/shared/utils';

export enum DepreciacionActivoFijoEntryHeaderEventType {
  CREATE_ENTRY = 'DepreciacionActivoFijoEntryHeaderComponent.Event.CreateEntry',
  UPDATE_ENTRY = 'DepreciacionActivoFijoEntryHeaderComponent.Event.UpdateEntry',
  DELETE_ENTRY = 'DepreciacionActivoFijoEntryHeaderComponent.Event.DeleteEntry',
}

interface DepreciacionActivoFijoEntryFormModel extends FormGroup<{
  delegacionUID: FormControl<string>;
  auxiliarHistorico: FormControl<string>;
  fechaAdquisicion: FormControl<DateString>;
  fechaInicioDepreciacion: FormControl<DateString>;
  mesesDepreciacion: FormControl<number>;
  auxiliarRevaluacion: FormControl<string>;
}> { }

@Component({
  selector: 'emp-fa-depreciacion-activo-fijo-entry-header',
  templateUrl: './depreciacion-activo-fijo-entry-header.component.html',
})
export class DepreciacionActivoFijoEntryHeaderComponent implements OnChanges, OnInit {

  @Input() accountListEntry: AccountsListEntry = null;

  @Input() isSaved = false;

  @Output() depreciacionActivoFijoEntryHeaderEvent = new EventEmitter<EventInfo>();

  form: DepreciacionActivoFijoEntryFormModel;

  formHelper = FormHelper;

  editionMode = false;

  isLedgerLoading = false;

  ledgerIFRSList: any[] = [];

  auxiliarHistoricoList$: Observable<FlexibleIdentifiable[]>;

  auxiliarHistoricoInput$ = new Subject<string>();

  auxiliarHistoricoMinTermLength = 3;

  auxiliarHistoricoLoading = false;

  auxiliarRevaluacionList$: Observable<FlexibleIdentifiable[]>;

  auxiliarRevaluacionInput$ = new Subject<string>();

  auxiliarRevaluacionMinTermLength = 3;

  auxiliarRevaluacionLoading = false;


  constructor(private subledgerData: SubledgerDataService,
              private accountsChartData: AccountsChartDataService,
              private messageBox: MessageBoxService) {
    this.initForm();
    this.enableEditor(true);
  }


  get depreciacionActivoFijoEntry(): DepreciacionActivoFijoEntry {
    return this.accountListEntry as DepreciacionActivoFijoEntry;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.accountListEntry && this.isSaved) {
      this.enableEditor(false);
    }
  }


  ngOnInit() {
    this.loadDataList();
    this.subscribeAuxiliarHistoricoList();
    this.subscribeAuxiliarRevaluacionList();
  }


  onDelegacionUIDChanges() {
    this.form.controls.auxiliarHistorico.reset();
    this.form.controls.auxiliarRevaluacion.reset();

    this.subscribeAuxiliarHistoricoList();
    this.subscribeAuxiliarRevaluacionList();
  }


  onSubmitButtonClicked() {
    if (this.formHelper.isFormReadyAndInvalidate(this.form)) {
      const eventType = this.isSaved ? DepreciacionActivoFijoEntryHeaderEventType.UPDATE_ENTRY :
        DepreciacionActivoFijoEntryHeaderEventType.CREATE_ENTRY;

      const payload = {
        entryUID: this.depreciacionActivoFijoEntry?.uid ?? '',
        entryFields: this.getFormData(),
      };

      sendEvent(this.depreciacionActivoFijoEntryHeaderEvent, eventType, payload);
    }
  }


  onDeleteButtonClicked() {
    const message = `Esta operación <strong>eliminará</strong> la cuenta` +
                    `<strong> (${this.depreciacionActivoFijoEntry.auxiliarHistorico}) ` +
                    `${this.depreciacionActivoFijoEntry.auxiliarHistoricoNombre}</strong> de la lista.` +
                    `<br><br>¿Elimino la cuenta?`;

    this.messageBox.confirm(message, 'Eliminar cuenta', 'DeleteCancel')
      .firstValue()
      .then(x => {
        if (x) {
          sendEvent(this.depreciacionActivoFijoEntryHeaderEvent,
            DepreciacionActivoFijoEntryHeaderEventType.DELETE_ENTRY,
            { entryUID: this.depreciacionActivoFijoEntry?.uid ?? '', entryFields: this.getFormData() });
        }
      });
  }


  enableEditor(enable: boolean) {
    this.editionMode = enable;

    if (!this.editionMode) {
      this.setFormData();
    }

    this.formHelper.setDisableForm(this.form, !this.editionMode);
  }


  private initForm() {
    const fb = new FormBuilder();

    this.form = fb.group({
      auxiliarHistorico: ['', Validators.required],
      fechaAdquisicion: [null as DateString, Validators.required],
      fechaInicioDepreciacion: [null as DateString, Validators.required],
      delegacionUID: ['', Validators.required],
      mesesDepreciacion: [null as number, Validators.required],
      auxiliarRevaluacion: [null],
    });
  }


  private setFormData() {
    this.form.reset({
      auxiliarHistorico: this.depreciacionActivoFijoEntry.auxiliarHistorico,
      fechaAdquisicion: this.depreciacionActivoFijoEntry.fechaAdquisicion,
      fechaInicioDepreciacion: this.depreciacionActivoFijoEntry.fechaInicioDepreciacion,
      delegacionUID: this.depreciacionActivoFijoEntry.delegacionUID,
      mesesDepreciacion: this.depreciacionActivoFijoEntry.mesesDepreciacion,
      auxiliarRevaluacion: this.depreciacionActivoFijoEntry.auxiliarRevaluacion,
    });

    this.subscribeAuxiliarHistoricoList();
    this.subscribeAuxiliarRevaluacionList();
  }


  private getFormData(): DepreciacionActivoFijoFields {
    Assertion.assert(this.form.valid, 'Programming error: form must be validated before command execution.');

    const formModel = this.form.getRawValue();

    const data: DepreciacionActivoFijoFields = {
      uid: this.depreciacionActivoFijoEntry?.uid ?? '',
      auxiliarHistorico: formModel.auxiliarHistorico ?? '',
      fechaAdquisicion: formModel.fechaAdquisicion ?? '',
      fechaInicioDepreciacion: formModel.fechaInicioDepreciacion ?? '',
      delegacionUID: formModel.delegacionUID ?? '',
      mesesDepreciacion: formModel.mesesDepreciacion ?? null,
      auxiliarRevaluacion: formModel.auxiliarRevaluacion ?? '',
    };

    return data;
  }


  private loadDataList() {
    this.isLedgerLoading = true;

    this.accountsChartData.getLedgersIFRS()
      .firstValue()
      .then(x => this.ledgerIFRSList = x)
      .finally(() => this.isLedgerLoading = false);
  }


  private subscribeAuxiliarHistoricoList() {
    this.auxiliarHistoricoList$ = concat(
      of(this.getDefaultAuxiliarList(this.depreciacionActivoFijoEntry?.auxiliarHistoricoId,
                                     this.depreciacionActivoFijoEntry?.auxiliarHistorico,
                                     this.depreciacionActivoFijoEntry?.auxiliarHistoricoNombre)),
      this.auxiliarHistoricoInput$.pipe(
        filter(keywords => this.form.controls.delegacionUID.valid &&
                           keywords !== null && keywords.length >= this.auxiliarHistoricoMinTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.auxiliarHistoricoLoading = true),
        switchMap(keywords =>
          this.subledgerData.searchSubledgerAccountsIFRS(this.getSubledgerAccountIFRSQuery(keywords, this.form.value.delegacionUID))
            .pipe(
              catchError(() => of([])),
              tap(() => this.auxiliarHistoricoLoading = false)
            ))
      )
    );
  }


  private subscribeAuxiliarRevaluacionList() {
    this.auxiliarRevaluacionList$ = concat(
      of(this.getDefaultAuxiliarList(this.depreciacionActivoFijoEntry?.auxiliarRevaluacionId,
                                     this.depreciacionActivoFijoEntry?.auxiliarRevaluacion,
                                     this.depreciacionActivoFijoEntry?.auxiliarRevaluacionNombre)),
      this.auxiliarRevaluacionInput$.pipe(
        filter(keywords => this.form.controls.delegacionUID.valid &&
                           keywords !== null && keywords.length >= this.auxiliarRevaluacionMinTermLength),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.auxiliarRevaluacionLoading = true),
        switchMap(keywords =>
          this.subledgerData.searchSubledgerAccountsIFRS(this.getSubledgerAccountIFRSQuery(keywords, this.form.value.delegacionUID))
            .pipe(
              catchError(() => of([])),
              tap(() => this.auxiliarRevaluacionLoading = false)
            ))
      )
    );
  }


  private getSubledgerAccountIFRSQuery(keywords: string, ledgerUID: string): SubledgerAccountIFRSQuery {
    const query: SubledgerAccountIFRSQuery = {
      ledgerUID,
      keywords,
    };
    return query;
  }


  private getDefaultAuxiliarList(id: number, number: string, name: string): FlexibleIdentifiable[] {
    if (this.isSaved && this.isAuxiliarIDValid(id) && this.isSavedDelegacion()) {
      const auxiliar: FlexibleIdentifiable = { id, number, name }
      return [auxiliar];
    }

    return [];
  }


  private isAuxiliarIDValid(id: number) {
    return id && id > 0;
  }


  private isSavedDelegacion() {
    return this.depreciacionActivoFijoEntry.delegacionUID === this.form.value.delegacionUID;
  }

}
