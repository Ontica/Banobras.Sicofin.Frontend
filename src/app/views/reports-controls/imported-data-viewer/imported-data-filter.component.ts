/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { ExecuteDatasetsQuery, FieldConfig } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum ImportedDataFilterEventType {
  EXECUTE_DATA_CLICKED = 'ImportedDataFilterComponent.Event.ExecutehDataClicked',
}

@Component({
  selector: 'emp-fa-imported-data-filter',
  templateUrl: './imported-data-filter.component.html',
})
export class ImportedDataFilterComponent implements OnInit {

  @Input() dataType = '';

  @Input() showIconButtonToSubmit = false;

  @Input() typeFieldConfig: FieldConfig;

  @Input() additionalFieldConfig: FieldConfig;

  @Input() periodRequired = false;

  @Input() searchButtonText = 'Procesar';

  @Output() importDataFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    fromDate: null,
    toDate: null,
    type: null,
    additional: null,
  };


  ngOnInit(): void {
    this.initFormData();
  }


  get isPeriodValid(): boolean {
    if (!this.periodRequired) {
      return true;
    }

    return !!this.formData.fromDate && !!this.formData.toDate;
  }


  onSearchImportedDataClicked() {
    const payload = {
      query: this.getQuery(),
      typeSelected: this.getTypeSelected(),
    };

    sendEvent(this.importDataFilterEvent, ImportedDataFilterEventType.EXECUTE_DATA_CLICKED, payload);
  }


  private initFormData() {
    this.formData = {
      fromDate: null,
      toDate: null,
      type: null,
      additional: null,
    };
  }


  private getQuery(): ExecuteDatasetsQuery {
    let query: ExecuteDatasetsQuery = {
      fromDate: this.formData.fromDate,
    };

    if (this.periodRequired) {
      query.toDate = this.formData.toDate;
    }

    if (this.typeFieldConfig.show) {
      query.typeUID = this.formData.type;
    }

    if (this.additionalFieldConfig.show) {
      query.additionalUID = this.formData.additional;
    }

    return query;
  }


  private getTypeSelected(): Identifiable {
    if (!this.typeFieldConfig.show || this.typeFieldConfig.multiple) {
      return null;
    }

    return this.formData.type ? this.typeFieldConfig.list.find(x => x.uid === this.formData.type) : null;
  }

}
