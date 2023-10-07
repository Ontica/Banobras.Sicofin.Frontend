/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Assertion, DateString, DateStringLibrary, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { ReportGroup, ReportType, ExportationType, ReportQuery, ReportData, EmptyReportData, EmptyReportQuery,
         ReportTypeFlags, EmptyReportType, FileType } from '@app/models';

import { DataTableEventType } from '@app/views/reports-controls/data-table/data-table.component';

import {
  ExportReportModalEventType
} from '@app/views/reports-controls/export-report-modal/export-report-modal.component';


export enum ReportViewerEventType {
  REPORT_ENTRY_CLICKED = 'ReportViewerComponent.Event.ReportEntryClicked',
  EXPORT_DATA_CLICKED = 'ReportViewerComponent.Event.ExportDataClicked',
}

@Component({
  selector: 'emp-fa-report-viewer',
  templateUrl: './report-viewer.component.html',
})
export class ReportViewerComponent implements OnChanges {

  @Input() reportGroup: ReportGroup;

  @Input() reportQuery: ReportQuery = Object.assign({}, EmptyReportQuery);

  @Input() selectedReportType: ReportType<ReportTypeFlags> = EmptyReportType;

  @Input() reportData: ReportData = Object.assign({}, EmptyReportData);

  @Input() queryExecuted = false;

  @Input() selectedEntry: any;

  @Input() fileUrl = '';

  @Input() isLoading = false;

  @Output() reportViewerEvent = new EventEmitter<EventInfo>();

  reportGroupName = '';

  cardHint = 'Seleccionar los filtros';

  exportationTypesList: ExportationType[] = [];

  displayExportModal = false;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.reportGroup) {
      this.setReportGroupName();
    }

    if (changes.selectedReportType || changes.reportQuery) {
      this.setExportationType();
    }

    if (changes.queryExecuted) {
      this.setText();
    }
  }


  onDataTableEvent(event: EventInfo) {
    switch (event.type as DataTableEventType) {

      case DataTableEventType.COUNT_FILTERED_ENTRIES:
        Assertion.assertValue(event.payload.displayedEntriesMessage, 'event.payload.displayedEntriesMessage');
        this.setText(event.payload.displayedEntriesMessage as string);
        return;

      case DataTableEventType.ENTRY_CLICKED:
        Assertion.assertValue(event.payload.entry.uid, 'event.payload.entry.uid');
        sendEvent(this.reportViewerEvent, ReportViewerEventType.REPORT_ENTRY_CLICKED,
          {reportEntry: event.payload.entry});
        return;

      case DataTableEventType.EXPORT_DATA:
        this.setDisplayExportModal(true);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  onExportReportModalEvent(event: EventInfo) {
    switch (event.type as ExportReportModalEventType) {

      case ExportReportModalEventType.CLOSE_MODAL_CLICKED:
        this.setDisplayExportModal(false);
        return;

      case ExportReportModalEventType.EXPORT_BUTTON_CLICKED:
        if (this.isLoading) {
          return;
        }
        Assertion.assertValue(event.payload.exportationType, 'event.payload.exportationType');
        sendEvent(this.reportViewerEvent, ReportViewerEventType.EXPORT_DATA_CLICKED, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  private setReportGroupName() {
    switch (this.reportGroup) {
      case ReportGroup.ReportesRegulatorios:
        this.reportGroupName = 'regulatorios';
        return;

      case ReportGroup.ReportesOperativos:
        this.reportGroupName = 'operativos';
        return;

      case ReportGroup.ReportesFiscales:
        this.reportGroupName = 'fiscales';
        return;

      default:
        this.reportGroupName = '';
        return;
    }
  }


  private setText(displayedEntriesMessage?: string) {
    if (!this.queryExecuted) {
      this.cardHint =  'Seleccionar los filtros';
      return;
    }

    if (displayedEntriesMessage) {
      this.cardHint = `${this.selectedReportType.name} - ${displayedEntriesMessage}`;
      return;
    }

    this.cardHint = `${this.selectedReportType.name} - ${this.reportData.entries.length} ` +
      `registros encontrados`;
  }


  private setDisplayExportModal(display) {
    this.displayExportModal = display;
    this.fileUrl = '';
  }


  private setExportationType() {
    const exportTo = this.selectedReportType?.exportTo ?? [];

    if (this.reportGroup === ReportGroup.ReportesRegulatorios) {
      this.exportationTypesList = this.getExportationTypesFiltered(exportTo as ExportationType[] ?? []);
    } else {
      this.exportationTypesList = !exportTo ? [] :
        exportTo.map(x => this.buildExportationTypeFromFileType(x));
    }
  }


  private getExportationTypesFiltered(data: ExportationType[]): ExportationType[] {
    const isFilterByDates = !!this.reportQuery.toDate && data.some(x => !!x.startDate && !!x.endDate);

    if (isFilterByDates) {
      return data.filter(x => this.isDateInRange(this.reportQuery.toDate, x.startDate, x.endDate));
    }

    return data;
  }


  private isDateInRange(date: DateString, startDate: DateString, endDate: DateString): boolean {
    return DateStringLibrary.compareDates(date, startDate) >= 0 &&
           DateStringLibrary.compareDates(date, endDate) <= 0;
  }


  private buildExportationTypeFromFileType(fileType: FileType): ExportationType {
    return {
      uid: fileType,
      name: fileType,
      fileType: fileType,
    };
  }

}
