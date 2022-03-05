/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { ExecuteDatasetsCommand } from '@app/models';

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

  @Input() typeRequired = false;

  @Input() periodRequired = false;

  @Input() typeList: Identifiable[] = [];

  @Output() importDataFilterEvent = new EventEmitter<EventInfo>();

  formData = {
    fromDate: null,
    toDate: null,
    type: null,
  };


  ngOnInit(): void {
    this.initFormData();
  }


  onSearchImportedDataClicked() {
    const payload = {
      command: this.getCommand(),
    };

    sendEvent(this.importDataFilterEvent, ImportedDataFilterEventType.EXECUTE_DATA_CLICKED, payload);
  }


  private initFormData() {
    this.formData = {
      fromDate: null,
      toDate: null,
      type: null,
    };
  }


  private getCommand(): ExecuteDatasetsCommand {
    let data: ExecuteDatasetsCommand = {
      fromDate: this.formData.fromDate,
    };

    if (this.periodRequired) {
      data.toDate = this.formData.toDate;
    }

    if (this.typeRequired) {
      data.typeUID = this.formData.type;
    }

    return data;
  }

}
