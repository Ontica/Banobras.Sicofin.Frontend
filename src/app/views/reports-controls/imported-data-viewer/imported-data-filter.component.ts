/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { ImportedDataCommand } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum ImportedDataFilterEventType {
  SEARCH_DATA_CLICKED = 'ImportedDataFilterComponent.Event.SearchDataClicked',
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

    sendEvent(this.importDataFilterEvent, ImportedDataFilterEventType.SEARCH_DATA_CLICKED, payload);
  }


  private initFormData() {
    this.formData = {
      fromDate: null,
      toDate: null,
      type: null,
    };
  }


  private getCommand(): ImportedDataCommand {
    let data: ImportedDataCommand = {
      fromDate: this.formData.fromDate,
    };

    if (this.periodRequired) {
      data.toDate = this.formData.toDate;
    }

    if (this.typeRequired) {
      data.type = this.formData.type;
    }

    return data;
  }

}
