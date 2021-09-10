/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

export enum DataTableControlsEventType {
  FILTER_CHANGED        = 'DataTableControlsComponent.Event.FilterChanged',
  EXPORT_BUTTON_CLICKED = 'DataTableControlsComponent.Event.ExportButtonClicked',
}

@Component({
  selector: 'emp-fa-data-table-controls',
  templateUrl: './data-table-controls.component.html',
})
export class DataTableControlsComponent {

  @Input() indexSelected = '';

  @Input() filter = '';

  @Output() dataTableControlsEvent = new EventEmitter<EventInfo>();


  onClearFilter() {
    this.filter = '';
    this.onFilterData();
  }


  onFilterData() {
    sendEvent(this.dataTableControlsEvent, DataTableControlsEventType.FILTER_CHANGED,
      {filter: this.filter, index: this.indexSelected});
  }


  onExportButtonClicked() {
    sendEvent(this.dataTableControlsEvent, DataTableControlsEventType.EXPORT_BUTTON_CLICKED);
  }

}
