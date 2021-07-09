/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { EventInfo } from '@app/core';

export enum ExportReportModalEventType {
  CLOSE_MODAL_CLICKED = 'ExportReportModalComponent.Event.CloseModalClicked',
  EXPORT_EXCEL_CLICKED = 'ExportReportModalComponent.Event.ExportExcelClicked',
}

@Component({
  selector: 'emp-fa-export-report-modal',
  templateUrl: './export-report-modal.component.html',
})
export class ExportReportModalComponent implements OnChanges {

  @Input() title = 'Exportar';

  @Input() message = 'Se generará la exportación a Excel con el último filtro consultado.';

  @Input() excelFileUrl = '';

  @Output() exportReportModalEvent = new EventEmitter<EventInfo>();

  working = false;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.excelFileUrl) {
      this.working = false;
    }
  }


  get hasExcelFileUrl() {
    return !!this.excelFileUrl;
  }


  onClose() {
    this.sendEvent(ExportReportModalEventType.CLOSE_MODAL_CLICKED);
  }


  onExportButtonClicked() {
    this.working = true;
    this.sendEvent(ExportReportModalEventType.EXPORT_EXCEL_CLICKED);
  }


  private sendEvent(eventType: ExportReportModalEventType, payload?: any) {
    const event: EventInfo = {
      type: eventType,
      payload
    };

    this.exportReportModalEvent.emit(event);
  }

}
