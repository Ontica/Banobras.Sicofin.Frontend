/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DateString, DateStringLibrary, EventInfo } from '@app/core';

import { DataToImport } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum DataImporterEventType {
  CLOSE_MODAL_CLICKED  = 'DataImporterComponent.Event.CloseModalClicked',
  GET_FORMAT_CLICKED = 'DataImporterComponent.Event.GetFormatClicked',
  IMPORT_DATA_CLICKED = 'DataImporterComponent.Event.ImportDataClicked',
}

@Component({
  selector: 'emp-fa-data-importer',
  templateUrl: './data-importer.component.html',
})
export class DataImporterComponent {

  @Input() dataType = '';

  @Input() multiFiles = false;

  @Output() dataImporterEvent = new EventEmitter<EventInfo>();

  fileControlData = null;

  date: DateString = DateStringLibrary.today();

  get showGetFormatError(): boolean {
    return !this.date;
  }


  get showFileError(): boolean {
    return this.multiFiles ?
      !this.fileControlData || this.fileControlData?.length === 0 :
      !this.fileControlData;
  }


  get showImportDataError(): boolean {
    return !this.date || this.showFileError;
  }


  onClose() {
    sendEvent(this.dataImporterEvent, DataImporterEventType.CLOSE_MODAL_CLICKED);
  }


  onGetFormatClicked() {
    sendEvent(this.dataImporterEvent, DataImporterEventType.GET_FORMAT_CLICKED, { date: this.date });
  }


  onImportDataClicked() {
    let payload: DataToImport = { date: this.date };

    if (this.multiFiles) {
      payload.files = this.fileControlData.map(x => x.file);
    } else {
      payload.file = this.fileControlData.file;
    }

    sendEvent(this.dataImporterEvent, DataImporterEventType.IMPORT_DATA_CLICKED, payload);
  }

}
