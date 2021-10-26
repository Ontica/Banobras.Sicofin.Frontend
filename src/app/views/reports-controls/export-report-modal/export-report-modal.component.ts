/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { EventInfo, Identifiable } from '@app/core';

import { ReportFileType } from '@app/models';

import { sendEvent } from '@app/shared/utils';

export enum ExportReportModalEventType {
  CLOSE_MODAL_CLICKED = 'ExportReportModalComponent.Event.CloseModalClicked',
  EXPORT_BUTTON_CLICKED = 'ExportReportModalComponent.Event.ExportButtonClicked',
}

@Component({
  selector: 'emp-fa-export-report-modal',
  templateUrl: './export-report-modal.component.html',
})
export class ExportReportModalComponent implements OnInit, OnChanges {

  @Input() title = 'Exportar';

  @Input() message = null;

  @Input() fileUrl = '';

  @Input() canExportToExcel = true;

  @Input() canExportToXML = false;

  @Input() canExportToPDF = false;

  @Output() exportReportModalEvent = new EventEmitter<EventInfo>();

  exportFileTypeList: Identifiable[] = [];

  selectedExportFileType = null;

  working = false;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fileUrl) {
      this.working = false;
    }
  }


  ngOnInit(): void {
    this.setExportTypesList();
  }


  get hasFileUrl() {
    return !!this.fileUrl;
  }


  onClose() {
    sendEvent(this.exportReportModalEvent, ExportReportModalEventType.CLOSE_MODAL_CLICKED);
  }


  onExportButtonClicked() {
    if (this.selectedExportFileType === null) {
      return;
    }

    this.working = true;
    sendEvent(this.exportReportModalEvent, ExportReportModalEventType.EXPORT_BUTTON_CLICKED,
      {exportFileType: this.selectedExportFileType.uid});
  }


  private setExportTypesList() {
    this.exportFileTypeList = [];

    if (this.canExportToExcel) {
      this.exportFileTypeList = [...this.exportFileTypeList, ...[{uid: ReportFileType.excel, name: 'Excel'}]];
    }

    if (this.canExportToXML) {
      this.exportFileTypeList = [...this.exportFileTypeList, ...[{uid: ReportFileType.xml, name: 'XML'}]];
    }

    if (this.canExportToPDF) {
      this.exportFileTypeList = [...this.exportFileTypeList, ...[{uid: ReportFileType.pdf, name: 'PDF'}]];
    }

    this.selectedExportFileType = this.exportFileTypeList.length > 0 ? this.exportFileTypeList[0] : null;
  }

}
